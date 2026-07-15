import React, { useEffect, useState } from "react";
import { Card, Icon, Pill } from "./UI";

interface HeartbeatItem {
  id: number;
  ran_at: string;
  status: "SUCCESS" | "FAILED";
  message: string;
}

interface TabWorkerStatusProps {
  syncTrigger?: number;
}

export function TabWorkerStatus({ syncTrigger }: TabWorkerStatusProps) {
  const [heartbeats, setHeartbeats] = useState<HeartbeatItem[]>([]);
  const [isHealthy, setIsHealthy] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeartbeats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/worker-heartbeats");
      if (res.ok) {
        const data = await res.json();
        setHeartbeats(data || []);
        
        // Determine health: if there's any runs, check if the latest is SUCCESS and ran within 4 hours
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          const lastRunTime = new Date(latest.ran_at).getTime();
          const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;
          
          setIsHealthy(latest.status === "SUCCESS" && lastRunTime > fourHoursAgo);
        } else {
          setIsHealthy(true); // Default to true if no runs have occurred yet
        }
      } else {
        setError("Gagal memuat status worker.");
      }
    } catch (err: any) {
      setError(err.message || "Kesalahan koneksi server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeartbeats();
  }, [syncTrigger]);

  const handleRefresh = () => {
    fetchHeartbeats();
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Immersive Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-display">
            Worker Status & Health
          </h1>
          <p className="text-xs text-gray-450 font-medium leading-relaxed mt-1">
            Monitor automated background synchronization jobs and Vercel Cron reliability.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="p-2 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all h-10 w-10 flex items-center justify-center cursor-pointer shadow-xs focus:outline-none"
            title="Refresh Status"
          >
            <Icon name="refresh-cw" className={`w-4 h-4 text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <div
            className={`px-4 h-10 rounded-xl text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-2 border shadow-xs ${
              isHealthy
                ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                : "bg-rose-50 text-rose-700 border-rose-150"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isHealthy ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
            {isHealthy ? "System Healthy" : "System Delayed / Error"}
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Cron Schedule" sub="Automated Interval">
          <div className="flex items-center gap-3.5 py-1">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50">
              <Icon name="clock" className="w-6 h-6 stroke-[2px]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frequency</p>
              <p className="text-sm font-bold text-gray-800 font-display mt-0.5">Every 3 Hours</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">0 */3 * * * (Vercel Cron)</p>
            </div>
          </div>
        </Card>

        <Card title="Latest Run" sub="Most Recent Heartbeat">
          <div className="flex items-center gap-3.5 py-1">
            <div className={`p-3 rounded-xl border ${heartbeats.length > 0 && heartbeats[0].status === "SUCCESS" ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-rose-50 text-rose-650 border-rose-100/50"}`}>
              <Icon name="activity" className="w-6 h-6 stroke-[2px]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timestamp</p>
              <p className="text-sm font-bold text-gray-800 font-display mt-0.5">
                {heartbeats.length > 0 ? new Date(heartbeats[0].ran_at).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                }) : "No logs recorded"}
              </p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                Status: <strong className={heartbeats.length > 0 && heartbeats[0].status === "SUCCESS" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {heartbeats.length > 0 ? heartbeats[0].status : "N/A"}
                </strong>
              </p>
            </div>
          </div>
        </Card>

        <Card title="Total Sync History" sub="Heartbeat records count">
          <div className="flex items-center gap-3.5 py-1">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100/50">
              <Icon name="layers" className="w-6 h-6 stroke-[2px]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Database Entries</p>
              <p className="text-xl font-extrabold text-gray-800 font-display mt-0.5">{heartbeats.length} / 20</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Retained historical logs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Heartbeat Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-gray-50 px-6 py-4.5 flex items-center justify-between bg-gray-50/20">
          <div>
            <h3 className="text-sm font-bold text-gray-800 font-display tracking-tight">
              Execution Heartbeats Log
            </h3>
            <p className="text-[11px] text-gray-400 font-sans mt-0.5">
              Displays latest 20 sync execution heartbeats recorded by the server API.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-gray-450 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
              Loading heartbeats history...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-xs text-rose-500 font-medium">
              {error}
            </div>
          ) : heartbeats.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              Belum ada log heartbeat yang tersimpan. Jalankan sinkronisasi untuk memicu log pertama!
            </div>
          ) : (
            <table className="w-full text-left border-collapse select-text">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                  <th className="px-6 py-4">Execution Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Message / Details</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50/70 font-medium">
                {heartbeats.map((beat) => {
                  const isSuccess = beat.status === "SUCCESS";
                  return (
                    <tr key={beat.id} className="hover:bg-gray-50/30 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-sans">
                        {new Date(beat.ran_at).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                            isSuccess
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {beat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-sans max-w-lg break-words">
                        {beat.message}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
