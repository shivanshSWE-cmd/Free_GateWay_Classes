# 🎓 AKTU B.Tech Notes Store (Full-Stack Gateway Classes Clone)

A complete, production-ready full-stack clone of the **[AKTU BTech Notes Store - Gateway Classes](https://getwayclassesnotes.netlify.app/)**. 

Includes **all original data** (handwritten notes, one-shot revision units, lecture notes, video playlists, MultiAtoms notes, and 1,961+ solved AKTU PYQ question papers), a **high-speed Express REST API backend** with disk-cached PDF streaming proxy, and a **classic Black & White UI** matching Gateway Classes official style with global fuzzy instant search (`Ctrl+K`), in-page responsive video player, and built-in PDF viewers.

---

## ⚡ Key Highlights & Features

- **Complete Data Extraction & Modern JSON Store**:
  - **1st Year**: 13 Subjects • 182 Notes (Maths 1 & 2, Physics, Chemistry, BEE, PPS, Electronics, EVS).
  - **2nd Year**: 15 Subjects • 881 Notes (Maths 4, COA, DSA, DSTL, TAFL, Java, Python, TC, etc.).
  - **3rd Year**: 34 Subjects • 323 Notes (Web Tech, DBMS, DAA, ML, Compiler Design, COI, etc.).
  - **4th Year**: 20 Subjects • 127 Notes (AI, Cloud Computing, Blockchain, IoT, Deep Learning, etc.).
  - **MultiAtoms Hubs**: 2nd, 3rd, and 4th Year dedicated MultiAtoms notes with direct Google Drive / Mediafire links.
  - **Video Lectures Hub**: **28 Core AKTU Courses** with Unit-wise One-Shot revision videos, marathon sessions, and full YouTube playlists by **AH Tutorials** (@AHTUTORIALS2024) and **MultiAtoms**.
  - **AKTU PYQ Bank**: 1,961+ official AKTU previous year university end-semester papers covering **all 8 semesters** with instant branch/semester filtering.
- **Global Instant Search (`Ctrl+K`)**:
  - Live search across **3,757+ indexed educational entities** (notes, units, subjects, courses, question papers).
  - Instant dropdown results with badges for each year and direct links.
- **Backend PDF Streaming Proxy & Disk Cache**:
  - Endpoints `/pyq-download/:id/:nonce` and `/.netlify/functions/download` stream papers seamlessly.
  - Automatically caches requested PDFs on disk in `server/cache/pdfs/`, ensuring subsequent views are instantaneous and work offline!
- **Dual PDF Viewing Modes**:
  - Built-in interactive modal viewer with PDF.js on the PYQ page.
  - Standalone dedicated viewer (`/viewer.html`) with page zoom, navigation, and one-click direct download.
- **Clean & Ad-Free Experience**:
  - Removed disruptive popups and aggressive third-party ad networks.
  - Right-click and context menu enabled for smooth study note saving and bookmarking.

---

## 📂 Project Architecture

```
aktu-notes-store/
├── data/                             # Extracted & structured JSON database
│   ├── year1.json                    # 1st Year subjects & units (182 notes)
│   ├── year2.json                    # 2nd Year subjects & lecture ranges (881 notes)
│   ├── year3.json                    # 3rd Year subjects (323 notes)
│   ├── year4_other.json              # 4th Year subjects (127 notes)
│   ├── multiatom_year2.json          # MultiAtoms 2nd Year
│   ├── multiatom_year3.json          # MultiAtoms 3rd Year
│   ├── multiatom_year4.json          # MultiAtoms 4th Year
│   ├── lectures.json                 # Video courses and playlists
│   ├── pyq_bank.json                 # 1,961+ official AKTU question papers
│   ├── search_index.json             # 3,615 global searchable entities
│   └── portals.json                  # Categories metadata & summary
│
├── public/                           # Frontend assets (Static & SPA)
│   ├── index.html                    # Cyberpunk home portal with matrix canvas & search
│   ├── 1year.html                    # 1st Year Gateway notes
│   ├── 2ndyear.html                  # 2nd Year Gateway notes
│   ├── 3year.html                    # 3rd Year Gateway notes
│   ├── 4year.html                    # 4th Year Gateway notes
│   ├── multiatom.html                # MultiAtoms 2nd Year
│   ├── 3year-multiatom.html          # MultiAtoms 3rd Year
│   ├── 4year-multiatom.html          # MultiAtoms 4th Year
│   ├── lectindex.html                # Video lectures player hub
│   ├── under.html                    # PYQ Bank (1,961 papers) with modal viewer
│   ├── viewer.html                   # Dedicated standalone PDF viewer
│   ├── api-docs.html                 # Interactive REST API explorer
│   ├── css/
│   │   ├── gwc-ui.css                # Base portal styles
│   │   ├── year4-hub.css             # 4th Year portal styles
│   │   └── global-search.css         # Search bar, shortcuts, & API nav styles
│   └── js/
│       ├── global-search.js          # Live search with Ctrl+K shortcut & debouncing
│       ├── pdf.min.js                # PDF.js library for in-browser PDF rendering
│       ├── pdf.worker.min.js         # PDF.js Web Worker
│       ├── year4-data.js             # 4th Year client dataset
│       ├── year4-hub.js              # 4th Year filtering & accordion logic
│       └── site-ads.js               # Clean ad-free shim
│
├── server/
│   ├── server.js                     # Express REST API, PDF proxy & static router
│   └── cache/
│       └── pdfs/                     # Auto-cached question paper PDFs
│
├── scripts/
│   ├── extract_all_data.js           # Re-extract and normalize JSON data
│   ├── prepare_public.js             # Clean and populate public assets
│   └── test_server.py                # Comprehensive automated verification suite
│
├── raw_data/                         # Original downloaded raw source pages
├── package.json                      # Node.js dependencies & scripts
└── README.md                         # Documentation
```

---

## 🚀 Quickstart Guide

### 1. Requirements
- **Node.js**: v18.0.0 or higher (v24.x recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Clone or navigate to the project directory:
```bash
cd "d:\Github projects\aktu-notes-store"
npm install
```

### 3. Run the Server
Start the production server:
```bash
npm start
```
Or start in development watch mode:
```bash
npm run dev
```

Visit the application in your browser:
- **Main Portal**: [http://localhost:3000](http://localhost:3000)
- **AKTU PYQ Bank**: [http://localhost:3000/under](http://localhost:3000/under)
- **Interactive API Docs**: [http://localhost:3000/api-docs.html](http://localhost:3000/api-docs.html)

---

## 📡 REST API Reference

The backend provides a complete set of REST endpoints for frontend integration, custom client apps, or third-party bots:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server uptime, status, and database metrics |
| `GET` | `/api/portals` | All portals metadata, subject counts, and icons |
| `GET` | `/api/notes/:category` | Notes for `1year`, `2ndyear`, `3year`, `4year`, `multiatom`, etc. |
| `GET` | `/api/lectures` | Course playlists and unit lecture video URLs |
| `GET` | `/api/pyq` | Query papers with filters: `?sem=1`, `?code=BAS101`, `?search=physics`, `?limit=50` |
| `GET` | `/api/search` | Global instant search: `?q=maths&limit=20` across all 3,600+ items |
| `GET` | `/pyq-download/:id/:nonce` | PDF streaming proxy with disk cache in `server/cache/pdfs/` |

### Sample cURL Queries

**Search for Artificial Intelligence notes:**
```bash
curl "http://localhost:3000/api/search?q=artificial+intelligence&limit=5"
```

**Filter 1st Semester PYQs:**
```bash
curl "http://localhost:3000/api/pyq?sem=1&limit=5"
```

**Download / Stream a Paper:**
```bash
curl "http://localhost:3000/pyq-download/18692/fa1ad34acd?code=BAS101&title=Engineering_Physics" -o physics.pdf
```

---

## 🛠️ Re-extracting or Updating Data

If you modify or update the raw files, regenerate the JSON database and public directory at any time:
```bash
npm run extract
```

Run the automated test suite to ensure all endpoints and frontend routes pass:
```bash
python scripts/test_server.py
```

---

## 🌐 Deployment Options

1. **Full-Stack Deployment (Render / Railway / DigitalOcean / VPS)**:
   - Run `npm start` directly on port `3000` (or `PORT` environment variable).
2. **Static Web Hosting (Netlify / Vercel / GitHub Pages)**:
   - The contents of `public/` and `data/` can also be deployed directly as a static website.
   - For paper downloads on static hosting, requests will automatically fallback to the upstream Netlify serverless function.

---

## 📜 License & Credits
- **UI Design & Study Notes**: Original material maintained by **Gateway Classes & Shivansh (@ShivanshSWE-cmd, Instagram: @Shiva._SWE)**.
- **Cloned & Modernized by**: Shivansh with high-performance Express backend, REST API, disk caching, and global search.
