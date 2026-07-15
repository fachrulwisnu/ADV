import React, { useEffect, useState, useRef } from "react";
import { Icon } from "./UI";

interface LogItem {
  id: number;
  ticket: string;
  project_name: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  synced_at: string;
}

interface NotificationBellProps {
  onViewAllLogs: () => void;
  syncTrigger: number;
}

export function NotificationBell({ onViewAllLogs, syncTrigger }: NotificationBellProps) {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [recentCount, setRecentCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchRecentUpdates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sync-logs");
      if (res.ok) {
        const data: LogItem[] = await res.json();
        const sorted = data || [];
        setLogs(sorted);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const recent = sorted.filter(
          (log) => new Date(log.synced_at) >= yesterday
        );
        setRecentCount(recent.length);
        setHasNewUpdates(recent.length > 0);
      }
    } catch (err) {
      console.error("Error checking recent updates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentUpdates();
    const interval = setInterval(fetchRecentUpdates, 3 * 60 * 1000); // check every 3 mins
    return () => clearInterval(interval);
  }, [syncTrigger]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Refresh updates when opening
      fetchRecentUpdates();
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 transition-all cursor-pointer flex items-center justify-center h-10 w-10 shadow-xs focus:outline-none"
        title="Notifications"
      >
        <Icon name="bell" className="w-5 h-5 text-gray-500" />
        {hasNewUpdates && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
              {recentCount > 9 ? "9+" : recentCount}
            </span>
          </span>
        )}
      </button>

      {/* Immersive Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Recent Activity Logs
            </h4>
            {hasNewUpdates && (
              <span className="px-2 py-0.5 text-[10px] bg-red-50 text-red-600 rounded-full font-bold">
                {recentCount} New
              </span>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
            {isLoading && logs.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Checking updates...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No recent project updates logged.
              </div>
            ) : (
              logs.slice(0, 5).map((log) => {
                const isStatus = log.field_changed.toLowerCase().includes("status");
                const isNew = log.field_changed.toLowerCase().includes("new");
                return (
                  <div key={log.id} className="p-4 hover:bg-gray-50/60 transition-all flex flex-col gap-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-tight truncate max-w-[120px]">
                        {log.ticket}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                        {formatTimeAgo(log.synced_at)}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-gray-800 truncate">
                      {log.project_name || "Unnamed Project"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                      {isNew ? (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-md text-[9px] uppercase">
                          New Project
                        </span>
                      ) : (
                        <>
                          <span className="text-gray-400 font-medium">Changed</span>
                          <span className="font-bold text-blue-600">{log.field_changed}</span>
                          <span className="text-gray-400 font-medium">to</span>
                          <span className="font-semibold text-gray-700 truncate max-w-[80px]" title={log.new_value}>
                            {log.new_value}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer view all link */}
          <button
            onClick={() => {
              setIsOpen(false);
              onViewAllLogs();
            }}
            className="w-full py-3 bg-gray-50 hover:bg-gray-100/80 transition-all text-center text-[11.5px] font-bold text-blue-600 border-t border-gray-100 block cursor-pointer"
          >
            View All Change Logs →
          </button>
        </div>
      )}
    </div>
  );
}
