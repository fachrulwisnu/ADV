# 🖥️ IT Dashboard & Data Sync Architecture

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)](https://notion.so/)

> **Version:** 1.2  
> **Status:** Production-Ready  
> **Purpose:** Comprehensive System Handover & Documentation of the Notion-to-Supabase Synchronization Data Pipeline & Live IT Metrics Dashboard.

---

## 📌 Table of Contents
1. [Ikhtisar Arsitektur (Architecture Overview)](#1-ikhtisar-arsitektur-architecture-overview)
2. [Alur Sinkronisasi (Sync Logic & Workflow)](#2-alur-sinkronisasi-sync-logic--workflow)
3. [Struktur Proyek (Project Folder Tree)](#3-struktur-proyek-project-folder-tree)
4. [Database Schema (PostgreSQL)](#4-database-schema-postgresql)
5. [Setup & Instalasi Lingkungan (Environment Setup)](#5-setup--instalasi-lingkungan-environment-setup)
6. [Integrasi Frontend & Dashboard UI](#6-integrasi-frontend--dashboard-ui)

---

## 1. Ikhtisar Arsitektur (Architecture Overview)

Dokumen ini menjelaskan alur data (**Data Pipeline**) dari **Notion** (sebagai *Source of Truth*) ke **Supabase** (sebagai *Operational Database & Dashboard Warehouse*) menggunakan pola **ETL** (*Extract, Transform, Load*). 

Sistem ini dirancang secara tangguh (*robust*) untuk menangani ratusan data dengan mengedepankan performa tinggi, menghindari masalah *timeout*, dan melacak setiap perubahan data secara granular untuk dianalisis dalam Dashboard.

```
       +-----------------------+
       |   NOTION DATABASE     |  <-- [Source of Truth]
       +-----------------------+
                   |
                   |  (REST API with Pagination Pull)
                   v
       +-----------------------+
       | SUPABASE EDGE FUNCTION|  <-- [Secure & Serverless ETL Engine]
       +-----------------------+
         - Flattening Nested JSON (extractNotionValue)
         - Deduplication & Diff Checking (Audit Trail Generation)
         - Chunked Batch Loading (50 records per insert)
                   |
         +---------+---------+
         |                   |
         v                   v
+------------------+  +----------------------+
| notion_projects  |  |  project_audit_logs  |  <-- [Structured Warehouse]
+------------------+  +----------------------+
         |                   |
         +---------+---------+
                   |
                   v
       +-----------------------+
       |   REACT LIVE UI       |  <-- [High-Contrast Executive View]
       +-----------------------+
```

---

## 2. Alur Sinkronisasi (Sync Logic & Workflow)

Sistem sinkronisasi tidak berjalan di *Client-side*, melainkan diproses sepenuhnya oleh **Supabase Edge Functions** untuk memastikan keamanan *credential* dan stabilitas performa.

### 2.1 Trigger Mekanisme
Sistem memiliki dua metode pemicu (*trigger*):
1. **Manual Trigger:** Dipanggil langsung melalui tombol sinkronisasi pada Frontend Dashboard oleh *user* dengan menyertakan HTTP Header `Authorization: Bearer <ANON_KEY>` dan *body payload* rahasia (`{ secret: "ADVDUAR", "trigger": "Manual" }`).
2. **Automated Cron Worker:** Dijalankan secara otomatis setiap 2 jam menggunakan *database extension* `pg_cron` dan `pg_net` langsung dari dalam database PostgreSQL Supabase.

### 2.2 Proses ETL (Extract, Transform, Load)
* **Extract (Pagination Pull):** Edge Function menarik data dari Notion API menggunakan sistem *looping* (berdasarkan penanda `has_more` dan `start_cursor`) untuk memastikan seluruh record (**544+ data**) terambil tanpa terpotong limitasi 100 data bawaan Notion API.
* **Transform (Cleansing & Deduplication):**
  * **Cleansing Engine:** Data JSON Notion yang sangat bersarang (*nested properties*) dipipihkan (*flatten*) menjadi pasangan *Key-Value* yang sederhana melalui utilitas `extractNotionValue`. Data bersih dan terstruktur ini disimpan di dalam kolom `cleansed_data` bertipe `JSONB` untuk kebutuhan fleksibilitas visualisasi.
  * **Deduplication:** Menghindari *error duplicate key*. Sistem menggunakan `notion_page_id` sebagai *Primary Key* yang mutlak, memungkinkan adanya nama `Ticket` kembar dari Notion tanpa membuat database *crash*.
* **Data Diffing (Audit Trail):** Sebelum menyimpan, sistem membandingkan (*compare*) properti penting (seperti *Status, Milestone, PIC Name, Project Name*) antara data yang baru ditarik dengan data lama yang sudah ada di Supabase. Jika dideteksi adanya perbedaan, sistem merekam baris mutasi ke tabel `project_audit_logs`.
* **Load (Batch Upsert):** Untuk menghindari *Payload Too Large* dan *Statement Timeout (57014)*, data yang sudah bersih dan log auditnya dipotong menjadi kelompok-kelompok kecil (Batching) berukuran **50 records per request** saat melakukan `upsert` ke PostgreSQL.

---

## 3. Struktur Proyek (Project Folder Tree)

Berikut adalah struktur folder dan komponen utama yang membentuk dashboard IT modern ini:

```text
.
├── .env.example             # Contoh konfigurasi environment local
├── index.html               # Main HTML Entry point
├── package.json             # File manifes dependency npm & build scripts
├── server.ts                # Express backend server (Vite Integration & Static asset serving)
├── tsconfig.json            # Konfigurasi TypeScript compiler
├── vite.config.ts           # Konfigurasi bundler Vite
├── supabase/                # File konfigurasi & rule database Supabase
└── src/                     # Source code aplikasi React-Vite
    ├── main.tsx             # Entry point inisialisasi React
    ├── App.tsx              # Root component & state controller (Tab navigation, fetch wrapper)
    ├── index.css            # Global stylesheets (Tailwind CSS Directives & custom font definitions)
    ├── parser.ts            # Parser & Sanitizer data raw menjadi format siap render
    ├── types.ts             # Definisi interface TypeScript global & model data proyek
    ├── utils.ts             # Utilitas kalkulasi metrik SLA, parsing tanggal, & kalkulasi skor feedback
    ├── data.ts              # Data statis & fallback mock asset
    └── components/          # Komponen UI modular yang didekorasi dengan Tailwind CSS
        ├── UI.tsx               # Utility visual atoms (badges, layout frames, metric panels)
        ├── Charts.tsx           # Visualisasi data D3 / SVG (bento grid charts, line chart, radar map)
        ├── SyncLogsViewer.tsx   # Dashboard widgets penampil log sinkronisasi ringkas
        ├── TabOverview.tsx      # Tab Utama: Executive Summary, Trend SLA YoY, & highlight backlog
        ├── TabPipeline.tsx      # Tab Pipeline: Visualisasi antrean, heatmap beban kerja, & depth status
        ├── TabCategory.tsx      # Tab Category: Breakdown matriks proyek berdasarkan divisi, jenis, & PIC
        ├── TabSla.tsx           # Tab SLA: Analisis mendalam delay fungsional, SLA Stage, & root causes
        ├── TabProjects.tsx      # Tab Projects: Data table komprehensif dengan sistem filter & search
        ├── TabSyncLogs.tsx      # Tab Sync Logs: Riwayat lengkap aktivitas sync database
        └── TabSyncLogsView.tsx  # Sub-tab detail penampil log granular audit operasional
```

---

## 4. Database Schema (PostgreSQL)

Jalankan script SQL berikut di **Supabase SQL Editor** untuk membangun struktur tabel dan indeks penunjang performa kueri dashboard.

### 4.1 Tabel Utama Proyek (`notion_projects`)
Menyimpan ringkasan status terkini serta seluruh dataset terkompresi dari Notion.
```sql
CREATE TABLE public.notion_projects (
  notion_page_id VARCHAR PRIMARY KEY, -- ID Notion sebagai Unique Primary Key untuk menghindari konflik duplikasi nama tiket
  ticket VARCHAR,
  project_name TEXT,
  owner_division VARCHAR,
  pic_name VARCHAR,
  last_status VARCHAR,
  milestone VARCHAR,
  created_time TIMESTAMPTZ,
  raw_data JSONB,
  cleansed_data JSONB, -- Menampung seluruh matrix/properties turunan Notion (SLA Days, Detail Tanggal Realisasi, dll)
  last_synced TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indeks performa untuk kueri live filter dashboard
CREATE INDEX idx_notion_projects_last_synced ON public.notion_projects(last_synced);
```

### 4.2 Tabel Sistem Log (`sync_logs`)
Menyimpan riwayat berjalannya proses sinkronisasi (baik sukses maupun gagal).
```sql
CREATE TABLE public.sync_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sync_type TEXT NOT NULL, -- 'Manual' atau 'Cron Worker'
  status TEXT NOT NULL, -- 'Success' atau 'Failed'
  records_processed INTEGER DEFAULT 0,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 4.3 Tabel Riwayat Perubahan Data (`project_audit_logs`)
Melacak mutasi data untuk kebutuhan Audit Logs Dashboard (seperti perpindahan PIC, perubahan status, dan pendeteksian proyek baru).
```sql
CREATE TABLE public.project_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notion_page_id VARCHAR NOT NULL,
  ticket VARCHAR,
  project_name TEXT,
  change_category TEXT NOT NULL, -- Kategori mutasi: 'STATUS', 'MILESTONE', 'PIC', 'NAME', atau 'NEW_PROJECT'
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indeks optimasi agar sorting log audit berjalan instan
CREATE INDEX idx_audit_logs_notion_id ON public.project_audit_logs(notion_page_id);
CREATE INDEX idx_audit_logs_created_at ON public.project_audit_logs(created_at DESC);
```

---

## 5. Setup & Instalasi Lingkungan (Environment Setup)

### 5.1 Environment Secrets (Supabase Edge Functions)
Tambahkan variabel lingkungan berikut melalui menu **Supabase Dashboard > Settings > Edge Functions > Secrets** agar ETL Engine dapat berkomunikasi dengan API eksternal:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NB_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5.2 Setup Cron Worker (`pg_cron`)
Untuk mengotomatisasi sinkronisasi data secara otomatis tanpa intervensi manual setiap 2 jam, jalankan skrip pendaftaran cron berikut di **Supabase SQL Editor**:

```sql
-- Aktifkan ekstensi database yang diperlukan
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daftarkan jadwal worker otomatis
SELECT cron.schedule(
  'auto-sync-notion', 
  '0 */2 * * *', -- Ekspresi Cron: Berjalan setiap 2 jam
  $$
    SELECT net.http_post(
      url := 'https://[PROJECT_REF].supabase.co/functions/v1/sync-notion',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer [SUPABASE_ANON_KEY]"}'::jsonb,
      body := '{"secret": "ADVDUAR", "trigger": "Cron Worker"}'::jsonb
    );
  $$
);
```
*(Catatan: Pastikan untuk mengganti `[PROJECT_REF]` dan `[SUPABASE_ANON_KEY]` dengan referensi dan kunci anon publik yang sesuai dari proyek Supabase Anda).*

---

## 6. Integrasi Frontend & Dashboard UI

Aplikasi Web Frontend dibangun menggunakan arsitektur modern berkinerja tinggi untuk memproses kueri analitik secara langsung di sisi klien:

### 6.1 Data Fetching & Keamanan Render
Frontend mengambil data proyek dari database menggunakan kueri instan tanpa pembatasan pagination di sisi klien karena database telah terindeks secara optimal:
```typescript
const { data, error } = await supabase
  .from("notion_projects")
  .select("notion_page_id, ticket, project_name, owner_division, pic_name, last_status, milestone, cleansed_data");
```
Setiap item proyek yang dirender di dalam perulangan komponen React menggunakan properti `notion_page_id` sebagai `key` unik virtual DOM guna menjamin stabilitas rendering dan meminimalkan beban kalkulasi ulang (*re-renders*).

### 6.2 Ekstraksi Matriks JSONB Dinamis
Kalkulasi SLA, penentuan durasi keterlambatan, dan pencarian tanggal pencapaian diekstrak secara real-time dari kolom dinamis `cleansed_data` (misalnya: `item.cleansed_data["(FSD) Late Days"]`), memberikan fleksibilitas tanpa perlu mengubah skema tabel database utama saat ada properti baru yang ditambahkan di Notion.

### 6.3 Real-Time Sync Audit Logs Explorer
Halaman khusus **Sync Logs & Audit Explorer** menyajikan visualisasi data historis audit operasional yang memantau pergeseran nilai parameter di dalam database:
* **Metric Cards:** Menyediakan indikator cepat seperti **Total Logs**, **Status Updates**, **Milestone Updates**, dan **New Projects** yang dikalkulasikan langsung dari kueri tabel `project_audit_logs`.
* **Badge Indicators:** Menerapkan visualisasi dinamis berkode warna (*amber*, *blue*, *emerald*, *purple*, *indigo*) berdasarkan kategori mutasi data untuk memudahkan monitoring perubahan secara sekilas.
