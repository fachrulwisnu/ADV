import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Receive POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { secret } = body;

    // 2. Validate secret
    if (secret !== "ADVDUAR") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Get env vars
    const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
    const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("NB_SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      return new Response(JSON.stringify({ error: "Notion configuration missing in Edge Function" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
      return new Response(JSON.stringify({ error: "Supabase configuration missing in Edge Function" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase Client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 4. Fetch data from Notion database using Notion API
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
        return new Response(JSON.stringify({ error: `Notion API Error (${response.status}): ${errText}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      if (data.results && Array.isArray(data.results)) {
        allResults = [...allResults, ...data.results];
      }
      hasMore = data.has_more;
      nextCursor = data.next_cursor;
    }

    if (allResults.length === 0) {
      return new Response(JSON.stringify({ message: "No records found in Notion database.", count: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch existing projects from Supabase to detect changes for logs
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

    // Format results
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

    // Upsert projects to Supabase in chunks of 50
    const chunkArray = (array: any[], size: number) => {
      const chunked = [];
      for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
      }
      return chunked;
    };

    const dataChunks = chunkArray(uniqueFormattedData, 50);
    for (const chunk of dataChunks) {
      const { error: upsertError } = await supabase
        .from("notion_projects")
        .upsert(chunk, { onConflict: "ticket" });
      if (upsertError) {
        throw upsertError;
      }
    }

    // Insert update logs
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

    return new Response(
      JSON.stringify({
        success: true,
        count: uniqueFormattedData.length,
        updates: updateLogs.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || err }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
