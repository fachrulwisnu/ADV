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

  // API Route: Sync Notion to Supabase (with Delta Sync and Authorization check)
  app.post("/api/sync-notion", async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const databaseId = process.env.NOTION_DATABASE_ID;
      const notionApiKey = process.env.NOTION_API_KEY;
      
      if (!databaseId || !notionApiKey) {
        throw new Error("NOTION_DATABASE_ID and NOTION_API_KEY environment variables are required");
      }

      // Check authorization (if you implemented the secret token)
      const authHeader = req.headers['authorization'];
      const expectedSecret = process.env.SYNC_API_SECRET;
      if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      console.log(`Syncing Notion database: ${databaseId}...`);

      // 1. GET LAST SYNC TIMESTAMP
      const { data: lastSyncData } = await supabase
        .from('notion_projects')
        .select('last_synced')
        .order('last_synced', { ascending: false })
        .limit(1);

      let lastSyncIso = null;
      if (lastSyncData && lastSyncData.length > 0 && lastSyncData[0].last_synced) {
        // Subtract 5 minutes as a buffer to avoid missing edge-case updates
        const lastSyncDate = new Date(lastSyncData[0].last_synced);
        lastSyncDate.setMinutes(lastSyncDate.getMinutes() - 5);
        lastSyncIso = lastSyncDate.toISOString();
        console.log(`Performing Delta Sync. Last successful sync (with buffer): ${lastSyncIso}`);
      } else {
        console.log("No previous sync found. Performing Full Sync.");
      }

      // 2. BUILD NOTION FILTER
      const notionFilter = lastSyncIso ? {
        filter: {
          timestamp: "last_edited_time",
          last_edited_time: {
            after: lastSyncIso
          }
        }
      } : {}; // If no previous sync, fetch everything

      // 3. Pagination Loop: Fetch filtered records from Notion
      let allResults: any[] = [];
      let hasMore = true;
      let nextCursor: string | undefined = undefined;

      while (hasMore) {
        const requestBody: any = nextCursor ? { ...notionFilter, start_cursor: nextCursor } : notionFilter;
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
        console.log("No new updates found in Notion since last sync.");
        try {
          await supabase.from('worker_heartbeats').insert([{ 
            status: 'SUCCESS', 
            message: "No new updates found." 
          }]);
        } catch (heartbeatErr) {
          console.error("Failed to insert empty success heartbeat:", heartbeatErr);
        }
        res.json({ success: true, count: 0, message: "No new updates found." });
        return;
      }

      console.log(`Successfully fetched ${allResults.length} records from Notion. Processing...`);

      // 4. FETCH EXISTING DATA FOR LOGGING COMPARISON
      // Only fetch existing data for the tickets we just retrieved to save bandwidth
      const incomingTickets = allResults.map(p => {
        const props = p.properties;
        const ticketRichText = props["Ticket"]?.rich_text || [];
        return ticketRichText[0]?.plain_text || p.id;
      });

      let existingData: any[] = [];
      try {
        const { data, error } = await supabase
          .from("notion_projects")
          .select("ticket, last_status, milestone")
          .in("ticket", incomingTickets);
        if (error) {
          console.warn("Could not fetch existing projects for comparison:", error.message);
        } else {
          existingData = data || [];
        }
      } catch (e: any) {
        console.warn("Supabase fetch failed during compare setup:", e.message);
      }
      
      const existingMap = new Map(existingData.map(item => [item.ticket, item]));

      // 5. Map Data and Detect Changes (TRANSFORM)
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

      // --- BATCH UPSERT TO PREVENT 57014 TIMEOUT (LOAD) ---
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

      try {
        await supabase.from('worker_heartbeats').insert([{ 
          status: 'SUCCESS', 
          message: `Synced ${uniqueFormattedData.length} records. Updates found: ${updateLogs.length}` 
        }]);
      } catch (heartbeatErr) {
        console.error("Failed to insert success heartbeat:", heartbeatErr);
      }

      res.json({ success: true, count: uniqueFormattedData.length, updates: updateLogs.length });
    } catch (error: any) {
      console.error("Sync error:", error);
      try {
        const supabase = getSupabaseClient();
        await supabase.from('worker_heartbeats').insert([{ status: 'FAILED', message: error.message || 'Unknown error' }]);
      } catch (heartbeatErr) {
        console.error("Failed to insert failed heartbeat:", heartbeatErr);
      }
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

  // API Route: Fetch worker heartbeats from Supabase
  app.get("/api/worker-heartbeats", async (req, res) => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("worker_heartbeats")
        .select("*")
        .order("ran_at", { ascending: false })
        .limit(20);
        
      if (error) {
        throw error;
      }

      res.json(data || []);
    } catch (error: any) {
      console.error("Fetch heartbeats error:", error);
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
