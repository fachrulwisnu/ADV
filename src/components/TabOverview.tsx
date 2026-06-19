import React, { useState, useMemo } from "react";
import { DashboardDataset } from "../types";
import { Card, Icon } from "./UI";
import { statusGroupOf } from "../parser";

const HISTORICAL_QUEUE_SNAPSHOT = [
  {
    "Project On Queue": "W5 Mar 26",
    "Column11": "W1 Apr 26",
    "Column18": "W2 Apr 26",
    "Column25": "W3 Apr 26"
  },
  {
    "Project On Queue": 1,
    "Column5": 23110064,
    "Column6": "Recon Data Electronic Transaksi H2H Mesin Depos.id",
    "Column7": "BIMO ADI NURZAMAN",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 1,
    "Column12": 23110064,
    "Column13": "Recon Data Electronic Transaksi H2H Mesin Depos.id",
    "Column14": "BIMO ADI NURZAMAN",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 1,
    "Column19": 23110064,
    "Column20": "Recon Data Electronic Transaksi H2H Mesin Depos.id",
    "Column21": "BIMO ADI NURZAMAN",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 1,
    "Column26": "Roy_001",
    "Column27": "FPS Interface Saldo Kill By XML C2",
    "Column28": "ROY PERMANA",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 2,
    "Column5": "Roy_001",
    "Column6": "FPS Interface Saldo Kill By XML C2",
    "Column7": "ROY PERMANA",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 2,
    "Column12": "Roy_001",
    "Column13": "FPS Interface Saldo Kill By XML C2",
    "Column14": "ROY PERMANA",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 2,
    "Column19": "Roy_001",
    "Column20": "FPS Interface Saldo Kill By XML C2",
    "Column21": "ROY PERMANA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 2,
    "Column26": 25020019,
    "Column27": "Pembuatan Menu Sentralisasi ADMIN CPC dari DCT Desktop ke DCT WEB",
    "Column28": "MUHAMMAD EUROSKI YUDISETYO",
    "Column29": "NIKEN YULASTRI",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 3,
    "Column5": 24110077,
    "Column6": "DISCLAIM DOWNTIME (BANK BCA)",
    "Column7": "MUFID NUR TAMAM",
    "Column8": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column9": "CENTRALIZED OPERATION SUPPORT",
    "Column11": 3,
    "Column12": 24110077,
    "Column13": "DISCLAIM DOWNTIME (BANK BCA)",
    "Column14": "MUFID NUR TAMAM",
    "Column15": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column16": "CENTRALIZED OPERATION SUPPORT",
    "Column18": 3,
    "Column19": 24110077,
    "Column20": "DISCLAIM DOWNTIME (BANK BCA)",
    "Column21": "MUFID NUR TAMAM",
    "Column22": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column23": "CENTRALIZED OPERATION SUPPORT",
    "Column25": 3,
    "Column26": 25060059,
    "Column27": "Penyesuaian API Route Plan EasyGo",
    "Column28": "DIVA ADELIA PUTRA",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 4,
    "Column5": 25020019,
    "Column6": "Pembuatan Menu Sentralisasi ADMIN CPC dari DCT Desktop ke DCT WEB",
    "Column7": "MUHAMMAD EUROSKI YUDISETYO",
    "Column8": "NIKEN YULASTRI",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 4,
    "Column12": 25020019,
    "Column13": "Pembuatan Menu Sentralisasi ADMIN CPC dari DCT Desktop ke DCT WEB",
    "Column14": "MUHAMMAD EUROSKI YUDISETYO",
    "Column15": "NIKEN YULASTRI",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 4,
    "Column19": 25020019,
    "Column20": "Pembuatan Menu Sentralisasi ADMIN CPC dari DCT Desktop ke DCT WEB",
    "Column21": "MUHAMMAD EUROSKI YUDISETYO",
    "Column22": "NIKEN YULASTRI",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 4,
    "Column26": 25050045,
    "Column27": "Enhance Portal Cosy Perubahan PIN & Password, dan Approval Over Limit",
    "Column28": "BIMO ADI NURZAMAN",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 5,
    "Column5": 25060059,
    "Column6": "Penyesuaian API Route Plan EasyGo",
    "Column7": "DIVA ADELIA PUTRA",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 5,
    "Column12": 25060059,
    "Column13": "Penyesuaian API Route Plan EasyGo",
    "Column14": "DIVA ADELIA PUTRA",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 5,
    "Column19": 25060059,
    "Column20": "Penyesuaian API Route Plan EasyGo",
    "Column21": "DIVA ADELIA PUTRA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 5,
    "Column26": 25070070,
    "Column27": "Enhancement Penambahan Materai dan Import PDF Coretax pada Faktur Insyst",
    "Column28": "NANDANA BHAKTI KHAER",
    "Column29": "YUNI SUDIRMAN",
    "Column30": "FINANCE & ACCOUNTING"
  },
  {
    "Project On Queue": 6,
    "Column5": 25050045,
    "Column6": "Enhance Portal Cosy Perubahan PIN & Password, dan Approval Over Limit",
    "Column7": "BIMO ADI NURZAMAN",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 6,
    "Column12": 25050045,
    "Column13": "Enhance Portal Cosy Perubahan PIN & Password, dan Approval Over Limit",
    "Column14": "BIMO ADI NURZAMAN",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 6,
    "Column19": 25050045,
    "Column20": "Enhance Portal Cosy Perubahan PIN & Password, dan Approval Over Limit",
    "Column21": "BIMO ADI NURZAMAN",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 6,
    "Column26": 25080080,
    "Column27": "Enhancement Monitoring Risk Event Phase 4 : DCT Loading Berita Acara Manual Loading",
    "Column28": "ROY PERMANA",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 7,
    "Column5": 25070070,
    "Column6": "Enhancement Penambahan Materai dan Import PDF Coretax pada Faktur Insyst",
    "Column7": "NANDANA BHAKTI KHAER",
    "Column8": "YUNI SUDIRMAN",
    "Column9": "FINANCE & ACCOUNTING",
    "Column11": 7,
    "Column12": 25070070,
    "Column13": "Enhancement Penambahan Materai dan Import PDF Coretax pada Faktur Insyst",
    "Column14": "NANDANA BHAKTI KHAER",
    "Column15": "YUNI SUDIRMAN",
    "Column16": "FINANCE & ACCOUNTING",
    "Column18": 7,
    "Column19": 25070070,
    "Column20": "Enhancement Penambahan Materai dan Import PDF Coretax pada Faktur Insyst",
    "Column21": "NANDANA BHAKTI KHAER",
    "Column22": "YUNI SUDIRMAN",
    "Column23": "FINANCE & ACCOUNTING",
    "Column25": 7,
    "Column26": 25090091,
    "Column27": "Enhancement Sistem untuk Loading Sebagian (Unfinished RUN)",
    "Column28": "ALLBY VALDIAN FURIAWAN",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 8,
    "Column5": 25080080,
    "Column6": "Enhancement Monitoring Risk Event Phase 4 : DCT Loading Berita Acara Manual Loading",
    "Column7": "ROY PERMANA",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 8,
    "Column12": 25080080,
    "Column13": "Enhancement Monitoring Risk Event Phase 4 : DCT Loading Berita Acara Manual Loading",
    "Column14": "ROY PERMANA",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 8,
    "Column19": 25080080,
    "Column20": "Enhancement Monitoring Risk Event Phase 4 : DCT Loading Berita Acara Manual Loading",
    "Column21": "ROY PERMANA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 8,
    "Column26": 25100101,
    "Column27": "Host to Host Setoran Mesin Kisan sampai Terkredit ke Maybank",
    "Column28": "NANDANA BHAKTI KHAER",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 9,
    "Column5": 25090091,
    "Column6": "Enhancement Sistem untuk Loading Sebagian (Unfinished RUN)",
    "Column7": "ROY PERMANA",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 9,
    "Column12": 25090091,
    "Column13": "Enhancement Sistem untuk Loading Sebagian (Unfinished RUN)",
    "Column14": "ROY PERMANA",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 9,
    "Column19": 25090091,
    "Column20": "Enhancement Sistem untuk Loading Sebagian (Unfinished RUN)",
    "Column21": "ROY PERMANA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 9,
    "Column26": 25100107,
    "Column27": "Enhancement E-Pricing Batch 2",
    "Column28": "NANDANA BHAKTI KHAER",
    "Column29": "AMANDHA MARIZA",
    "Column30": "MARKETING"
  },
  {
    "Project On Queue": 10,
    "Column5": 25100101,
    "Column6": "Host to Host Setoran Mesin Kisan sampai Terkredit ke Maybank",
    "Column7": "NANDANA BHAKTI KHAER",
    "Column8": "JUNITA",
    "Column9": "BUSINESS PROCESS DEVELOPMENT",
    "Column11": 10,
    "Column12": 25100101,
    "Column13": "Host to Host Setoran Mesin Kisan sampai Terkredit ke Maybank",
    "Column14": "NANDANA BHAKTI KHAER",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 10,
    "Column19": 25100101,
    "Column20": "Host to Host Setoran Mesin Kisan sampai Terkredit ke Maybank",
    "Column21": "NANDANA BHAKTI KHAER",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 10,
    "Column26": 26010013,
    "Column27": "Enhance lanjutan sistem PIC flm advance open lock validation",
    "Column28": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column29": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column30": "CENTRALIZED OPERATION SUPPORT"
  },
  {
    "Project On Queue": 11,
    "Column5": 25100107,
    "Column6": "Enhancement E-Pricing Batch 2",
    "Column7": "NANDANA BHAKTI KHAER",
    "Column8": "AMANDHA MARIZA",
    "Column9": "MARKETING",
    "Column11": 11,
    "Column12": 25100107,
    "Column13": "Enhancement E-Pricing Batch 2",
    "Column14": "NANDANA BHAKTI KHAER",
    "Column15": "AMANDHA MARIZA",
    "Column16": "MARKETING",
    "Column18": 11,
    "Column19": 25100107,
    "Column20": "Enhancement E-Pricing Batch 2",
    "Column21": "NANDANA BHAKTI KHAER",
    "Column22": "AMANDHA MARIZA",
    "Column23": "MARKETING",
    "Column25": 11,
    "Column26": 25100103,
    "Column27": "Enhancement Insyst dan DCT Web",
    "Column28": "NANDANA BHAKTI KHAER",
    "Column29": "YUNI SUDIRMAN",
    "Column30": "FINANCE & ACCOUNTING"
  },
  {
    "Project On Queue": 12,
    "Column5": 26010013,
    "Column6": "Enhance lanjutan sistem PIC flm advance open lock validation",
    "Column7": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column8": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column9": "CENTRALIZED OPERATION SUPPORT",
    "Column11": 12,
    "Column12": 26010013,
    "Column13": "Enhance lanjutan sistem PIC flm advance open lock validation",
    "Column14": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column15": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column16": "CENTRALIZED OPERATION SUPPORT",
    "Column18": 12,
    "Column19": 26010013,
    "Column20": "Enhance lanjutan sistem PIC flm advance open lock validation",
    "Column21": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column22": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column23": "CENTRALIZED OPERATION SUPPORT",
    "Column25": 12,
    "Column26": 26020016,
    "Column27": "Enhance DCT FLM - Request FLM Sektor",
    "Column28": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column29": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column30": "CENTRALIZED OPERATION SUPPORT"
  },
  {
    "Project On Queue": 13,
    "Column5": 25100103,
    "Column6": "Enhancement Insyst dan DCT Web",
    "Column7": "NANDANA BHAKTI KHAER",
    "Column8": "YUNI SUDIRMAN",
    "Column9": "FINANCE & ACCOUNTING",
    "Column11": 13,
    "Column12": 25100103,
    "Column13": "Enhancement Insyst dan DCT Web",
    "Column14": "NANDANA BHAKTI KHAER",
    "Column15": "YUNI SUDIRMAN",
    "Column16": "FINANCE & ACCOUNTING",
    "Column18": 13,
    "Column19": 25100103,
    "Column20": "Enhancement Insyst dan DCT Web",
    "Column21": "NANDANA BHAKTI KHAER",
    "Column22": "YUNI SUDIRMAN",
    "Column23": "FINANCE & ACCOUNTING",
    "Column25": 13,
    "Column26": 26030028,
    "Column27": "Enhancement Flow Process Planner CIT",
    "Column28": "ILHAM NUR HIDAYAT",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Project On Queue": 14,
    "Column5": 26020016,
    "Column6": "Enhance DCT FLM - Request FLM Sektor",
    "Column7": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column8": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column9": "CENTRALIZED OPERATION SUPPORT",
    "Column11": 14,
    "Column12": 26020016,
    "Column13": "Enhance DCT FLM - Request FLM Sektor",
    "Column14": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column15": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column16": "CENTRALIZED OPERATION SUPPORT",
    "Column18": 14,
    "Column19": 26020016,
    "Column20": "Enhance DCT FLM - Request FLM Sektor",
    "Column21": "HASAN KHOIRUL ARI SETIYAWAN",
    "Column22": "HANGGA DAVID TORA ANGGRIAWAN",
    "Column23": "CENTRALIZED OPERATION SUPPORT",
    "Column25": 14,
    "Column26": 26030035,
    "Column27": "Penawaran Harga",
    "Column28": "MUHAMMAD EUROSKI YUDISETYO",
    "Column29": "ERMAN RATIUS",
    "Column30": "GUARDING MANAGEMENT"
  },
  {
    "Column11": 15,
    "Column12": 26030028,
    "Column13": "Enhancement Flow Process Planner CIT",
    "Column14": "ILHAM NUR HIDAYAT",
    "Column15": "JUNITA",
    "Column16": "BUSINESS PROCESS DEVELOPMENT",
    "Column18": 15,
    "Column19": 26030028,
    "Column20": "Enhancement Flow Process Planner CIT",
    "Column21": "ILHAM NUR HIDAYAT",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 15,
    "Column26": 26040045,
    "Column27": "Enhance Laporan Pinalty CIT Khusus BNI Medan",
    "Column28": "ALLBY VALDIAN FURIAWAN",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Column11": 16,
    "Column12": 26030035,
    "Column13": "Penawaran Harga",
    "Column14": "MUHAMMAD EUROSKI YUDISETYO",
    "Column15": "ERMAN RATIUS",
    "Column16": "GUARDING MANAGEMENT",
    "Column18": 16,
    "Column19": 26030035,
    "Column20": "Penawaran Harga",
    "Column21": "MUHAMMAD EUROSKI YUDISETYO",
    "Column22": "ERMAN RATIUS",
    "Column23": "GUARDING MANAGEMENT",
    "Column25": 16,
    "Column26": 26020015,
    "Column27": "CPM 2 RTGS Version",
    "Column28": "ROY PERMANA",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Column18": 17,
    "Column19": 26040045,
    "Column20": "Enhance Laporan Pinalty CIT Khusus BNI Medan",
    "Column21": "ALLBY VALDIAN FURIAWAN",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 17,
    "Column26": 26030042,
    "Column27": "CPM 2 Valas Version",
    "Column28": "ROY PERMANA",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Column18": 18,
    "Column19": 26020015,
    "Column20": "CPM 2 RTGS Version",
    "Column21": "ROY PERMANA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT",
    "Column25": 18,
    "Column26": 26030043,
    "Column27": "CPM 2 Prepare Delivery and Release Version",
    "Column28": "ROY PERMANA",
    "Column29": "JUNITA",
    "Column30": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Column18": 19,
    "Column19": 26030042,
    "Column20": "CPM 2 Valas Version",
    "Column21": "ROY PERMANA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT"
  },
  {
    "Column18": 20,
    "Column19": 26030043,
    "Column20": "CPM 2 Prepare Delivery and Release Version",
    "Column21": "ROY PERMANA",
    "Column22": "JUNITA",
    "Column23": "BUSINESS PROCESS DEVELOPMENT"
  }
];

