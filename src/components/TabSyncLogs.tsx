import React, { useEffect, useState, useMemo } from "react";
import { Card, Icon } from "./UI";
import { createClient } from "@supabase/supabase-js";

// --- Client-side Supabase client helper ---
const getSupabaseClientClientSide = () => {
  const metaEnv = (import.meta as any).env || {};
  const url = metaEnv.VITE_NEXT_PUBLIC_SUPABASE_URL || 
              metaEnv.VITE_SUPABASE_URL || 
              (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) : '') ||
              '';
              
  const key = metaEnv.VITE_SUPABASE_SERVICE_ROLE_KEY || 
              metaEnv.VITE_SUPABASE_ANON_KEY || 
              (typeof process !== 'undefined' ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) : '') ||
              '';
              
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
};

interface LogItem {
  id: number;
  ticket: string;
  project_name: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  synced_at: string;
}

interface TabSyncLogsProps {
  syncTrigger?: number;
}

export function TabSyncLogs({ syncTrigger }: TabSyncLogsProps) {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      try {
        // Fetch all logs from the proxy endpoint without a strict limit
        const res = await fetch("/api/sync-logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data || []);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Proxy /api/sync-logs failed, falling back to direct Supabase fetch", err);
      }

      const supabase = getSupabaseClientClientSide();
      if (!supabase) {
        throw new Error("Supabase client could not be initialized");
      }

      const { data, error: dbError } = await supabase
        .from("project_update_logs")
        .select("*")
        .order("synced_at", { ascending: false });

      if (dbError) {
        throw dbError;
      }

      setLogs(data || []);
    } catch (err: any) {
      setError(err.message || "Kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [syncTrigger]);

  // Handle filter changes (Reset to first page)
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFieldFilter(val);
    setCurrentPage(1);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (log.project_name || "").toLowerCase().includes(q);
      const ticketMatch = (log.ticket || "").toLowerCase().includes(q);
      const valMatch =
        (log.old_value || "").toLowerCase().includes(q) ||
        (log.new_value || "").toLowerCase().includes(q);
      
      const matchesSearch = q === "" || nameMatch || ticketMatch || valMatch;

      const matchesField =
        fieldFilter === "All" ||
        log.field_changed.toLowerCase() === fieldFilter.toLowerCase();

      return matchesSearch && matchesField;
    });
  }, [logs, searchQuery, fieldFilter]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Statistics summaries
  const stats = useMemo(() => {
    let statusChanges = 0;
    let milestoneChanges = 0;
    let newProjects = 0;

    logs.forEach((log) => {
      const f = log.field_changed.toLowerCase();
      if (f.includes("status")) statusChanges++;
      else if (f.includes("milestone")) milestoneChanges++;
      else if (f.includes("new") || f.includes("create")) newProjects++;
    });

    return {
      total: logs.length,
      statusChanges,
      milestoneChanges,
      newProjects,
    };
  }, [logs]);

  const getBadgeStyle = (field: string) => {
    const f = field.toLowerCase();
    if (f.includes("status")) {
      return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
    if (f.includes("milestone")) {
      return "bg-blue-50 text-blue-700 border-blue-200/60";
    }
    if (f.includes("new") || f.includes("create")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    }
    return "bg-purple-50 text-purple-700 border-purple-200/60";
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Title & Subheading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-gray-900">
            System Sync Logs
          </h1>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
            Riwayat komparasi dan pembaruan asinkron langsung dari Notion workspace ke Supabase database.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50"
        >
          <Icon name="refresh-cw" className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Memuat..." : "Refresh Logs"}
        </button>
      </div>

      {/* KPI Highlight Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Logs</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold text-gray-900 font-display">{stats.total}</span>
            <span className="text-[11px] text-gray-400 font-medium">perubahan terdeteksi</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">Status Updates</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold text-amber-600 font-display">{stats.statusChanges}</span>
            <span className="text-[11px] text-gray-400 font-medium">pergeseran status</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Milestone Updates</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold text-blue-600 font-display">{stats.milestoneChanges}</span>
            <span className="text-[11px] text-gray-400 font-medium">perubahan milestone</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">New Projects</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold text-emerald-600 font-display">{stats.newProjects}</span>
            <span className="text-[11px] text-gray-400 font-medium">records diimpor</span>
          </div>
        </div>
      </div>

      {/* Main Logs Table Card */}
      <Card
        title="Sync Audit Logs Explorer"
        sub="Daftar lengkap audit logs pergeseran data project. Menampilkan perubahan status & milestone."
        padding="p-0"
      >
        {/* Filter Controls Row */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 select-none">
          {/* Text Search input */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Icon name="search" className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Cari berdasarkan nama project, tiket, status..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all shadow-inner"
            />
          </div>

          {/* Type dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold font-sans uppercase tracking-wider shrink-0">
              Kategori:
            </span>
            <select
              value={fieldFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="h-9 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all cursor-pointer"
            >
              <option value="All">Semua Kategori</option>
              <option value="Status">Status</option>
              <option value="Milestone">Milestone</option>
              <option value="New Project">New Project</option>
            </select>
          </div>
        </div>

        {/* Table / Loading State Container */}
        <div className="min-h-[300px] flex flex-col justify-between">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <span className="text-xs font-semibold animate-pulse">Menghubungkan ke database Supabase...</span>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-rose-500">
              <span className="text-2xl mb-2">⚠️</span>
              <span className="text-xs font-semibold">Gagal memuat log: {error}</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-450 border-t border-gray-50">
              <span className="text-3xl mb-2">📊</span>
              <p className="text-xs font-bold text-gray-700">Tidak ada logs ditemukan</p>
              <p className="text-[10.5px] text-gray-400 font-medium max-w-sm text-center leading-relaxed mt-1">
                Silakan ubah kata kunci pencarian Anda atau kategori filter yang aktif saat ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-bold tracking-wider select-none">
                    <th className="px-6 py-3.5">Tanggal & Waktu</th>
                    <th className="px-6 py-3.5">Tiket</th>
                    <th className="px-6 py-3.5">Nama Project</th>
                    <th className="px-6 py-3.5">Bidang Berubah</th>
                    <th className="px-6 py-3.5">Rincian Perubahan</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-50 font-medium text-gray-600">
                  {paginatedLogs.map((log, idx) => (
                    <tr
                      key={log.id || idx}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400 select-none">
                        {new Date(log.synced_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap select-none">
                        <span className="font-mono text-[10px] text-gray-500 font-bold bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-md">
                          {log.ticket}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 max-w-xs sm:max-w-md truncate font-semibold">
                        {log.project_name || "Untitled Project"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap select-none">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wide ${getBadgeStyle(
                            log.field_changed
                          )}`}
                        >
                          {log.field_changed}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.field_changed === "New Project" ? (
                          <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md text-[10.5px]">
                            New Record Imported
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-100/30 line-through text-[11px] max-w-[120px] truncate">
                              {log.old_value || "Empty"}
                            </span>
                            <span className="text-gray-300 font-normal select-none">&rarr;</span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100/30 font-bold text-[11px] max-w-[120px] truncate">
                              {log.new_value || "Empty"}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls Footer */}
          {!isLoading && filteredLogs.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/30 flex items-center justify-between select-none">
              <span className="text-[11px] text-gray-400 font-bold font-sans">
                Menampilkan <strong className="text-gray-700">{(currentPage - 1) * pageSize + 1}</strong>-
                <strong className="text-gray-700">
                  {Math.min(currentPage * pageSize, filteredLogs.length)}
                </strong>{" "}
                dari <strong className="text-gray-700">{filteredLogs.length}</strong> catatan sync
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:hover:border-gray-200 cursor-pointer active:scale-95 transition-all"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pg
                          ? "bg-blue-600 text-white shadow-xs"
                          : "border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:hover:border-gray-200 cursor-pointer active:scale-95 transition-all"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
