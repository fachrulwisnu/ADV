import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Lazy clients helper to avoid crashes if environment variables are not supplied on startup
let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are required");
    }
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

// --- TRANSFORM: Robust Cleansing helper function ---
function extractNotionValue(prop: any): any {
  if (!prop) return null;
  switch (prop.type) {
    case 'title': 
      return prop.title?.map((t: any) => t.plain_text).join("") || null;
    case 'rich_text': 
      return prop.rich_text?.map((t: any) => t.plain_text).join("") || null; // Ensures multiline text (\n) is fully captured
    case 'select': 
      return prop.select?.name || null;
    case 'multi_select': 
      return prop.multi_select?.map((s: any) => s.name).join(", ") || null;
    case 'date': 
      return prop.date?.start || null;
    case 'number': 
      return prop.number !== null && prop.number !== undefined ? prop.number : null; // Explicitly handle 0 or null
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

// --- HELPER: Chunk Array for Batch Inserts to prevent Timeout ---
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunked: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Sync Notion to Supabase
  app.post("/api/sync-notion", async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const databaseId = process.env.NOTION_DATABASE_ID;
      const notionApiKey = process.env.NOTION_API_KEY;
      
      if (!databaseId || !notionApiKey) {
        throw new Error("NOTION_DATABASE_ID and NOTION_API_KEY environment variables are required");
      }

      console.log(`Syncing Notion database: ${databaseId}...`);
      
      // 1. Fetch Existing Data from Supabase for Comparison
      let existingData: any[] = [];
      try {
        const { data, error } = await supabase.from("notion_projects").select("ticket, last_status, milestone");
        if (error) {
          console.warn("Could not fetch existing projects for comparison (table might be empty or not exists yet):", error.message);
        } else {
          existingData = data || [];
        }
      } catch (e: any) {
        console.warn("Supabase fetch failed during compare setup:", e.message);
      }
      
      const existingMap = new Map(existingData.map(item => [item.ticket, item]));

      // 2. Pagination Loop: Fetch ALL records from Notion
      let allResults: any[] = [];
      let hasMore = true;
      let nextCursor: string | undefined = undefined;

      while (hasMore) {
        const requestBody: any = nextCursor ? { start_cursor: nextCursor } : {};
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${notionApiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Notion API Error (${response.status}): ${errText}`);
        }
        
        const data = await response.json() as any;
        if (data.results && Array.isArray(data.results)) {
          allResults = [...allResults, ...data.results];
        }
        hasMore = data.has_more;
        nextCursor = data.next_cursor;
      }

      if (allResults.length === 0) {
        throw new Error("No results found in Notion database.");
      }

      console.log(`Successfully fetched ${allResults.length} records from Notion. Processing...`);

      // 3. Map Data and Detect Changes
      const updateLogs: any[] = [];
      const formattedData = allResults.map((page: any) => {
        const props = page.properties;
        
        // Execute Data Cleansing
        const flatProperties: Record<string, any> = {};
        for (const key in props) {
          flatProperties[key] = extractNotionValue(props[key]);
        }

        const ticket = flatProperties["Ticket"] || page.id;
        const project_name = flatProperties["Project Name"] || "";
        const last_status = flatProperties["Last Status"] || "";
        const milestone = flatProperties["Milestone"] || "";
        const created_time = props["Created time"]?.date?.start || new Date().toISOString();

        // Compare with existing DB data
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
          raw_data: props,               // <-- The original, untouched Notion payload
          cleansed_data: flatProperties, // <-- The new, flat, cleansed data
          last_synced: new Date().toISOString()
        };
      });

      // --- FIX APPLIED HERE: BATCH UPSERT TO PREVENT 57014 TIMEOUT ---
      const uniqueFormattedData = Array.from(
        new Map(formattedData.map(item => [item.ticket, item])).values()
      );
      const BATCH_SIZE = 50; // Insert 50 records at a time
      const dataChunks = chunkArray(uniqueFormattedData, BATCH_SIZE);

      console.log(`Parsed ${formattedData.length} records (${uniqueFormattedData.length} unique). Syncing with Supabase in ${dataChunks.length} chunks...`);
      for (const chunk of dataChunks) {
        const { error } = await supabase.from("notion_projects").upsert(chunk, { onConflict: "ticket" });
        if (error) {
          throw error;
        }
      }

      if (updateLogs.length > 0) {
        // Deduplicate update logs by ticket and field_changed to avoid redundant logging
        const uniqueUpdateLogs = Array.from(
          new Map(updateLogs.map(log => [`${log.ticket}-${log.field_changed}`, log])).values()
        );
        console.log(`Inserting ${uniqueUpdateLogs.length} unique update logs in chunks...`);
        const logChunks = chunkArray(uniqueUpdateLogs, 100);
        for (const logChunk of logChunks) {
          const { error: logError } = await supabase.from("project_update_logs").insert(logChunk);
          if (logError) {
            console.error("Failed to insert update logs to Supabase:", logError.message);
          }
        }
      }

      res.json({ success: true, count: uniqueFormattedData.length, updates: updateLogs.length });
    } catch (error: any) {
      console.error("Sync error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // API Route: Fetch project update logs from Supabase
  app.get("/api/sync-logs", async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const limitVal = req.query.limit ? parseInt(req.query.limit as string, 10) : null;
      
      let query = supabase
        .from("project_update_logs")
        .select("*")
        .order("synced_at", { ascending: false });
        
      if (limitVal && !isNaN(limitVal)) {
        query = query.limit(limitVal);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      res.json(data || []);
    } catch (error: any) {
      console.error("Fetch logs error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // API Route: Fetch from Supabase to client-compatible JSON structure
  app.get("/api/projects", async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("notion_projects").select("*");
      
      if (error) {
        throw error;
      }

      const formatted = (data || []).map((dbRow: any) => {
        return {
          "Ticket": dbRow.ticket,
          "Project Name": dbRow.project_name,
          "Last Status": dbRow.last_status,
          "Milestone": dbRow.milestone,
          "Created time": dbRow.created_time,
          ...(dbRow.cleansed_data || dbRow.raw_data)
        };
      });

      res.json(formatted);
    } catch (error: any) {
      console.error("Fetch error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
