import React, { useEffect, useState } from "react";
import { Card, Icon } from "./UI";

interface LogItem {
  id: number;
  ticket: string;
  project_name: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  synced_at: string;
}

interface SyncLogsViewerProps {
  refreshTrigger?: number;
}

export function SyncLogsViewer({ refreshTrigger }: SyncLogsViewerProps) {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sync-logs?limit=50");
      if (res.ok) {
        const data = await res.json();
        setLogs(data || []);
      } else {
        setError("Failed to load logs");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  const getBadgeStyle = (field: string) => {
    const f = field.toLowerCase();
    if (f.includes("status")) {
      return "bg-amber-50 text-amber-700 border-amber-150";
    }
    if (f.includes("milestone")) {
      return "bg-blue-50 text-blue-700 border-blue-150";
    }
    if (f.includes("new") || f.includes("create")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-150";
    }
    return "bg-purple-50 text-purple-700 border-purple-150";
  };

  return (
    <Card
      title="Recent Notion Sync Logs"
      sub="Real-time change tracker comparing incoming Notion workspace updates against database records"
      padding="p-5 md:p-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 select-none">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          Sync Change Audit Logs (Recent 50)
        </span>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
        >
          <Icon name="refresh-cw" className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          Reload logs
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-semibold animate-pulse">Loading sync audit logs...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-rose-500 text-xs font-semibold">
          Error loading logs: {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-gray-450 border border-dashed border-gray-150 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-2xl mb-1">📋</span>
          <p className="text-xs font-bold text-gray-700">No sync updates logged yet</p>
          <p className="text-[10.5px] text-gray-400 font-medium max-w-xs leading-relaxed mt-1">
            Trigger a manual sync with Notion to inspect real-time comparison updates and log changed fields.
          </p>
        </div>
      ) : (
        <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3.5 divide-y divide-gray-55">
          {logs.map((log, idx) => (
            <div key={log.id || idx} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-gray-900 text-[13px] break-words">{log.project_name || "Untitled Project"}</span>
                  <span className="font-mono text-[9.5px] text-gray-400 font-bold bg-gray-50 border border-gray-150 px-1 py-0.2 rounded-md shrink-0">
                    {log.ticket}
                  </span>
                </div>
                
                <div className="text-gray-600 font-semibold flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wide ${getBadgeStyle(log.field_changed)}`}>
                    {log.field_changed}
                  </span>
                  
                  {log.field_changed === "New Project" ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50/50 px-1.5 py-0.5 rounded border border-emerald-100/50">
                      New record imported
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span className="line-through text-rose-400 font-medium">{log.old_value || "Empty"}</span>
                      <span className="text-gray-400 font-normal">&rarr;</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50/50 px-1.5 py-0.5 rounded border border-emerald-100/50">
                        {log.new_value || "Empty"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 select-none">
                <p className="text-[10px] text-gray-400 font-bold font-mono">
                  {new Date(log.synced_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
