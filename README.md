# 📊 Project IT Dashboard - Notion to Supabase Sync

Dashboard analitik dan pelaporan SLA untuk memantau siklus hidup proyek IT. Aplikasi ini menggunakan arsitektur modern Next.js yang disinkronkan secara *real-time* dengan Notion Kanban Board, menyimpan data yang telah dibersihkan (cleansed) ke Supabase PostgreSQL.

## 🚀 Fitur Utama
- **ETL Data Pipeline:** Mengekstrak *payload* kompleks dari Notion dan meratakannya (*flatten*) ke dalam bentuk `cleansed_data` JSONB.
- **Delta Sync (Incremental):** Hanya menarik data proyek yang mengalami perubahan sejak *sync* terakhir, meminimalisir beban jaringan dan *database*.
- **Batch Processing:** Menyisipkan data dalam potongan (*chunks*) untuk mencegah *database timeout*.
- **Automated Logging:** Melacak setiap perubahan status dan *milestone* secara otomatis.
- **Background Cron Jobs:** Sinkronisasi berjalan otomatis di *background* setiap 3 jam.

---

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum melakukan instalasi, pastikan Anda telah menyiapkan hal-hal berikut:
1. **Node.js** (v18.x atau lebih baru) & **npm/yarn/pnpm**.
2. **Akun Supabase:** Siapkan URL dan Keys (Anon & Service Role).
3. **Notion Integration API:** *Internal Integration Secret Token* dari Notion.
4. **Notion Database ID:** ID dari Kanban Board target (Pastikan integrasi Notion sudah di- *invite/connect* ke halaman Kanban tersebut).

---

## ⚙️ Variabel Environment (`.env.local`)

Buat file `.env.local` di *root folder* proyek Anda dan masukkan kunci berikut. **Jangan pernah meng-commit file ini ke GitHub!**

```env
# NOTION KEYS
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# SUPABASE KEYS
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx

# SECURITY (Optional, untuk mengamankan API Sync dari trigger luar)
SYNC_API_SECRET=kata_sandi_rahasia_bebas
```

---

## 💻 Panduan Instalasi (Step-by-Step)

### Clone Repository
```bash
git clone https://github.com/username-anda/repo-dashboard.git
cd repo-dashboard
```

### Install Dependensi
```bash
npm install
# atau
yarn install
```

### Setup Database di Supabase
Buka menu SQL Editor di Supabase Anda dan jalankan query berikut untuk menyiapkan tabel yang dibutuhkan:

```sql
-- Tabel Utama Proyek
CREATE TABLE public.notion_projects (
    ticket VARCHAR PRIMARY KEY,
    project_name TEXT NOT NULL,
    last_status VARCHAR,
    milestone VARCHAR,
    created_time TIMESTAMPTZ,
    raw_data JSONB,
    cleansed_data JSONB,
    last_synced TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Log Perubahan
CREATE TABLE public.project_update_logs (
    id SERIAL PRIMARY KEY,
    ticket VARCHAR NOT NULL,
    project_name TEXT,
    field_changed VARCHAR NOT NULL,
    old_value TEXT,
    new_value TEXT,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Jalankan Aplikasi (Development)
```bash
npm run dev
```

Buka http://localhost:3000 di browser
