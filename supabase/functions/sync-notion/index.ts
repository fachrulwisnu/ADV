import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- CORE SYNCHRONIZATION LOGIC ---
async function syncNotionData() {
  let NOTION_API_KEY: string | undefined;
  let NOTION_DATABASE_ID: string | undefined;
  let SUPABASE_SERVICE_ROLE_KEY: string | undefined;
  let SUPABASE_URL: string | undefined;

  try {
    NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
    NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");
    SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("NB_SUPABASE_SERVICE_ROLE_KEY");
    SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  } catch (envError: any) {
    console.error("Failed to read environment variables:", envError.message || envError);
  }

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error("CRITICAL: Notion configuration (NOTION_API_KEY or NOTION_DATABASE_ID) is missing.");
    throw new Error("Notion configuration missing in Edge Function");
  }

  if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
    console.error("CRITICAL: Supabase configuration (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL) is missing.");
    throw new Error("Supabase configuration missing in Edge Function");
  }

  // Initialize Supabase Client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Fetch data from Notion database using Notion API
  let allResults: any[] = [];
  let hasMore = true;
  let nextCursor: string | undefined = undefined;

  while (hasMore) {
    const requestBody: any = nextCursor ? { start_cursor: nextCursor } : {};
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Notion API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      allResults = [...allResults, ...data.results];
    }
    hasMore = data.has_more;
    nextCursor = data.next_cursor;
  }

  if (allResults.length === 0) {
    return { success: true, count: 0, updates: 0, message: "No records found in Notion database." };
  }

  // 2. Fetch existing projects from Supabase to detect changes for logs
  let existingData: any[] = [];
  const { data: dbData, error: fetchError } = await supabase
    .from("notion_projects")
    .select("ticket, last_status, milestone");

  if (!fetchError && dbData) {
    existingData = dbData;
  }

  const existingMap = new Map(existingData.map(item => [item.ticket, item]));
  const updateLogs: any[] = [];

  // Helper to extract notion values
  function extractNotionValue(prop: any): any {
    if (!prop) return null;
    switch (prop.type) {
      case 'title': 
        return prop.title?.map((t: any) => t.plain_text).join("") || null;
      case 'rich_text': 
        return prop.rich_text?.map((t: any) => t.plain_text).join("") || null;
      case 'select': 
        return prop.select?.name || null;
      case 'multi_select': 
        return prop.multi_select?.map((s: any) => s.name).join(", ") || null;
      case 'date': 
        return prop.date?.start || null;
      case 'number': 
        return prop.number !== null && prop.number !== undefined ? prop.number : null;
      case 'status': 
        return prop.status?.name || null;
      case 'formula': 
        return prop.formula?.type === 'string' 
          ? prop.formula.string 
          : prop.formula?.number !== undefined 
            ? prop.formula.number 
            : null;
      case 'checkbox': 
        return prop.checkbox || false;
      default: 
        return null;
    }
  }

  // 3. Format results
  const formattedData = allResults.map((page: any) => {
    const props = page.properties;
    const flatProperties: Record<string, any> = {};
    for (const key in props) {
      flatProperties[key] = extractNotionValue(props[key]);
    }

    const ticket = flatProperties["Ticket"] || page.id;
    const project_name = flatProperties["Project Name"] || "";
    const last_status = flatProperties["Last Status"] || "";
    const milestone = flatProperties["Milestone"] || "";
    const created_time = props["Created time"]?.date?.start || new Date().toISOString();

    // Compare with existing DB data for logs
    const oldRecord = existingMap.get(ticket);
    if (oldRecord) {
      if (oldRecord.last_status !== last_status) {
        updateLogs.push({
          ticket,
          project_name,
          field_changed: "Status",
          old_value: oldRecord.last_status || "Empty",
          new_value: last_status || "Empty",
          synced_at: new Date().toISOString()
        });
      }
      if (oldRecord.milestone !== milestone) {
        updateLogs.push({
          ticket,
          project_name,
          field_changed: "Milestone",
          old_value: oldRecord.milestone || "Empty",
          new_value: milestone || "Empty",
          synced_at: new Date().toISOString()
        });
      }
    } else {
      updateLogs.push({
        ticket,
        project_name,
        field_changed: "New Project",
        old_value: "N/A",
        new_value: "Created",
        synced_at: new Date().toISOString()
      });
    }

    return {
      ticket,
      project_name,
      last_status,
      milestone,
      created_time,
      raw_data: props,
      cleansed_data: flatProperties,
      last_synced: new Date().toISOString()
    };
  });

  // Remove duplicates by ticket
  const uniqueFormattedData = Array.from(
    new Map(formattedData.map(item => [item.ticket, item])).values()
  );

  // Helper to chunk arrays
  const chunkArray = (array: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  // 4. Upsert projects to Supabase in chunks of 50
  const dataChunks = chunkArray(uniqueFormattedData, 50);
  for (const chunk of dataChunks) {
    const { error: upsertError } = await supabase
      .from("notion_projects")
      .upsert(chunk, { onConflict: "ticket" });
    if (upsertError) {
      throw upsertError;
    }
  }

  // 5. Insert update logs
  if (updateLogs.length > 0) {
    const uniqueUpdateLogs = Array.from(
      new Map(updateLogs.map(log => [`${log.ticket}-${log.field_changed}`, log])).values()
    );
    const logChunks = chunkArray(uniqueUpdateLogs, 100);
    for (const logChunk of logChunks) {
      const { error: logError } = await supabase
        .from("project_update_logs")
        .insert(logChunk);
      if (logError) {
        console.error("Failed to insert update logs:", logError.message);
      }
    }
  }

  return {
    success: true,
    count: uniqueFormattedData.length,
    updates: updateLogs.length,
  };
}

// --- CRON SCHEDULER (Runs every 2 hours) ---
try {
  if (typeof (Deno as any).cron === "function") {
    (Deno as any).cron("sync-notion-cron", "0 */2 * * *", async () => {
      console.log("Cron triggered: Starting Notion to Supabase Sync...");
      try {
        const result = await syncNotionData();
        console.log(`Cron successful: Synced ${result.count} records, ${result.updates} updates.`);
      } catch (err: any) {
        console.error("Cron failed:", err.message || err);
      }
    });
    console.log("Successfully registered sync-notion-cron via Deno.cron");
  } else {
    console.warn("Deno.cron is not supported or enabled in this environment.");
  }
} catch (cronRegError: any) {
  console.error("Failed to register Deno.cron during initialization:", cronRegError.message || cronRegError);
}

// --- HTTP SERVER HANDLER ---
serve(async (req) => {
  // 1. Handle CORS OPTIONS preflight first - NO try/catch or JSON reading to guarantee safety
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Wrap all other requests in a high-level try-catch block
  try {
    // 2. Reject any requests that are not POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Ensure we only read JSON body on POST requests
    let body: any = {};
    try {
      body = await req.json();
    } catch (parseErr: any) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body: " + (parseErr.message || parseErr) }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { secret } = body;

    // 4. Validate manual trigger secret key
    if (secret !== "ADVDUAR") {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Run core synchronization logic
    const result = await syncNotionData();

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (err: any) {
    console.error("Edge function execution error:", err.message || err);
    return new Response(
      JSON.stringify({ error: err.message || err }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