interface TabOverviewProps {
  dataset: DashboardDataset;
  onNavigateToTab: (index: number) => void | any;
  filteredProjects?: any[];
  allProjects?: any[];
  startMonth?: string;
  endMonth?: string;
}

function ProgressCircle({ pct, color, size = 88, strokeWidth = 8 }: { pct: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Underlay base circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-gray-100"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Colorful dynamic progress ring arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-extrabold font-mono text-gray-800">{pct}%</span>
    </div>
  );
}

// Helper to extract feedback comments
const getFeedbackComments = (p: any): string[] => {
  const comments: string[] = [];
  Object.keys(p).forEach((key) => {
    if (key.trim().toLowerCase().startsWith("nilai feedback user")) {
      if (key.includes("\n")) {
        const parts = key.split("\n");
        const afterNewline = parts.slice(1).join("\n").trim();
        if (afterNewline) {
          comments.push(afterNewline);
          return;
        }
      }
      const val = p[key];
      if (val && typeof val === "string" && val.trim() !== "") {
        comments.push(val.trim());
      }
    }
  });
  return comments;
};

export function TabOverview({ dataset, onNavigateToTab, filteredProjects, allProjects, startMonth, endMonth }: TabOverviewProps) {
  const { report, kpis, devSla2026, yoySla, feedback, uatRescheduled, goLive } = dataset;
  const list = filteredProjects || [];

  const item2025 = yoySla.find(item => item.year === "2025");
  const item2026 = yoySla.find(item => item.year === "2026");
  const count2025 = item2025 ? ((item2025.inProgress || 0) + (item2025.completed || 0)) : 0;
  const count2026 = item2026 ? ((item2026.inProgress || 0) + (item2026.completed || 0)) : 0;

  // Active status groups
  const activeTypes = ['Antrian', 'Dalam Proses', 'UAT', 'Monitoring', 'Hold', 'Change Request'];

  const delayedUATProjects = useMemo(() => {
    return list.filter(p => {
      const uatLate = p._lateUAT || 0;
      const reschedVal = p["Reschedule UAT"] || 0;
      const statusGrp = statusGroupOf(p["Last Status"]);
      const isActive = statusGrp !== "Live" && statusGrp !== "Canceled";
      return isActive && (uatLate > 0 || reschedVal > 0);
    });
  }, [list]);

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    title: string;
    type: 'feedback' | 'contributors' | 'kpi_card' | 'milestone_sla' | 'yoy_comparison' | 'uat_delay_audit' | 'historical_queue';
    projects?: any[];
    kpiKey?: 'queue' | 'progress' | 'uat' | 'monitoring' | 'hold';
    stageName?: 'FSD' | 'DEV' | 'SIT' | 'UAT' | 'LIVE';
  } | null>(null);

  const [selectedHistTab, setSelectedHistTab] = useState<'W5 Mar 26' | 'W1 Apr 26' | 'W2 Apr 26' | 'W3 Apr 26'>('W3 Apr 26');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Render gold rating stars accurately
  const renderStars = (filled: number) => {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={`w-4 h-4 ${s <= filled ? "text-amber-400 fill-current" : "text-gray-250"}`}
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Safe query to obtain "Queue" specifically (which strictly matches "On Queue") - COMPLETELY IMMUNE TO FILTERS
  const globalRawList = allProjects || [];
  const queueCount = globalRawList.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "on queue").length;

  // Progress Count: Filtered dynamically from active month-to-month range, excluding UAT
  const progressCount = useMemo(() => {
    return list.filter(p => {
      const statusLower = (p["Last Status"] || "").trim().toLowerCase();
      // Strictly exclude "uat on progress" and "uat on queue"
      if (statusLower === "uat on progress" || statusLower === "uat on queue") {
        return false;
      }
      return statusLower === "fsd on progress" ||
             statusLower === "dev on progress" ||
             statusLower === "sit on progress" ||
             statusLower === "change request on progress" ||
             statusGroupOf(p["Last Status"]) === "Dalam Proses";
    }).length;
  }, [list]);

  const uatCount = kpis[2]?.value ?? 0;
  const monitoringCount = kpis[3]?.value ?? 0;
  const holdCount = kpis[4]?.value ?? 0;

  // 1. CALCULATING INTERACTIVE FEEDBACK TARGET CONDITION PROJECTS WITH METRICS
  const feedbackMetrics = useMemo(() => {
    const filteredData = list;
    
    // 1. Filter projects that have valid feedback in the current scope
    let projectsWithFeedback = filteredData.filter(d => {
      let score = parseFloat(String(d["Rata-rata Nilai Feedback User : "]));
      return !isNaN(score) && score > 0;
    });

    // 2. Calculate average out of 5 (divide by 20 because raw data is out of 100)
    let globalAvg = "0.00";
    if (projectsWithFeedback.length > 0) {
      let totalScoreOutof100 = projectsWithFeedback.reduce((sum, d) => sum + parseFloat(String(d["Rata-rata Nilai Feedback User : "])), 0);
      let avgOutof100 = totalScoreOutof100 / projectsWithFeedback.length;
      if (avgOutof100 > 5) {
        globalAvg = (avgOutof100 / 20).toFixed(2); // Converts 100-scale to 5-scale
      } else {
        globalAvg = avgOutof100.toFixed(2);
      }
    }

    let scopeProjects = filteredData.filter(d => {
      const status = d["Last Status"] ? d["Last Status"].trim().toLowerCase() : "";
      return ["uat on progress", "live", "live monitoring"].includes(status);
    });

    let withFeedback = scopeProjects.filter(d => {
      const val = d["Rata-rata Nilai Feedback User : "];
      return val !== undefined && val !== null && parseFloat(String(val)) > 0;
    });

    let missingFeedback = scopeProjects.filter(d => {
      const val = d["Rata-rata Nilai Feedback User : "];
      return val === undefined || val === null || parseFloat(String(val)) === 0 || isNaN(parseFloat(String(val)));
    });

    return {
      scopeProjects,
      withFeedback,
      missingFeedback,
      averageScore: parseFloat(globalAvg),
      scoreText: globalAvg,
      filledStars: Math.round(parseFloat(globalAvg))
    };
  }, [list]);

  const feedbackProjects = feedbackMetrics.scopeProjects;

  // 2. COUNTERS RE-LINKED TO THE DYNAMIC FILTERED DATASET WITH 2026/DATES ADJUSTMENTS
  const evaluatedProjs = useMemo(() => {
    return list.filter((p) =>
      ["FSD SLA", "DEV SLA", "SIT SLA", "UAT SLA", "Live SLA"].some(
        (f) => p[f] === "Achieved" || p[f] === "Not Achieved"
      )
    );
  }, [list]);

  const goLiveProjs = useMemo(() => {
    return list.filter(
      (p) =>
        statusGroupOf(p["Last Status"]) === "Live" ||
        (p["Last Status"] && p["Last Status"].toLowerCase().includes("live"))
    );
  }, [list]);

  // SLA Total 2026: count projects with Year 2026 and at least one Active / Achieved SLA
  const slaTotal2026Projs = useMemo(() => {
    return list.filter((p) => {
      const is2026 = p._year === "2026" || p["Year"] === 2026;
      const isAchieved = p["Live SLA"] === "Achieved" || p["DEV SLA"] === "Achieved" || p["UAT SLA"] === "Achieved" || p["FSD SLA"] === "Achieved" || p["SIT SLA"] === "Achieved";
      return is2026 && isAchieved;
    });
  }, [list]);

  // Attention projects list
  const attentionProjs = useMemo(() => {
    return list.filter((p) => {
      const isAct = activeTypes.includes(statusGroupOf(p["Last Status"]));
      if (!isAct) return false;
      const devLate = p._lateDev || 0;
      const fsdLate = p._lateFSD || 0;
      const sitLate = p._lateSIT || 0;
      const uatLate = p._lateUAT || 0;
      const liveLate = p._lateLive || 0;
      return (
        devLate > 14 ||
        fsdLate > 14 ||
        sitLate > 14 ||
        uatLate > 14 ||
        liveLate > 14 ||
        (p["Reschedule UAT"] && p["Reschedule UAT"] > 1)
      );
    });
  }, [list]);

  const getProjectDisplayDate = (p: any): string => {
    const status = (p["Last Status"] || "").toString().trim().toLowerCase();
    const milestone = (p["Milestone"] || "").toString().trim().toLowerCase();
    const isHold = status.includes("hold") || milestone.includes("hold");

    if (isHold) {
       return p["(Live) Realized in date"] || p["(UAT) Realized In Date"] || p["(Dev) Realized In Date"] || p["(FSD) Realized in Date Diisi saat Approval Digital FSD by Owner selesai"] || "—";
    }
    const g = statusGroupOf(p["Last Status"]);
    if (g === "Antrian") {
      return p["Created time"] || "—";
    }
    if (g === "UAT") {
      return p["(UAT) Realized In Date"] || p["(UAT) Plan in Week"] || "—";
    }
    if (g === "Monitoring" || g === "Live") {
      return p["(Live) Realized in date"] || p["(Live) Plan in Week"] || "—";
    }
    if (g === "Dalam Proses") {
      if (status.includes("fsd")) {
        return p["(FSD) Realized in Date Diisi saat Approval Digital FSD by Owner selesai"] || p["(FSD) Plan in Week"] || "—";
      }
      if (status.includes("sit")) {
        return p["(SIT) Realized in date"] || p["(SIT) Plan in Week"] || "—";
      }
      return p["(Dev) Realized In Date"] || p["(Dev) Plan in Week"] || "—";
    }
    return p["(Live) Realized in date"] || p["(UAT) Realized In Date"] || p["(Dev) Realized In Date"] || "—";
  };

  const getTargetOrRealizedDate = (p: any, stageName: string): string => {
    const s = stageName.toUpperCase();
    if (s === "FSD") {
      return p["(FSD) Realized in Date Diisi saat Approval Digital FSD by Owner selesai"] || p["(FSD) Plan in Week"] || "—";
    } else if (s === "DEV" || s === "DEVELOPMENT") {
      return p["(Dev) Realized In Date"] || p["(Dev) Plan in Week"] || "—";
    } else if (s === "SIT") {
      return p["(SIT) Realized in date"] || p["(SIT) Plan in Week"] || "—";
    } else if (s === "UAT") {
      return p["(UAT) Realized In Date"] || p["(UAT) Plan in Week"] || "—";
    } else if (s === "LIVE") {
      return p["(Live) Realized in date"] || p["(Live) Plan in Week"] || "—";
    }
    return "—";
  };

  const slaFieldMap: Record<string, "FSD SLA" | "DEV SLA" | "SIT SLA" | "UAT SLA" | "Live SLA"> = {
    FSD: "FSD SLA",
    DEV: "DEV SLA",
    DEVELOPMENT: "DEV SLA",
    SIT: "SIT SLA",
    UAT: "UAT SLA",
    LIVE: "Live SLA",
  };

  const handleQueueCardClick = () => {
    setActiveModal({
      title: "Queue Projects",
      type: "kpi_card",
      kpiKey: "queue"
    });
  };

  const handleInProgressCardClick = () => {
    setActiveModal({
      title: "In Progress Projects",
      type: "kpi_card",
      kpiKey: "progress"
    });
  };

  const handleUatCardClick = () => {
    setActiveModal({
      title: "UAT Projects",
      type: "kpi_card",
      kpiKey: "uat"
    });
  };

  const handleMonitoringCardClick = () => {
    setActiveModal({
      title: "Monitoring Projects",
      type: "kpi_card",
      kpiKey: "monitoring"
    });
  };

  const handleHoldCardClick = () => {
    setActiveModal({
      title: "Hold Projects",
      type: "kpi_card",
      kpiKey: "hold"
    });
  };

  // Milestone SLA click handler
  const handleMilestoneClick = (stageName: string) => {
    let cleanStage = stageName.toUpperCase();
    if (cleanStage === "DEVELOPMENT") cleanStage = "DEV";
    setActiveModal({
      title: `${stageName} Stage SLA Details`,
      type: "milestone_sla",
      stageName: cleanStage as 'FSD' | 'DEV' | 'SIT' | 'UAT' | 'LIVE'
    });
  };

  const handleYoYCardClick = () => {
    setActiveModal({
      title: "DEV SLA Year-on-Year Comparison",
      type: "yoy_comparison"
    });
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Mini Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">
            Executive Summary Overview
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5 font-sans">
            Weekly Report Period: <strong className="text-gray-700">{report.date}</strong> &bull; <strong className="text-blue-600">{report.activeTotal} Active Projects</strong>
          </p>
        </div>
      </div>

      {/* Top row: Satisfaction rating and KPI tags */}
      <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col md:flex-row items-stretch justify-between gap-5">
        {/* User satisfaction score - CLICKABLE */}
        <div
          onClick={() => setActiveModal({
            title: "User Feedback Drill-Down Details",
            projects: feedbackProjects,
            type: "feedback"
          })}
          className="flex flex-col justify-center min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-0 md:pr-6 cursor-pointer hover:bg-slate-50/70 p-3 rounded-2xl transition-all group"
        >
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>User Satisfaction Rate</span>
            <span className="text-[9px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click Details &rarr;</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-extrabold text-gray-900 font-display tracking-tight leading-none text-slate-850">
              {feedbackMetrics.scoreText}
            </span>
            <span className="text-sm text-gray-400 font-bold font-sans">/ 5</span>
          </div>
          {renderStars(feedbackMetrics.filledStars)}
          <span className="text-[10px] text-gray-450 font-bold tracking-tight mt-1">
            [{feedbackMetrics.withFeedback.length}] Projects with Feedback | [{feedbackMetrics.missingFeedback.length}] Pending Feedback
          </span>
        </div>

        {/* 4 small horizontal KPI tags matching Card info styles in Image 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 flex-1">
          {/* Tag 1: Proyek dievaluasi - CLICKABLE */}
          <div
            onClick={() => setActiveModal({
              title: "SLA Evaluated Projects",
              projects: evaluatedProjs,
              type: "contributors"
            })}
            className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer hover:bg-amber-50 hover:shadow-xs transition-all select-none group"
          >
            <span className="text-2xl font-extrabold text-amber-700 font-mono tracking-tight leading-none group-hover:scale-105 transition-transform origin-left block">
              {evaluatedProjs.length}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mt-2.5 leading-tight">
              Evaluated Projects
            </span>
          </div>

          {/* Tag 2: Go-Live periode ini - CLICKABLE */}
          <div
            onClick={() => setActiveModal({
              title: "Go-Live This Period Projects",
              projects: goLiveProjs,
              type: "contributors"
            })}
            className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer hover:bg-emerald-50 hover:shadow-xs transition-all select-none group"
          >
            <span className="text-2xl font-extrabold text-emerald-700 font-mono tracking-tight leading-none group-hover:scale-105 transition-transform origin-left block">
              {goLiveProjs.length}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mt-2.5 leading-tight">
              Go-Live This Period
            </span>
          </div>

          {/* Tag 3: SLA total 2026 - CLICKABLE */}
          <div
            onClick={() => setActiveModal({
              title: "SLA Accomplished 2026 Projects",
              projects: slaTotal2026Projs,
              type: "contributors"
            })}
            className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer hover:bg-blue-50 hover:shadow-xs transition-all select-none group"
          >
            <span className="text-2xl font-extrabold text-blue-700 font-mono tracking-tight leading-none group-hover:scale-105 transition-transform origin-left block">
              {slaTotal2026Projs.length}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mt-2.5 leading-tight">
              SLA Total 2026
            </span>
          </div>

          {/* Tag 4: Perlu perhatian - CLICKABLE */}
          <div
            onClick={() => setActiveModal({
              title: "Needs Attention Projects",
              projects: attentionProjs,
              type: "contributors"
            })}
            className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer hover:bg-rose-50 hover:shadow-xs transition-all select-none group"
          >
            <span className="text-2xl font-extrabold text-rose-700 font-mono tracking-tight leading-none group-hover:scale-105 transition-transform origin-left block">
              {attentionProjs.length}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mt-2.5 leading-tight">
              Needs Attention
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: 5 Stage KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Queue */}
        <div
          onClick={handleQueueCardClick}
          className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider block">Queue</span>
              <span className="text-3xl font-extrabold text-gray-900 font-display tracking-tight block">
                {queueCount}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100/70">
              <Icon name="Inbox" className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-50 pt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">Waiting to start</span>
            <span className="text-[11px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
              View drill-down <Icon name="ChevronRight" className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: In Progress (Solid Highlighted Dark Blue) */}
        <div
          onClick={handleInProgressCardClick}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 shadow-md shadow-blue-100 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-blue-150 font-sans uppercase tracking-wider block">In Progress</span>
              <span className="text-3xl font-extrabold text-white font-display tracking-tight block">
                {progressCount}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/12 text-white/95 group-hover:bg-white/20">
              <Icon name="Play" className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 border-t border-white/10 pt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-blue-100 font-medium">FSD &bull; Dev &bull; SIT</span>
            <span className="text-[11px] text-white font-bold flex items-center gap-0.5">
              View drill-down <Icon name="ChevronRight" className="w-3 h-3 text-white" />
            </span>
          </div>
        </div>

        {/* Card 3: UAT */}
        <div
          onClick={handleUatCardClick}
          className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider block">UAT</span>
              <span className="text-3xl font-extrabold text-gray-900 font-display tracking-tight block">
                {uatCount}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 transition-colors group-hover:bg-amber-100/70">
              <Icon name="CheckSquare" className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-50 pt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium font-sans">Queue & in progress</span>
            <span className="text-[11px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
              View drill-down <Icon name="ChevronRight" className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Monitoring */}
        <div
          onClick={handleMonitoringCardClick}
          className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider block">Monitoring</span>
              <span className="text-3xl font-extrabold text-gray-900 font-display tracking-tight block">
                {monitoringCount}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100/70">
              <Icon name="Activity" className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-50 pt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">Post go-live</span>
            <span className="text-[11px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
              View drill-down <Icon name="ChevronRight" className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 5: Hold */}
        <div
          onClick={handleHoldCardClick}
          className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider block">Hold</span>
              <span className="text-3xl font-extrabold text-gray-900 font-display tracking-tight block">
                {holdCount}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100/70">
              <Icon name="Pause" className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-50 pt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium leading-normal">
              <strong className="text-gray-700">{kpis[4]?.split?.[0]?.value || 0}</strong> Owner &bull; <strong className="text-gray-700">{kpis[4]?.split?.[1]?.value || 0}</strong> Client
            </span>
            <span className="text-[11px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
              View drill-down <Icon name="ChevronRight" className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Milestone SLA Pipeline connected nodes chart */}
      <Card
        title="Milestone SLA Pipeline"
        sub="SLA milestone achievement rate per stage • SLA FSD–Live 2026"
        padding="p-6 md:p-8"
      >
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mt-6">
          {/* Connecting dotted timeline line overlay */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] border-b-2 border-dashed border-gray-200 z-0" />

          {dataset.slaStageSummary.map((stage, idx) => {
            // Determine ring color by success percentage
            let borderCol = "#EF4444"; // red
            if (stage.pct >= 95) borderCol = "#10B981"; // emerald
            else if (stage.pct >= 90) borderCol = "#3B82F6"; // blue
            else if (stage.pct >= 80) borderCol = "#F59E0B"; // orange/amber

            // Threshold label: < 93% is "Not Achieved", otherwise "Achieved"
            const statusLabel = stage.pct < 93 ? "Not Achieved" : "Achieved";
            const statusColor = stage.pct < 93 ? "text-rose-600" : "text-emerald-600";

            return (
              <div
                key={idx}
                onClick={() => handleMilestoneClick(stage.stage)}
                className="flex flex-col items-center flex-1 text-center z-10 w-full md:w-auto cursor-pointer group hover:opacity-90 active:scale-98 transition-all"
              >
                {/* Visual Circle gauge */}
                <ProgressCircle pct={stage.pct} color={borderCol} size={88} strokeWidth={8} />

                {/* Identifier tag */}
                <span className="text-[13px] font-extrabold text-gray-800 uppercase tracking-wider font-display mt-3.5 block group-hover:text-blue-600 transition-colors">
                  {stage.stage}
                </span>

                {/* SLA Stage Status threshold indicator */}
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 block ${statusColor}`}>
                  {statusLabel}
                </span>

                {/* Subtitle status explanation */}
                <span className={`text-[11.5px] font-medium mt-1 font-sans ${stage.notAch > 0 ? 'text-gray-400' : 'text-emerald-500'}`}>
                  {stage.notAch > 0 ? (
                    <span>
                      <strong className="text-gray-700 font-extrabold">{stage.notAch}</strong> missed
                    </span>
                  ) : (
                    "Fully achieved"
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Historical Queue Backlog Trend Card */}
      <Card
        title="Historical Backlog Burn-Down Trend"
        sub="Trend analysis of projects currently on queue vs. historical snapshot windows"
        rightElement={
          <button
            onClick={() => {
              setSelectedHistTab('W3 Apr 26');
              setActiveModal({
                title: "Historical Queue Snapshot Matrix",
                type: "historical_queue"
              });
            }}
            className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-105 border border-blue-150 rounded-xl px-3 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Icon name="ListCollapse" className="w-3.5 h-3.5" />
            <span>View Historical Backlog Log</span>
          </button>
        }
        padding="p-6 md:p-8"
        className="w-full mt-6"
      >
        <div className="relative w-full overflow-hidden mt-4">
          {/* Main Chart Section */}
          <div className="w-full bg-slate-50/15 border border-gray-150 rounded-2xl p-4 md:p-6 shadow-3xs">
            {(() => {
              const trendLabels = ["W5 Mar 26", "W1 Apr 26", "W2 Apr 26", "W3 Apr 26", "Current"];
              const trendValues = [14, 16, 20, 18, queueCount];
              const yMaxVal = Math.max(22, queueCount + 2);

              const linePoints = trendValues.map((v, i) => {
                const x = 75 + i * 160;
                const y = 190 - (v / yMaxVal) * 140; 
                return { x, y, value: v, label: trendLabels[i] };
              });

              const lineD = `M ${linePoints.map(p => `${p.x},${p.y}`).join(" L ")}`;
              const areaD = `${lineD} L 715,200 L 75,200 Z`;

              return (
                <svg viewBox="0 0 800 245" className="w-full h-auto block select-none">
                  <defs>
                    <linearGradient id="backlogGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Y-Axis Grid Lines and Labels */}
                  {[0, 5, 10, 15, 20].map((t) => {
                    const yPos = 190 - (t / yMaxVal) * 140;
                    return (
                      <g key={t}>
                        <line x1={55} x2={745} y1={yPos} y2={yPos} stroke="#E5E7EB" strokeDasharray="3 3" strokeWidth="1" />
                        <text x={45} y={yPos + 3} textAnchor="end" className="text-[10px] fill-gray-400 font-mono font-bold">
                          {t}
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical grid lines */}
                  {linePoints.map((p, i) => (
                    <line key={i} x1={p.x} x2={p.x} y1={40} y2={195} stroke="#F3F4F6" strokeDasharray="2 2" strokeWidth="1" />
                  ))}

                  {/* Shaded Area Under the Line */}
                  <path d={areaD} fill="url(#backlogGrad)" className="transition-all duration-300" />

                  {/* Line Path */}
                  <path d={lineD} fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Interactive Nodes */}
                  {linePoints.map((p, i) => {
                    const isHovered = hoveredIdx === i;
                    return (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => {
                          const tabName = p.label === "Current" ? "W3 Apr 26" : p.label as any;
                          setSelectedHistTab(tabName);
                          setActiveModal({
                            title: "Historical Queue Snapshot Matrix",
                            type: "historical_queue"
                          });
                        }}
                      >
                        {isHovered && <circle cx={p.x} cy={p.y} r={12} fill="#93C5FD" opacity="0.4" />}
                        <circle cx={p.x} cy={p.y} r={6.5} fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx={p.x} cy={p.y} r={2} fill="#FFFFFF" />
                        <circle cx={p.x} cy={p.y} r={24} fill="transparent" />
                      </g>
                    );
                  })}

                  {/* X-Axis Labels */}
                  {linePoints.map((p, i) => (
                    <text
                      key={i}
                      x={p.x}
                      y={215}
                      textAnchor="middle"
                      className="text-[10.5px] font-extrabold fill-gray-500 font-display transition-colors cursor-pointer hover:fill-blue-600"
                      onClick={() => {
                        const tabName = p.label === "Current" ? "W3 Apr 26" : p.label as any;
                        setSelectedHistTab(tabName);
                        setActiveModal({
                          title: "Historical Queue Snapshot Matrix",
                          type: "historical_queue"
                        });
                      }}
                    >
                      {p.label}
                    </text>
                  ))}

                  {/* SVG Tooltip */}
                  {hoveredIdx !== null && (() => {
                    const p = linePoints[hoveredIdx];
                    const tooltipX = Math.max(70, Math.min(730, p.x));
                    return (
                      <g className="pointer-events-none select-none">
                        <line x1={p.x} x2={p.x} y1={40} y2={190} stroke="#2563EB" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                        <rect x={tooltipX - 70} y={p.y - 48} width={140} height={40} rx={8} fill="#1E293B" />
                        <polygon points={`${p.x - 5},${p.y - 8} ${p.x + 5},${p.y - 8} ${p.x},${p.y - 3}`} fill="#1E293B" />
                        <text x={tooltipX} y={p.y - 34} textAnchor="middle" className="text-[10.5px] font-extrabold fill-slate-200 font-display">
                          {p.label} Milestone
                        </text>
                        <text x={tooltipX} y={p.y - 21} textAnchor="middle" className="text-[10px] font-bold fill-emerald-400 font-mono">
                          Queue: {p.value} Projects
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              );
            })()}
          </div>
        </div>

        {/* Dynamic Comparative Commentary Box */}
        <div className="mt-5 p-4 rounded-xl bg-blue-50/60 border border-blue-150 flex items-start gap-2.5 shadow-3xs hover:bg-blue-50/90 transition-all duration-300">
          <span className="text-blue-500 mt-0.5 shrink-0 text-base leading-none select-none font-sans">ℹ️</span>
          <div className="text-xs text-blue-800 font-medium leading-relaxed whitespace-normal select-text">
            Info: On Queue Project based on active master data is now <span className="text-blue-900 font-extrabold font-mono underline">{queueCount}</span>, compared to <span className="text-blue-950 font-extrabold font-mono underline">18</span> from the historical snapshot baseline.
          </div>
        </div>
      </Card>

      {/* Row 4: UAT Rescheduled Active Pushback lists (Full Width) */}
      <Card
        title="UAT Rescheduled"
        sub="Active projects with pushed/rescheduled UAT deadlines"
        rightElement={
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-0.5 select-none">
            {uatRescheduled.active} active &bull; {uatRescheduled.total} total
          </span>
        }
        padding="p-5"
        className="w-full flex flex-col justify-between"
      >
        {/* Rows list of reschedule items */}
        <div className="space-y-3 my-2 flex-grow">
          {uatRescheduled.rows.map((row, idx) => {
            const isCR = row.status.toLowerCase().includes("change") || row.status.toLowerCase().includes("cr");
            const orig = row.originalProject;
            const isDelayed = orig
              ? (statusGroupOf(orig["Last Status"]) !== "Live" &&
                 statusGroupOf(orig["Last Status"]) !== "Canceled" &&
                 ((orig._lateUAT || 0) > 0 || (orig["Reschedule UAT"] || 0) > 0))
              : false;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50/40 border border-gray-100/60 rounded-2xl hover:bg-gray-50 transition-colors duration-150 gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                  <p className="text-[12px] font-bold text-gray-800 select-all flex flex-wrap items-center gap-2 whitespace-normal break-words">
                    <span className="whitespace-normal break-words">{row.name}</span>
                    {isDelayed && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 uppercase tracking-wide shrink-0 select-none" title="UAT Delay Spotted">
                        ⚠️ Delayed
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3.5 self-end sm:self-auto flex-shrink-0">
                  <span className={`text-[10px] font-extrabold uppercase font-mono tracking-wider px-2 py-0.5 rounded-md border ${
                    isCR
                      ? 'text-amber-700 bg-amber-50/75 border-amber-100/65'
                      : 'text-blue-700 bg-blue-50/75 border-blue-100/65'
                  }`}>
                    {row.status}
                  </span>
                  <span className="text-xs font-bold font-mono text-gray-800 bg-gray-100/80 border border-gray-200 rounded-md px-1.5 py-0.5 min-w-7 text-center">
                    {row.count}
                  </span>
                </div>
              </div>
            );
          })}
          {uatRescheduled.rows.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-400">
              No rescheduled UAT projects identified in current active snapshot.
            </div>
          )}
        </div>

        {/* Warning Escalation alert - clickable */}
        <div
          onClick={() => {
            setActiveModal({
              title: "Delayed UAT Projects Audit",
              type: "uat_delay_audit",
              projects: delayedUATProjects
            });
          }}
          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl p-3 flex items-center justify-between gap-2.5 mt-3 select-none cursor-pointer hover:shadow-xs transition-all duration-150 group"
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong className="font-extrabold">{delayedUATProjects.length} projects still delayed</strong> &mdash; urgent coordination & escalation with client/vendor team needed to protect timelines.
            </span>
          </div>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-150/50 rounded-lg px-2 py-0.5 transition-colors group-hover:bg-rose-200 select-none flex-shrink-0">
            View Audit List &rarr;
          </span>
        </div>
      </Card>

      {/* Section 5: DEV SLA Year-on-Year comparison chart - COMPARATIVE GRID REPAIRED */}
      <Card
        title="DEV SLA Year-on-Year"
        sub="Progress alignment & benchmarks between evaluation periods (2025 vs 2026) • Click anywhere on card to open interactive comparison"
        className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group relative"
        padding="p-6"
        onClick={handleYoYCardClick}
        rightElement={
          <button className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-100 transition-colors pointer-events-none select-none">
            Interact Comparison <Icon name="chevron" className="w-3.5 h-3.5 animate-pulse" />
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-2">
          {/* Left Side: Comparison bars */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="relative h-44 flex items-end justify-around border-b border-gray-150 pb-2.5 pt-6 px-12">
                {/* Score guidelines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mt-6 pb-2.5 text-[10px] font-mono text-gray-400 select-none">
                  <div className="border-b border-dashed border-gray-200 w-full flex justify-between"><span>100% Target</span></div>
                  <div className="border-b border-dashed border-gray-200 w-full flex justify-between"><span>50% Mid-Point</span></div>
                  <div className="border-b border-dashed border-gray-200 w-full flex justify-between"><span>0% Base-Level</span></div>
                </div>

                {yoySla.filter(f => f.year === "2025" || f.year === "2026").map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center z-10 w-24">
                    <span className="text-[13px] font-mono font-extrabold text-gray-900 mb-2">{item.pct}%</span>
                    <div
                      className="rounded-t-xl w-12 transition-all duration-750 ease-out shadow-xs"
                      style={{
                        height: `${(item.pct / 100) * 110}px`,
                        backgroundColor: item.year === "2026" ? '#2563EB' : '#94A3B8'
                      }}
                    />
                    <span className="text-xs font-bold text-gray-500 mt-2.5 font-sans leading-none">{item.year}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Dynamic Wording Info Text Block */}
            <div className="mt-4 text-center px-4">
              <p className="text-xs text-slate-500 font-sans italic bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl inline-block max-w-[280px] sm:max-w-md shadow-xs select-text">
                {count2026 > count2025 ? (
                  <>Info: There is an increase in project volume for the selected period ({startMonth || 'Jan'} - {endMonth || 'Dec'}) compared to the same period in 2025.</>
                ) : count2026 < count2025 ? (
                  <>Info: There is a decrease in project volume for the selected period ({startMonth || 'Jan'} - {endMonth || 'Dec'}) compared to the same period in 2025.</>
                ) : (
                  <>Info: Project volume for the selected period ({startMonth || 'Jan'} - {endMonth || 'Dec'}) remains stable compared to the same period in 2025.</>
                )}
              </p>
            </div>
          </div>

          {/* Right Side: comparative benchmarking summary table */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider font-display">Development Alignment Benchmarks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yoySla.filter(f => f.year === "2025" || f.year === "2026").map((item) => (
                <div
                  key={item.year}
                  className={`p-4 rounded-2xl border ${
                    item.year === "2026"
                      ? "bg-amber-50/10 border-amber-100"
                      : "bg-blue-50/10 border-blue-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 font-sans uppercase">Periode {item.year}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md font-mono ${
                      item.year === "2026"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}>
                      {item.pct}% SLA
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {/* In Progress */}
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-gray-400 font-medium">In-Progress:</span>
                      <strong className="text-gray-800 font-extrabold font-mono">{item.inProgress ?? 0} projs</strong>
                    </div>

                    {/* Completed */}
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-gray-400 font-medium font-semibold">Completed:</span>
                      <strong className="text-gray-800 font-extrabold font-mono">{item.completed ?? 0} projs</strong>
                    </div>

                    {/* Delay metrics based on lateDev / _lateDev */}
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-gray-400 font-medium">Delayed Days:</span>
                      <strong className="text-rose-600 font-extrabold font-mono bg-rose-50 border border-rose-100/50 px-1.5 py-0.5 rounded-md">
                        {item.totalDelayDays ?? 0} d
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - DELAYED UAT PROJECTS AUDIT */}
      {activeModal && activeModal.type === 'uat_delay_audit' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/55 select-none">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 font-display">
                  Delayed UAT Projects Audit
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Showing {(activeModal.projects || []).length} active UAT delayed / rescheduled projects requiring escalation
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Structured Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="overflow-x-auto border border-gray-150 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs border-collapse divide-y divide-gray-150">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-[10.5px] text-gray-400 font-bold uppercase tracking-wider font-display select-none">
                      <th className="py-3 px-4">Ticket &amp; Project Name</th>
                      <th className="py-3 px-3">PIC Name</th>
                      <th className="py-3 px-3">Current Stage Status</th>
                      <th className="py-3 px-3 text-center">Reschedule Count</th>
                      <th className="py-3 px-3 text-center">Delayed Days</th>
                      <th className="py-3 px-4 w-[35%]">Progress Update Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-105 select-text bg-white">
                    {(activeModal.projects || []).map((p, idx) => {
                      const reschedCount = p["Reschedule UAT"] || 0;
                      const lateDays = p._lateUAT || 0;
                      const progressNotes = p["(UAT) Progress Updated"] || "—";
                      return (
                        <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                          <td className="py-3 px-4 font-sans align-top whitespace-normal break-words">
                            <p className="font-bold text-gray-900 text-xs whitespace-normal break-words">{p["Project Name"] || "—"}</p>
                            <span className="font-mono text-[10px] text-gray-400 mt-1 block whitespace-normal break-words">{p["Ticket"] || "—"}</span>
                          </td>
                          <td className="py-3 px-3 font-sans font-semibold text-gray-750 align-top whitespace-normal break-words">
                            {p["PIC Short Name"] || p["PIC Name"] || "—"}
                          </td>
                          <td className="py-3 px-3 align-top whitespace-normal break-words">
                            <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-amber-50 text-amber-700 border border-amber-100 select-none whitespace-normal break-normal">
                              {p["Last Status"] || "Unknown"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-extrabold text-xs text-gray-950 align-top select-none whitespace-normal break-words">
                            {reschedCount > 0 ? `${reschedCount}×` : "0"}
                          </td>
                          <td className="py-3 px-3 text-center align-top whitespace-normal break-words select-none">
                            <span className={`inline-block font-mono font-black text-xs px-2 py-0.5 rounded-lg ${lateDays > 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-gray-100 text-gray-600'}`}>
                              {lateDays} Days
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs font-medium text-gray-650 leading-relaxed align-top whitespace-normal break-words select-text">
                            {progressNotes}
                          </td>
                        </tr>
                      );
                    })}
                    {(activeModal.projects || []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-gray-400 font-semibold italic">
                          No delayed UAT projects identified.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-150 flex justify-end bg-gray-50/55 select-none">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Close Audit List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - USER SATISFACTION FEEDBACK */}
      {activeModal && activeModal.type === 'feedback' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100">
            {/* Header */}
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/55">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 font-display">
                  {activeModal.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Showing {activeModal.projects.length} evaluated user feedbacks (filtered case-insensitive for UAT On Progress, Live, or Live monitoring)
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Top Metadata Summary Header */}
            {(() => {
              const modalScopeData = activeModal.projects || [];
              const countWithFeedback = modalScopeData.filter(d => {
                const val = d["Rata-rata Nilai Feedback User : "];
                return val !== undefined && val !== null && parseFloat(String(val)) > 0;
              }).length;
              const countMissingFeedback = modalScopeData.length - countWithFeedback;

              const liveCount = modalScopeData.filter(d => {
                const s = d["Last Status"] ? d["Last Status"].trim().toLowerCase() : "";
                return s === "live" || s === "live monitoring";
              }).length;

              const uatCount = modalScopeData.filter(d => {
                const s = d["Last Status"] ? d["Last Status"].trim().toLowerCase() : "";
                return s === "uat on progress";
              }).length;

              const crCount = modalScopeData.filter(d => {
                const s = d["Last Status"] ? d["Last Status"].trim().toLowerCase() : "";
                return s === "change request on progress";
              }).length;

              return (
                <div className="px-6 py-3 bg-gray-50/30 border-b border-gray-150 flex flex-wrap items-center gap-3.5 select-none font-sans">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Audit Summary:</span>
                  <div 
                    id="modal-with-feedback-badge"
                    className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-850 border border-emerald-150 rounded-xl px-3 py-1 text-xs font-semibold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{countWithFeedback} With Feedback</span>
                  </div>
                  <div 
                    id="modal-missing-feedback-badge"
                    className="inline-flex items-center gap-2 bg-amber-50 text-amber-850 border border-amber-150 rounded-xl px-3 py-1 text-xs font-semibold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>{countMissingFeedback} Missing Feedback</span>
                  </div>

                  <div className="h-4 w-[1px] bg-gray-300 self-center mx-0.5" />

                  {liveCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl px-2.5 py-1 text-[10px] font-extrabold font-mono uppercase">
                      <span>LIVE: {liveCount}</span>
                    </div>
                  )}

                  {uatCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-150 rounded-xl px-2.5 py-1 text-[10px] font-extrabold font-mono uppercase">
                      <span>UAT ON PROGRESS: {uatCount}</span>
                    </div>
                  )}

                  {crCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-150 rounded-xl px-2.5 py-1 text-[10px] font-extrabold font-mono uppercase">
                      <span>CR ON PROGRESS: {crCount}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Structured Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-[10.5px] text-gray-405 font-bold uppercase tracking-wider font-display">
                      <th className="py-3 px-4">Project Name &amp; Ticket</th>
                      <th className="py-3 px-3">PIC Short Name</th>
                      <th className="py-3 px-3">Last Status</th>
                      <th className="py-3 px-3 text-center">Average Score</th>
                      <th className="py-3 px-4 w-[45%]">Feedback Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-105 select-text">
                    {activeModal.projects.map((p, idx) => {
                      const comments = getFeedbackComments(p);
                      const rawScore = p["Rata-rata Nilai Feedback User : "];
                      const hasFeedback = rawScore !== undefined && rawScore !== null && parseFloat(String(rawScore)) > 0;
                      let scoreValue = null;
                      if (hasFeedback) {
                        const parsedNum = parseFloat(String(rawScore));
                        scoreValue = (parsedNum > 5 ? parsedNum / 20 : parsedNum).toFixed(2);
                      }
                      return (
                        <tr key={idx} className="hover:bg-gray-50/[15] transition-colors">
                          <td className="py-4 px-4 font-sans align-top">
                            <p className="font-bold text-gray-800 text-xs">{p["Project Name"]}</p>
                            <span className="font-mono text-[10px] text-gray-400 mt-1 block">{p["Ticket"] || "—"}</span>
                          </td>
                          <td className="py-4 px-3 text-gray-600 font-bold align-top whitespace-nowrap">
                            {p["PIC Short Name"] || p["PIC Name"] || "—"}
                          </td>
                          <td className="py-4 px-3 align-top whitespace-normal">
                            {(() => {
                              const lastStatusRaw = p["Last Status"] || "";
                              const lastStatusLower = lastStatusRaw.trim().toLowerCase();
                              let badgeClass = "text-slate-650 bg-slate-50 border-slate-150";
                              
                              if (lastStatusLower.includes("live") || lastStatusLower.includes("live monitoring")) {
                                badgeClass = "text-emerald-750 bg-emerald-50 border-emerald-150";
                              } else if (lastStatusLower.includes("uat")) {
                                badgeClass = "text-blue-750 bg-blue-50 border-blue-150";
                              } else if (lastStatusLower.includes("change request") || lastStatusLower.includes("progress")) {
                                badgeClass = "text-amber-750 bg-amber-50 border-amber-150";
                              }

                              return (
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono border whitespace-nowrap ${badgeClass}`}>
                                  {lastStatusRaw || "—"}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-4 px-3 text-center align-top">
                            {scoreValue ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold font-mono text-amber-800 bg-amber-50 border border-amber-100">
                                ⭐ {scoreValue}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-gray-400 bg-gray-50 border border-gray-105 uppercase">
                                —
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-650 align-top">
                            {hasFeedback ? (
                              comments.length > 0 ? (
                                <div className="space-y-1.5">
                                  {comments.map((comment, cIdx) => (
                                    <p key={cIdx} className="italic text-gray-600 leading-relaxed bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                                      &ldquo;{comment}&rdquo;
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-450 italic">No feedback text comments recorded</span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-amber-600/90 font-medium italic bg-amber-50/40 border border-amber-105 px-3 py-2 rounded-xl text-[11px] w-full">
                                ⚠️ No feedback submitted
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {activeModal.projects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-gray-400 font-sans italic">
                          No matching feedback projects in the active filtered view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Close Feedback View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - TOP CONTRIBS */}
      {activeModal && activeModal.type === 'contributors' && (() => {
        const modalTitle = activeModal.title || "";
        const isSlaEvaluated = modalTitle === "SLA Evaluated Projects";
        const isGoLive = modalTitle === "Go-Live This Period Projects" || modalTitle === "Go-Live This Period";
        const isSlaAccomplished = modalTitle === "SLA Accomplished 2026 Projects";
        const isAttention = modalTitle === "Needs Attention Projects";

        const modalProjects = activeModal.projects || [];

        // 1. Dynamic status summary breakdown badges (For Go-live modal next to project count)
        const statusCountsMap: Record<string, number> = {};
        if (isGoLive) {
          modalProjects.forEach((p: any) => {
            const rawVal = p["Last Status"] || "";
            const cleanVal = String(rawVal).trim().toUpperCase();
            if (cleanVal) {
              statusCountsMap[cleanVal] = (statusCountsMap[cleanVal] || 0) + 1;
            }
          });
        }

        // 2. Needs attention flag trigger logic
        const getAttentionTrigger = (p: any) => {
          const statusLower = p["Last Status"] ? p["Last Status"].trim().toLowerCase() : "";
          if (statusLower === "canceled") {
            return {
              text: "Project Lifecycle Terminated",
              style: "bg-red-50 text-red-700 border-red-150"
            };
          }

          const devLate = p._lateDev || p.lateDev || p["lateDev"] || 0;
          const fsdLate = p._lateFSD || p.lateFSD || p["lateFSD"] || 0;
          const sitLate = p._lateSIT || p.lateSIT || p["lateSIT"] || 0;
          const uatLate = p._lateUAT || p.lateUAT || p["lateUAT"] || 0;
          const liveLate = p._lateLive || p.lateLive || p["lateLive"] || 0;

          let lateCount = 0;
          if (devLate > 0) lateCount++;
          if (fsdLate > 0) lateCount++;
          if (sitLate > 0) lateCount++;
          if (uatLate > 0) lateCount++;
          if (liveLate > 0) lateCount++;

          if (lateCount > 1) {
            return {
              text: "Multi-Stage Gateway Failure",
              style: "bg-red-50 text-red-750 border-red-150 font-extrabold animate-pulse"
            };
          }

          if (devLate > 0) {
            return {
              text: `${devLate} Days Late in Dev Stage`,
              style: "bg-amber-50 text-amber-800 border-amber-150"
            };
          }

          const uatReschedule = p["Reschedule UAT"] || p._rescheduleUAT || 0;
          if (uatReschedule > 1) {
            return {
              text: "Repeated UAT Reschedule Warn",
              style: "bg-amber-100 text-amber-850 border-amber-200"
            };
          }

          if (fsdLate > 0) return { text: `${fsdLate} Days Late in FSD Stage`, style: "bg-amber-50 text-amber-800 border-amber-150" };
          if (sitLate > 0) return { text: `${sitLate} Days Late in SIT Stage`, style: "bg-purple-50 text-purple-750 border-purple-150" };
          if (uatLate > 0) return { text: `${uatLate} Days Late in UAT Stage`, style: "bg-sky-50 text-sky-700 border-sky-150" };
          if (liveLate > 0) return { text: `${liveLate} Days Late in Go-Live Stage`, style: "bg-orange-50 text-orange-755 border-orange-150" };

          return {
            text: "SLA Gateway Watchlabel",
            style: "bg-slate-50 text-slate-750 border-slate-200"
          };
        };

        const modalMaxWidth = isGoLive ? "max-w-6xl" : isAttention ? "max-w-4xl" : "max-w-3xl";

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`bg-white rounded-2xl ${modalMaxWidth} w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100`}>
              {/* Header */}
              <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/55">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-display">
                    {activeModal.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400 font-medium whitespace-normal">
                      Active Snapshot Contributor List &bull; {modalProjects.length} Projects found
                    </p>
                    
                    {/* Unique Status Badges for Go Live modal in header area */}
                    {isGoLive && Object.entries(statusCountsMap).map(([statusName, count]) => {
                      let badgeColor = "bg-slate-50 text-slate-800 border-slate-200";
                      const lowerName = statusName.toLowerCase();
                      if (lowerName.includes("live")) {
                        badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-150";
                      } else if (lowerName.includes("uat")) {
                        badgeColor = "bg-blue-50 text-blue-850 border-blue-150";
                      } else if (lowerName.includes("change request") || lowerName.includes("progress")) {
                        badgeColor = "bg-amber-50 text-amber-850 border-amber-150";
                      }
                      return (
                        <span key={statusName} className={`inline-flex items-center gap-1 text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-full border whitespace-nowrap ${badgeColor}`}>
                          {statusName}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Informational alert banners */}
              {isSlaEvaluated && (
                <div id="sla-evaluated-prompt-banner" className="bg-blue-50/70 border border-blue-150 p-4 rounded-xl mx-6 mt-4 flex items-start gap-2.5">
                  <span className="text-blue-600 mt-0.5 shrink-0 text-base">ℹ️</span>
                  <div className="text-xs text-blue-800 font-medium leading-relaxed whitespace-normal">
                    <strong>Presentation Note:</strong> This list captures all core projects whose development windows or planned target lines fall within the active evaluation range. It forms the baseline absolute universe used to compute the global SLA compliance scores, ensuring comprehensive pipeline accountability.
                  </div>
                </div>
              )}

              {isSlaAccomplished && (
                <div id="sla-accomplished-prompt-banner" className="bg-emerald-50/70 border border-emerald-150 p-4 rounded-xl mx-6 mt-4 flex items-start gap-2.5">
                  <span className="text-emerald-600 mt-0.5 shrink-0 text-base">✅</span>
                  <div className="text-xs text-emerald-800 font-medium leading-relaxed whitespace-normal">
                    <strong>Criteria Log:</strong> Projects listed here achieved an ideal delivery state, meeting or exceeding target velocity benchmarks with 0 net delay days recorded across the Development checkpoint gate.
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 text-[10.5px] text-gray-405 font-bold uppercase tracking-wider font-display">
                        {isGoLive ? (
                          <>
                            <th className="py-3 px-4 w-[12%] whitespace-normal">Ticket</th>
                            <th className="py-3 px-4 w-[23%] min-w-[140px] whitespace-normal">Project Name</th>
                            <th className="py-3 px-3 w-[15%] whitespace-normal">PIC Name</th>
                            <th className="py-3 px-3 w-[15%] whitespace-normal text-center">Planning &amp; Realization</th>
                            <th className="py-3 px-3 w-[15%] whitespace-normal">Live Status</th>
                            <th className="py-3 px-4 w-[20%] whitespace-normal">Live Progress Updates</th>
                          </>
                        ) : isAttention ? (
                          <>
                            <th className="py-3 px-4 w-[12%] whitespace-normal">Ticket</th>
                            <th className="py-3 px-4 w-[35%] min-w-[180px] whitespace-normal">Project Name</th>
                            <th className="py-3 px-3 w-[15%] whitespace-normal">PIC Name</th>
                            <th className="py-3 px-3 w-[13%] whitespace-normal text-center">Last Status</th>
                            <th className="py-3 px-4 w-[25%] whitespace-normal text-right">Attention Flag Trigger</th>
                          </>
                        ) : (
                          <>
                            <th className="py-3 px-4 w-[15%] whitespace-normal">Ticket</th>
                            <th className="py-3 px-4 w-[50%] min-w-[200px] whitespace-normal">Project Name</th>
                            <th className="py-3 px-3 w-[20%] whitespace-normal">PIC Name</th>
                            <th className="py-3 px-3 w-[15%] whitespace-normal text-right">Last Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 select-text">
                      {modalProjects.map((p, idx) => {
                        const grp = statusGroupOf(p["Last Status"]);
                        let stampColor = "bg-blue-50 text-blue-700 border-blue-100";
                        if (grp === "Live") stampColor = "bg-emerald-50 text-emerald-800 border-emerald-150";
                        if (grp === "Hold") stampColor = "bg-purple-50 text-purple-700 border-purple-100";
                        if (grp === "Canceled") stampColor = "bg-rose-50 text-rose-700 border-rose-100";
                        if (grp === "Antrian") stampColor = "bg-amber-50 text-amber-800 border-amber-100";

                        if (isGoLive) {
                          return (
                            <tr key={idx} className="hover:bg-gray-50/10 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-gray-500 text-[11px] align-top whitespace-normal">
                                {p["Ticket"] || "—"}
                              </td>
                              <td className="py-3 px-4 text-gray-800 font-bold whitespace-normal break-words align-top" style={{ minWidth: "140px" }} title={p["Project Name"]}>
                                {p["Project Name"]}
                              </td>
                              <td className="py-3 px-3 text-gray-600 font-semibold align-top whitespace-normal">
                                {p["PIC Name"] || "—"}
                              </td>
                              <td className="py-3 px-3 align-top whitespace-normal text-center">
                                <div className="flex flex-col gap-1 items-center justify-center">
                                  {p["(Live) Plan in Week"] && (
                                    <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 uppercase font-mono">
                                      Plan: {p["(Live) Plan in Week"]}
                                    </span>
                                  )}
                                  {(p["(Live) Realized in date"] || p["(Live) Realized in Date"]) && (
                                    <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-850 border border-emerald-150 uppercase font-mono">
                                      Realized: {p["(Live) Realized in date"] || p["(Live) Realized in Date"]}
                                    </span>
                                  )}
                                  {!p["(Live) Plan in Week"] && !p["(Live) Realized in date"] && !p["(Live) Realized in Date"] && (
                                    <span className="text-gray-400 italic text-[11px]">—</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 align-top text-[11px] font-semibold text-gray-700 whitespace-normal">
                                {p["(Live) Status"] || "—"}
                              </td>
                              <td className="py-3 px-4 whitespace-normal break-words max-w-lg text-[11.5px] leading-relaxed text-gray-650 align-top line-clamp-6 overflow-y-auto max-h-[140px]">
                                {p["(Live) Progress Updated"] || "—"}
                              </td>
                            </tr>
                          );
                        }

                        if (isAttention) {
                          const triggerInfo = getAttentionTrigger(p);
                          return (
                            <tr key={idx} className="hover:bg-gray-50/10 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-gray-500 text-[11px] align-top whitespace-normal">
                                {p["Ticket"] || "—"}
                              </td>
                              <td className="py-3 px-4 text-gray-800 font-bold whitespace-normal break-words align-top" style={{ minWidth: "180px" }} title={p["Project Name"]}>
                                {p["Project Name"]}
                              </td>
                              <td className="py-3 px-3 text-gray-600 font-semibold align-top whitespace-normal">
                                {p["PIC Name"] || "—"}
                              </td>
                              <td className="py-3 px-3 align-top text-center whitespace-normal">
                                <span className={`inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${stampColor}`}>
                                  {p["Last Status"] || "Unknown"}
                                </span>
                              </td>
                              <td className="py-3 px-4 align-top text-right whitespace-normal">
                                <span className={`inline-block text-[10px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${triggerInfo.style}`}>
                                  {triggerInfo.text}
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // Standard SLA Evaluated, SLA Accomplished, or general contributors modal
                        return (
                          <tr key={idx} className="hover:bg-gray-50/10 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-gray-500 text-[11px] align-top whitespace-normal">
                              {p["Ticket"] || "—"}
                            </td>
                            <td className="py-3 px-4 text-gray-800 font-bold whitespace-normal break-words align-top" style={{ minWidth: "200px" }} title={p["Project Name"]}>
                              {p["Project Name"]}
                            </td>
                            <td className="py-3 px-3 text-gray-600 font-semibold align-top whitespace-normal">
                              {p["PIC Name"] || "—"}
                            </td>
                            <td className="py-3 px-3 text-right align-top whitespace-normal">
                              <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                                <span className={`inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${stampColor}`}>
                                  {p["Last Status"] || "Unknown"}
                                </span>
                                {isSlaAccomplished && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 border border-emerald-200 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                    ✓ ACHIEVED
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {modalProjects.length === 0 && (
                        <tr>
                          <td colSpan={isGoLive ? 6 : isAttention ? 5 : 4} className="py-12 text-center text-xs text-gray-400 font-sans italic">
                            No contributing projects found for this criteria in the selected range.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Detail View
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - HISTORICAL snapshot queue metadata */}
      {activeModal && activeModal.type === 'historical_queue' && (() => {
        const getHistoricalQueueRows = () => {
          const rows = HISTORICAL_QUEUE_SNAPSHOT.slice(1);
          if (selectedHistTab === "W5 Mar 26") {
            return rows
              .filter(r => r["Project On Queue"] !== undefined && r["Project On Queue"] !== null)
              .map(r => ({
                id: r["Project On Queue"],
                ticket: r["Column5"] || "—",
                projectName: r["Column6"] || "—",
                picName: r["Column7"] || "—",
                owner: r["Column8"] || "—",
                department: r["Column9"] || "—"
              }));
          } else if (selectedHistTab === "W1 Apr 26") {
            return rows
              .filter(r => r["Column11"] !== undefined && r["Column11"] !== null)
              .map(r => ({
                id: r["Column11"],
                ticket: r["Column12"] || "—",
                projectName: r["Column13"] || "—",
                picName: r["Column14"] || "—",
                owner: r["Column15"] || "—",
                department: r["Column16"] || "—"
              }));
          } else if (selectedHistTab === "W2 Apr 26") {
            return rows
              .filter(r => r["Column18"] !== undefined && r["Column18"] !== null)
              .map(r => ({
                id: r["Column18"],
                ticket: r["Column19"] || "—",
                projectName: r["Column20"] || "—",
                picName: r["Column21"] || "—",
                owner: r["Column22"] || "—",
                department: r["Column23"] || "—"
              }));
          } else {
            return rows
              .filter(r => r["Column25"] !== undefined && r["Column25"] !== null)
              .map(r => ({
                id: r["Column25"],
                ticket: r["Column26"] || "—",
                projectName: r["Column27"] || "—",
                picName: r["Column28"] || "—",
                owner: r["Column29"] || "—",
                department: r["Column30"] || "—"
              }));
          }
        };

        const currentRows = getHistoricalQueueRows();

        const departmentAggregator: Record<string, number> = {};
        currentRows.forEach(project => {
          const deptName = project.department ? String(project.department).trim().toUpperCase() : "OTHER";
          if (deptName && deptName !== "—") {
            departmentAggregator[deptName] = (departmentAggregator[deptName] || 0) + 1;
          }
        });

        const getDeptStyles = (name: string) => {
          const lower = name.toLowerCase();
          if (lower.includes("business process")) {
            return {
              bg: "bg-blue-50/80",
              border: "border-blue-150",
              text: "text-blue-900",
              numText: "text-blue-600",
              icon: "users" as const
            };
          }
          if (lower.includes("operation")) {
            return {
              bg: "bg-emerald-50/80",
              border: "border-emerald-150",
              text: "text-emerald-900",
              numText: "text-emerald-700",
              icon: "settings" as const
            };
          }
          if (lower.includes("finance") || lower.includes("accounting")) {
            return {
              bg: "bg-amber-50/80",
              border: "border-amber-150",
              text: "text-amber-900",
              numText: "text-amber-700",
              icon: "percent" as const
            };
          }
          if (lower.includes("marketing")) {
            return {
              bg: "bg-rose-50/80",
              border: "border-rose-150",
              text: "text-rose-900",
              numText: "text-rose-600",
              icon: "pie" as const
            };
          }
          if (lower.includes("guarding")) {
            return {
              bg: "bg-purple-50/80",
              border: "border-purple-150",
              text: "text-purple-900",
              numText: "text-purple-600",
              icon: "clock" as const
            };
          }
          return {
            bg: "bg-slate-50/90",
            border: "border-slate-200",
            text: "text-slate-800",
            numText: "text-slate-600",
            icon: "layers" as const
          };
        };

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-[92vw] max-w-7xl h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100">
              {/* Header */}
              <div className="p-5 border-b border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/55 select-none">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-display">
                    {activeModal.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    Static Backlog Snapshots &bull; {currentRows.length} projects active in <span className="font-extrabold text-blue-600 font-mono">{selectedHistTab}</span>
                  </p>
                </div>

                {/* Tabbed Navigation inside snapshot modal */}
                <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-center">
                  {(['W5 Mar 26', 'W1 Apr 26', 'W2 Apr 26', 'W3 Apr 26'] as const).map((tab) => {
                    const isActive = selectedHistTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setSelectedHistTab(tab)}
                        className={`px-3 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                          isActive ? "bg-white text-blue-700 shadow-xs border border-gray-200/40" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm self-end md:self-center"
                >
                  ✕
                </button>
              </div>

              {/* Informative description banner */}
              <div className="bg-slate-50/80 border border-slate-150 p-4 rounded-xl mx-6 mt-4 flex items-start gap-2.5">
                <span className="text-slate-500 mt-0.5 shrink-0 text-base leading-none">📋</span>
                <div className="text-xs text-slate-700 font-semibold leading-relaxed whitespace-normal select-text">
                  <strong>Snapshot Data Scope:</strong> This view logs the static historical projects from the baseline raw queue. Long descriptive fields wrap seamlessly to guarantee absolute readability across systems.
                </div>
              </div>

              {/* Dynamic Department Summary Cards with High Contrast */}
              <div className="grid grid-cols-5 gap-2 mx-6 mt-2 select-none">
                {Object.entries(departmentAggregator)
                  .filter(([_, count]) => count > 0)
                  .map(([deptName, count]) => {
                    const styles = getDeptStyles(deptName);
                    return (
                      <div
                        key={deptName}
                        className={`py-1.5 px-3 h-11 rounded-lg border ${styles.border} ${styles.bg} shadow-3xs flex items-center justify-between gap-2 transition-all hover:shadow-2xs min-w-0`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon name={styles.icon} className={`w-3.5 h-3.5 ${styles.numText} shrink-0`} />
                          <p className={`text-[10px] font-bold tracking-tight uppercase truncate ${styles.text}`} title={deptName}>
                            {deptName}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1">
                          <span className={`text-xs font-black font-mono leading-none ${styles.numText}`}>
                            {count}
                          </span>
                          <span className="text-[8px] uppercase font-bold text-gray-400 tracking-wide leading-none">
                            {count === 1 ? "Prj" : "Prjs"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Snapshot Table */}
              <div className="flex-1 overflow-y-auto overflow-x-auto mt-4 border border-slate-200 rounded-lg mx-6 mb-6 select-text">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 text-[10.5px] text-gray-405 font-bold uppercase tracking-wider font-display select-none">
                        <th className="py-3 px-4 w-[10%] text-center">Row ID</th>
                        <th className="py-3 px-4 w-[15%]">Ticket</th>
                        <th className="py-3 px-4 w-[40%] min-w-[200px]">Project Name</th>
                        <th className="py-3 px-3 w-[15%]">PIC Name</th>
                        <th className="py-3 px-3 w-[10%]">Owner</th>
                        <th className="py-3 px-4 w-[10%]">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 select-text">
                      {currentRows.map((r, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/10 transition-colors">
                          <td className="py-3 px-4 text-center font-mono font-bold text-gray-400">
                            {r.id}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-gray-600 text-[11px]">
                            {r.ticket}
                          </td>
                          {/* Force project name to wrap completely with whitespace-normal and break-words */}
                          <td className="py-3 px-4 text-gray-950 font-bold whitespace-normal break-words" style={{ minWidth: "200px" }} title={r.projectName}>
                            {r.projectName}
                          </td>
                          <td className="py-3 px-3 text-gray-600 font-semibold">
                            {r.picName}
                          </td>
                          <td className="py-3 px-3 text-gray-500 font-semibold">
                            {r.owner}
                          </td>
                          {/* Force department/division to wrap completely with whitespace-normal and break-words */}
                          <td className="py-3 px-4 text-gray-500 font-semibold whitespace-normal break-words">
                            {r.department}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Snapshot Matrix
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - KPI CARDS */}
      {activeModal && activeModal.type === 'kpi_card' && activeModal.kpiKey && (() => {
        const key = activeModal.kpiKey;
        let pList: any[] = [];
        let modalSub = "";

        if (key === "queue") {
          pList = globalRawList.filter(p => p["Last Status"] && p["Last Status"].trim().toLowerCase() === "on queue");
          modalSub = `Showing ${pList.length} projects in Queue state (Last Status exactly "On Queue")`;
        } else if (key === "progress") {
          pList = list.filter(p => {
            const statusLower = (p["Last Status"] || "").trim().toLowerCase();
            // Strictly exclude "uat on progress" and "uat on queue"
            if (statusLower === "uat on progress" || statusLower === "uat on queue") {
              return false;
            }
            return statusLower === "fsd on progress" ||
                   statusLower === "dev on progress" ||
                   statusLower === "sit on progress" ||
                   statusLower === "change request on progress" ||
                   statusGroupOf(p["Last Status"]) === "Dalam Proses";
          });
          modalSub = `Showing ${pList.length} projects active in development cycle`;
        } else if (key === "uat") {
          pList = list.filter(p => {
            const statusLower = (p["Last Status"] || "").trim().toLowerCase();
            return statusLower === "uat on queue" || statusLower === "uat on progress" || statusGroupOf(p["Last Status"]) === "UAT";
          });
          modalSub = `Showing ${pList.length} projects in UAT stage`;
        } else if (key === "monitoring") {
          pList = list.filter(p => {
            const statusLower = (p["Last Status"] || "").trim().toLowerCase();
            return statusLower === "live monitoring" || statusLower === "live on monitoring" || statusGroupOf(p["Last Status"]) === "Monitoring";
          });
          modalSub = `Showing ${pList.length} projects in post go-live monitoring stage`;
        } else if (key === "hold") {
          pList = list.filter(p => {
            const statusLower = (p["Last Status"] || "").trim().toLowerCase();
            const milestoneLower = (p["Milestone"] || "").trim().toLowerCase();
            return statusLower.includes("hold") || milestoneLower.includes("hold");
          });
          modalSub = `Showing ${pList.length} projects flagged as HOLD`;
        }

        // Subcounts definitions
        const fsdOnProgressCount = list.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "fsd on progress").length;
        const devOnProgressCount = list.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "dev on progress").length;
        const sitOnProgressCount = list.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "sit on progress").length;
        const crOnProgressCount = list.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "change request on progress").length;

        const uatOnQueueCount = list.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "uat on queue").length;
        const uatOnProgressCount = list.filter(d => d["Last Status"] && d["Last Status"].trim().toLowerCase() === "uat on progress").length;

        // Splits for Hold
        const holdByOwnerList = pList.filter(p => {
          const statusLower = (p["Last Status"] || "").trim().toLowerCase();
          const milestoneLower = (p["Milestone"] || "").trim().toLowerCase();
          return statusLower.includes("owner") || milestoneLower.includes("owner");
        });
        const holdByClientItList = pList.filter(p => {
          const statusLower = (p["Last Status"] || "").trim().toLowerCase();
          const milestoneLower = (p["Milestone"] || "").trim().toLowerCase();
          return !statusLower.includes("owner") && !milestoneLower.includes("owner");
        });

        // Date getter helper
        const getDisplayDate = (p: any) => {
          return getProjectDisplayDate(p);
        };

        return (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100 animate-in fade-in duration-200">
              {/* Header */}
              <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/55">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-display">
                    {activeModal.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {modalSub}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Sub-status breakdowns under header */}
              {key === "progress" && (
                <div className="px-6 py-3 bg-blue-50/50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center select-none">
                  <div className="bg-white border border-blue-100 rounded-xl p-2.5">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-normal">FSD On Progress</span>
                    <strong className="text-base font-extrabold text-blue-800 font-mono">{fsdOnProgressCount}</strong>
                  </div>
                  <div className="bg-white border border-blue-100 rounded-xl p-2.5">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-normal">Dev On Progress</span>
                    <strong className="text-base font-extrabold text-blue-800 font-mono">{devOnProgressCount}</strong>
                  </div>
                  <div className="bg-white border border-blue-100 rounded-xl p-2.5">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-normal">SIT On Progress</span>
                    <strong className="text-base font-extrabold text-blue-800 font-mono">{sitOnProgressCount}</strong>
                  </div>
                  <div className="bg-white border border-blue-100 rounded-xl p-2.5 col-span-2 md:col-span-1">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-normal">Change Request On Progress</span>
                    <strong className="text-base font-extrabold text-blue-800 font-mono">{crOnProgressCount}</strong>
                  </div>
                </div>
              )}

              {key === "uat" && (
                <div className="px-6 py-3 bg-amber-50/30 border-b border-gray-100 grid grid-cols-2 gap-4 text-center select-none">
                  <div className="bg-white border border-amber-100 rounded-xl p-2.5">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">UAT On Queue</span>
                    <strong className="text-base font-extrabold text-amber-700 font-mono">{uatOnQueueCount}</strong>
                  </div>
                  <div className="bg-white border border-amber-100 rounded-xl p-2.5">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">UAT On Progress</span>
                    <strong className="text-base font-extrabold text-amber-700 font-mono">{uatOnProgressCount}</strong>
                  </div>
                </div>
              )}

              {/* Main content table area */}
              <div className="flex-1 overflow-y-auto p-6">
                {key === "hold" ? (
                  // HOLD split table view
                  <div className="space-y-6">
                    {/* Hold by Owner */}
                    <div>
                      <div className="flex items-center justify-between mb-2 select-none">
                        <h4 className="text-[12px] font-bold text-gray-700 uppercase tracking-wider font-display flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                          Hold by Owner ({holdByOwnerList.length} Projects)
                        </h4>
                      </div>
                      <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-150 text-[10px] text-gray-500 font-bold uppercase tracking-wider font-display">
                              <th className="py-2.5 px-4 w-[12%]">Ticket</th>
                              <th className="py-2.5 px-4 w-[48%] min-w-[200px]">Project Name</th>
                              <th className="py-2.5 px-4 w-[15%]">PIC Short</th>
                              <th className="py-2.5 px-4 w-[12%]">Last Status</th>
                              <th className="py-2.5 px-4 text-right w-[13%]">Target/Realized Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-101 select-text">
                            {holdByOwnerList.map((p, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="py-2.5 px-4 font-mono font-bold text-gray-500">{p["Ticket"] || "—"}</td>
                                <td className="py-2.5 px-4 font-bold text-gray-800 whitespace-normal break-words" style={{ minWidth: "200px" }} title={p["Project Name"]}>{p["Project Name"]}</td>
                                <td className="py-2.5 px-4 text-gray-650">{p["PIC Short Name"] || p["PIC Name"] || "—"}</td>
                                <td className="py-2.5 px-4">
                                  <span className="inline-block text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md border text-purple-700 bg-purple-50/60 border-purple-100">
                                    {p["Last Status"] || "Hold"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-[10.5px] text-gray-500 whitespace-nowrap">{getDisplayDate(p)}</td>
                              </tr>
                            ))}
                            {holdByOwnerList.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-6 text-center text-xs text-gray-400 italic">No Owner Hold projects found in current range</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Hold by Client/IT */}
                    <div>
                      <div className="flex items-center justify-between mb-2 select-none">
                        <h4 className="text-[12px] font-bold text-gray-700 uppercase tracking-wider font-display flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          Hold by Client / IT ({holdByClientItList.length} Projects)
                        </h4>
                      </div>
                      <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-150 text-[10px] text-gray-500 font-bold uppercase tracking-wider font-display">
                              <th className="py-2.5 px-4 w-[12%]">Ticket</th>
                              <th className="py-2.5 px-4 w-[48%] min-w-[200px]">Project Name</th>
                              <th className="py-2.5 px-4 w-[15%]">PIC Short</th>
                              <th className="py-2.5 px-4 w-[12%]">Last Status</th>
                              <th className="py-2.5 px-4 text-right w-[13%]">Target/Realized Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-101 select-text">
                            {holdByClientItList.map((p, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="py-2.5 px-4 font-mono font-bold text-gray-500">{p["Ticket"] || "—"}</td>
                                <td className="py-2.5 px-4 font-bold text-gray-800 whitespace-normal break-words" style={{ minWidth: "200px" }} title={p["Project Name"]}>{p["Project Name"]}</td>
                                <td className="py-2.5 px-4 text-gray-650">{p["PIC Short Name"] || p["PIC Name"] || "—"}</td>
                                <td className="py-2.5 px-4">
                                  <span className="inline-block text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md border text-blue-700 bg-blue-50/60 border-blue-100">
                                    {p["Last Status"] || "Hold"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-[10.5px] text-gray-500 whitespace-nowrap">{getDisplayDate(p)}</td>
                              </tr>
                            ))}
                            {holdByClientItList.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-6 text-center text-xs text-gray-400 italic">No Client / IT Hold projects found in current range</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Unified table view for all other cards
                  <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-[10.5px] text-gray-405 font-bold uppercase tracking-wider font-display">
                          <th className="py-3 px-4 w-[12%]">Ticket</th>
                          <th className="py-3 px-4 w-[48%] min-w-[200px]">Project Name</th>
                          <th className="py-3 px-3 w-[15%]">PIC Short</th>
                          <th className="py-3 px-3 w-[12%]">Last Status</th>
                          <th className="py-3 px-4 text-right w-[13%]">Target/Realized Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-105 select-text">
                        {pList.map((p, idx) => {
                          const grp = statusGroupOf(p["Last Status"]);
                          let stampColor = "bg-blue-50 text-blue-700 border-blue-100";
                          if (grp === "Live") stampColor = "bg-emerald-50 text-emerald-800 border-emerald-150";
                          if (grp === "Hold") stampColor = "bg-purple-50 text-purple-700 border-purple-100";
                          if (grp === "Canceled") stampColor = "bg-rose-50 text-rose-700 border-rose-100";
                          if (grp === "Antrian") stampColor = "bg-amber-50 text-amber-800 border-amber-100";

                          return (
                            <tr key={idx} className="hover:bg-gray-50/10 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-gray-500 text-[11px]">
                                {p["Ticket"] || "—"}
                              </td>
                              <td className="py-3 px-4 text-gray-800 font-bold whitespace-normal break-words" style={{ minWidth: "200px" }} title={p["Project Name"]}>
                                {p["Project Name"]}
                              </td>
                              <td className="py-3 px-3 text-gray-650">
                                {p["PIC Short Name"] || p["PIC Name"] || "—"}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${stampColor}`}>
                                  {p["Last Status"] || "Unknown"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-[11px] text-gray-500 whitespace-nowrap">
                                {getDisplayDate(p)}
                              </td>
                            </tr>
                          );
                        })}
                        {pList.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-xs text-gray-400 font-sans italic">
                              No matching projects found for this criteria in the selected range.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Detail View
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - MILESTONE SLA PIPELINE */}
      {activeModal && activeModal.type === 'milestone_sla' && activeModal.stageName && (() => {
        const stageName = activeModal.stageName;
        const stageField = slaFieldMap[stageName.toUpperCase()];

        // 1. Filter evaluated projects for Year 2026
        const evaluatedStage2026Projects = list.filter(p => {
          const evaluatedVal = p[stageField];
          const isEvaluated = evaluatedVal === "Achieved" || evaluatedVal === "Not Achieved";
          const is2026 = p._year === "2026" || String(p["Year"]) === "2026";
          return isEvaluated && is2026;
        });

        // 2. Metrics splits
        const achievedStageList = evaluatedStage2026Projects.filter(p => p[stageField] === "Achieved");
        const missedStageList = evaluatedStage2026Projects.filter(p => p[stageField] === "Not Achieved");

        // 3. Success Percentage
        const totalEvaluated = evaluatedStage2026Projects.length;
        const pctAch = totalEvaluated > 0 ? Math.round((achievedStageList.length / totalEvaluated) * 100) : 100;

        // Custom styling markers depending on pctAch
        const statusLabel = pctAch < 93 ? "Not Achieved" : "Achieved";
        const badgeColor = pctAch < 93 ? "text-rose-700 bg-rose-50 border-rose-100" : "text-emerald-700 bg-emerald-50 border-emerald-100";

        return (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100 animate-in fade-in duration-200">
              {/* Header */}
              <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/55">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-display">
                    {activeModal.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    Evaluated projects for the <strong>{stageName}</strong> milestone stage in year <strong>2026</strong>
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              {/* High level summary badge row */}
              <div className="px-6 py-4 bg-slate-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stage Projects (2026):</span>
                  <span className="text-sm font-extrabold text-gray-900 font-mono bg-white border border-gray-150 rounded-xl px-3 py-1 shadow-2xs">
                    {totalEvaluated} Evaluated
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage SLA Pct:</span>
                  <span className={`text-sm font-extrabold font-mono rounded-xl px-3 py-1 border flex items-center gap-1.5 ${badgeColor}`}>
                    {pctAch}% ({statusLabel})
                  </span>
                </div>
              </div>

              {/* Main divided table list container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. NOT ACHIEVED / MISSED LIST */}
                <div>
                  <div className="flex items-center justify-between mb-2 select-none">
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-display flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      Not Achieved / Missed Stage SLA ({missedStageList.length} Projects)
                    </h4>
                  </div>
                  <div className="border border-rose-100 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-rose-50/50 border-b border-rose-100 text-[10px] text-rose-800 font-bold uppercase tracking-wider font-display">
                          <th className="py-2.5 px-4 w-[12%]">Ticket</th>
                          <th className="py-2.5 px-4 w-[48%] min-w-[200px]">Project Name</th>
                          <th className="py-2.5 px-4 w-[15%]">PIC Short</th>
                          <th className="py-2.5 px-4 w-[12%]">Last Status</th>
                          <th className="py-2.5 px-4 text-right w-[13%] font-display font-bold uppercase tracking-wider">Target/Realized Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-50 select-text bg-rose-50/[0.08]">
                        {missedStageList.map((p, idx) => (
                          <tr key={idx} className="hover:bg-rose-50/20">
                            <td className="py-2.5 px-4 font-mono font-bold text-gray-500">{p["Ticket"] || "—"}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 whitespace-normal break-words" style={{ minWidth: "200px" }} title={p["Project Name"]}>{p["Project Name"]}</td>
                            <td className="py-2.5 px-4 text-gray-650">{p["PIC Short Name"] || p["PIC Name"] || "—"}</td>
                            <td className="py-2.5 px-4">
                              <span className="inline-block text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md border text-rose-700 bg-rose-50/50 border-rose-100">
                                {p["Last Status"] || "Not Achieved"}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-[10.5px] text-gray-500 whitespace-nowrap">{getTargetOrRealizedDate(p, stageName)}</td>
                          </tr>
                        ))}
                        {missedStageList.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-xs text-emerald-600 font-semibold italic">
                              🎉 Phenomenal! 100% of stage projects achieved the SLA target.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. ACHIEVED LIST */}
                <div>
                  <div className="flex items-center justify-between mb-2 select-none">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-display flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Achieved Stage SLA ({achievedStageList.length} Projects)
                    </h4>
                  </div>
                  <div className="border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-50/30 border-b border-emerald-100 text-[10px] text-emerald-800 font-bold uppercase tracking-wider font-display">
                          <th className="py-2.5 px-4 w-[12%]">Ticket</th>
                          <th className="py-2.5 px-4 w-[48%] min-w-[200px]">Project Name</th>
                          <th className="py-2.5 px-4 w-[15%]">PIC Short</th>
                          <th className="py-2.5 px-4 w-[12%]">Last Status</th>
                          <th className="py-2.5 px-4 text-right w-[13%] font-display font-bold uppercase tracking-wider">Target/Realized Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50 select-text bg-white">
                        {achievedStageList.map((p, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/10">
                            <td className="py-2.5 px-4 font-mono font-bold text-gray-500">{p["Ticket"] || "—"}</td>
                            <td className="py-2.5 px-4 font-semibold text-gray-800 whitespace-normal break-words" style={{ minWidth: "200px" }} title={p["Project Name"]}>{p["Project Name"]}</td>
                            <td className="py-2.5 px-4 text-gray-650">{p["PIC Short Name"] || p["PIC Name"] || "—"}</td>
                            <td className="py-2.5 px-4">
                              <span className="inline-block text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md border text-emerald-700 bg-emerald-50/50 border-emerald-100">
                                {p["Last Status"] || "Achieved"}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-[10.5px] text-gray-500 whitespace-nowrap">{getTargetOrRealizedDate(p, stageName)}</td>
                          </tr>
                        ))}
                        {achievedStageList.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-xs text-gray-400 italic">No achieved projects recorded</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Stage View
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RENDER DYNAMIC DRILL-DOWN MODALS - DEV SLA YEAR ON YEAR COMPARISON */}
      {activeModal && activeModal.type === 'yoy_comparison' && (() => {
        const MONTH_MAP_LOWER: Record<string, number> = {
          jan: 0,
          feb: 1,
          mar: 2,
          apr: 3,
          may: 4,
          mei: 4,
          jun: 5,
          jul: 6,
          aug: 7,
          agu: 7,
          sep: 8,
          oct: 9,
          okt: 9,
          nov: 10,
          dec: 11,
          des: 11
        };

        const getProjMonthIdx = (p: any) => {
          const period = p["Period"];
          if (!period) return -1;
          const parts = String(period).trim().split("-");
          if (parts.length === 0) return -1;
          const mStr = parts[0].trim().toLowerCase();
          const index = MONTH_MAP_LOWER[mStr];
          return index !== undefined ? index : -1;
        };

        const startIdx = startMonth ? (MONTH_MAP_LOWER[startMonth.toLowerCase()] ?? 0) : 0;
        const endIdx = endMonth ? (MONTH_MAP_LOWER[endMonth.toLowerCase()] ?? 11) : 11;

        const masterAll = allProjects || list;

        const projs2025 = masterAll.filter(p => {
          const is2025 = p._year === "2025" || String(p["Year"]) === "2025";
          if (!is2025) return false;
          const mIdx = getProjMonthIdx(p);
          return mIdx >= startIdx && mIdx <= endIdx;
        });

        const projs2026 = masterAll.filter(p => {
          const is2026 = p._year === "2026" || String(p["Year"]) === "2026";
          if (!is2026) return false;
          const mIdx = getProjMonthIdx(p);
          return mIdx >= startIdx && mIdx <= endIdx;
        });

        // Helper to check if dev is completed
        const getDevStatus = (p: any) => {
          const isCompleted = p["DEV SLA"] === "Achieved" || p["DEV SLA"] === "Not Achieved" || !!p["(Dev) Realized In Date"];
          return isCompleted ? (
            <span className="inline-block text-[9.5px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md border text-emerald-700 bg-emerald-50 border-emerald-100">
              Completed
            </span>
          ) : (
            <span className="inline-block text-[9.5px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md border text-blue-700 bg-blue-50 border-blue-100/70 animate-pulse">
              In-Progress
            </span>
          );
        };

        // Delay days helper
        const getDelayVal = (p: any) => {
          const delay = p._lateDev != null ? p._lateDev : 0;
          if (delay > 0) {
            return (
              <span className="font-mono text-rose-600 font-bold bg-rose-50 border border-rose-100/60 px-1.5 py-0.5 rounded-md">
                +{delay} d
              </span>
            );
          } else if (delay < 0) {
            return (
              <span className="font-mono text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100/60 px-1.5 py-0.5 rounded-md">
                {delay} d
              </span>
            );
          }
          return <span className="font-mono text-gray-400">0 d</span>;
        };

        return (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden transform scale-100 animate-in fade-in duration-200">
              {/* Header */}
              <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/55">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-display">
                    {activeModal.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    Unified comparative dashboard contrasting 2025 performance directly with 2026 based on active scope filters
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-105 rounded-xl transition-colors cursor-pointer text-sm font-sans"
                >
                  ✕
                </button>
              </div>

              {/* Side-by-side Split Screens Container */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/20">
                {/* LEFT COLUMN: Year 2025 */}
                <div className="flex flex-col space-y-3 bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-1">
                    <h4 className="text-sm font-extrabold text-blue-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      Year 2025 Dataset ({projs2025.length} Projects)
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono">Periode 2025</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-[10px] text-gray-500 font-bold uppercase tracking-wider font-display">
                          <th className="py-2.5 px-3 w-[10%]">Year/Period</th>
                          <th className="py-2.5 px-3 w-[35%] min-w-[180px]">Ticket & Name</th>
                          <th className="py-2.5 px-2 w-[12%]">PIC Short</th>
                          <th className="py-2.5 px-2 w-[12%]">Dev Status</th>
                          <th className="py-2.5 px-3 text-right w-[10%]">Delay Days</th>
                          <th className="py-2.5 px-3 text-left w-[21%] min-w-[180px]">REASON</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 select-text">
                        {projs2025.map((p, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-mono text-[10.5px] text-gray-500">
                              {(p._year || p["Year"] || "2025")} / {(p._period || p["Period"] || "—")}
                            </td>
                            <td className="py-2.5 px-3 min-w-[180px] whitespace-normal break-words" title={p["Project Name"]}>
                              <div className="font-mono text-[10px] font-bold text-gray-400">{p["Ticket"] || "—"}</div>
                              <div className="font-bold text-gray-800 text-[11.5px] whitespace-normal break-words">{p["Project Name"]}</div>
                            </td>
                            <td className="py-2.5 px-2 text-gray-650" title={p["PIC Short Name"] || p["PIC Name"] || ""}>
                              {p["PIC Short Name"] || p["PIC Name"] || "—"}
                            </td>
                            <td className="py-2.5 px-2">
                              {getDevStatus(p)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-xs">
                              {getDelayVal(p)}
                            </td>
                            <td className="py-2.5 px-3 text-left text-[11px] text-gray-500 min-w-[180px] whitespace-normal break-words" title={p["(Dev) Kategori Alasan Terlambat >=2022"] || ""}>
                              {p["(Dev) Kategori Alasan Terlambat >=2022"] ? String(p["(Dev) Kategori Alasan Terlambat >=2022"]).trim() || "-" : "-"}
                            </td>
                          </tr>
                        ))}
                        {projs2025.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs text-gray-400 italic">
                              No Year 2025 projects available for the current filter scope.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT COLUMN: Year 2026 */}
                <div className="flex flex-col space-y-3 bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-1">
                    <h4 className="text-sm font-extrabold text-amber-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Year 2026 Dataset ({projs2026.length} Projects)
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono font-bold">Periode 2026</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-[10px] text-gray-500 font-bold uppercase tracking-wider font-display">
                          <th className="py-2.5 px-3 w-[10%]">Year/Period</th>
                          <th className="py-2.5 px-3 w-[35%] min-w-[180px]">Ticket & Name</th>
                          <th className="py-2.5 px-2 w-[12%]">PIC Short</th>
                          <th className="py-2.5 px-2 w-[12%]">Dev Status</th>
                          <th className="py-2.5 px-3 text-right w-[10%]">Delay Days</th>
                          <th className="py-2.5 px-3 text-left w-[21%] min-w-[180px]">REASON</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-101 select-text">
                        {projs2026.map((p, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/[0.04]">
                            <td className="py-2.5 px-3 font-mono text-[10.5px] text-gray-500">
                              {(p._year || p["Year"] || "2026")} / {(p._period || p["Period"] || "—")}
                            </td>
                            <td className="py-2.5 px-3 min-w-[180px] whitespace-normal break-words" title={p["Project Name"]}>
                              <div className="font-mono text-[10px] font-bold text-gray-400">{p["Ticket"] || "—"}</div>
                              <div className="font-bold text-gray-800 text-[11.5px] whitespace-normal break-words">{p["Project Name"]}</div>
                            </td>
                            <td className="py-2.5 px-2 text-gray-650" title={p["PIC Short Name"] || p["PIC Name"] || ""}>
                              {p["PIC Short Name"] || p["PIC Name"] || "—"}
                            </td>
                            <td className="py-2.5 px-2">
                              {getDevStatus(p)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-xs">
                              {getDelayVal(p)}
                            </td>
                            <td className="py-2.5 px-3 text-left text-[11px] text-gray-500 min-w-[180px] whitespace-normal break-words" title={p["(Dev) Kategori Alasan Terlambat >=2022"] || ""}>
                              {p["(Dev) Kategori Alasan Terlambat >=2022"] ? String(p["(Dev) Kategori Alasan Terlambat >=2022"]).trim() || "-" : "-"}
                            </td>
                          </tr>
                        ))}
                        {projs2026.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs text-gray-400 italic">
                              No Year 2026 projects available for the current filter scope.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
