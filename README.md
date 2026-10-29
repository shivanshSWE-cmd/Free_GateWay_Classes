# 🎓 AKTU B.Tech Notes Store (Gateway Classes Hub)

[![Live Website](https://img.shields.io/badge/Live%20Website-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/)
[![Maintained by Shivansh](https://img.shields.io/badge/Maintained%20by-Shivansh-f59e0b?style=for-the-badge&logo=instagram)](https://instagram.com/Shiva._SWE)
[![GitHub](https://img.shields.io/badge/GitHub-@ShivanshSWE--cmd-181717?style=for-the-badge&logo=github)](https://github.com/ShivanshSWE-cmd)

> 🚀 **Live Production Link**: **[https://shivanshswe-cmd.github.io/Free_GateWay_Classes/](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/)**

A complete, production-ready full-stack educational web application and Android APK hub for **AKTU (Dr. A.P.J. Abdul Kalam Technical University) B.Tech Students**.

Includes all handwritten notes, one-shot revision video playlists, lecture series, MultiAtoms quantum notes, solved PYQ question papers, and student study progress tracker.

---

## 🌐 Live Pages Quick Access

| Year / Category | Live URL | Total Resources |
| :--- | :--- | :--- |
| 🏠 **Home Portal** | [Open Portal](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/) | All 4 Years & PYQ Bank |
| 📘 **1st Year Notes** | [Open 1st Year](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/1year.html) | 182 Notes (Maths 1 & 2, Physics, Chemistry, BEE, PPS, EVS, etc.) |
| 📗 **2nd Year Notes** | [Open 2nd Year](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/2year.html) | 881 Notes & Zips (COA, DSA, DSTL, Maths 4, Java, Python, OS, TAFL) |
| 📙 **3rd Year Notes** | [Open 3rd Year](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/3year.html) | 304 Notes (DAA, DBMS, Web Tech, Compiler, Networks, ML, SE) |
| 📕 **4th Year Notes** | [Open 4th Year](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/4year.html) | Final Year (AI, Cloud, Blockchain, IoT, Deep Learning, CNS) |
| ⚛️ **MultiAtoms Notes** | [Open MultiAtoms](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/multiatom.html) | MultiAtoms Quantum Units & One-Shots |
| 🎬 **Video Lectures Hub** | [Open Video Hub](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/lectindex.html) | **All 46 Courses across 8 Semesters** (Gateway Classes, AH Tutorials, MultiAtoms) |
| 📝 **AKTU PYQ Bank** | [Open PYQ Bank](https://shivanshswe-cmd.github.io/Free_GateWay_Classes/under.html) | 1,960+ University End-Sem Question Papers |

---

## ⚡ Key Highlights & Features

- **All 3 Video Channels for All 4 Years & 8 Semesters**:
  - **Gateway Classes** (@GatewayClasses)
  - **AH Tutorials** (@AHTUTORIALS2024)
  - **MultiAtoms** (@MultiAtoms)
  - Every course across all 8 semesters includes unit-wise one-shots, marathons, and full playlists from all 3 educational providers.
- **Student Study Progress Tracker**:
  - Interactive unit completion checkmarks persisted in `localStorage`.
  - Floating tracker pill with real-time counter and progress dashboard.
- **Classic Gateway Classes Theme**:
  - Clean obsidian dark (`#070b14`), crisp white, and golden amber (`#f59e0b`) official palette.
  - 100% responsive on all mobile, tablet, and desktop screens with zero clipping.
- **Fast Question Paper Access**:
  - Instant branch/semester filtering and verified search download fallbacks so students never encounter dead download links.
- **Android APK Ready**:
  - Built with Capacitor with seamless intent handling for local and offline mobile usage.

---

## 🛠️ Project Structure

```
aktu-notes-store/
├── public/                 # Production static web assets
│   ├── index.html          # Gateway Classes home portal
│   ├── 1year.html          # 1st Year notes hub (alias: 1styear.html)
│   ├── 2ndyear.html        # 2nd Year notes hub (alias: 2year.html)
│   ├── 3year.html          # 3rd Year notes hub (alias: 3rdyear.html)
│   ├── 4year.html          # 4th Year notes hub (alias: 4thyear.html)
│   ├── multiatom.html      # MultiAtoms notes hub
│   ├── lectindex.html      # 8-Semester, 3-Channel Video Lectures hub
│   ├── under.html          # AKTU PYQ Question Papers repository
│   ├── viewer.html         # Interactive PDF viewer
│   ├── gwc-ui.css          # Core obsidian & gold stylesheet
│   └── js/
│       └── student-tracker.js # Safe study tracker & APK modal
├── data/                   # Structured JSON data stores
│   ├── lectures.json       # All 46 courses with all 3 channel playlists
│   ├── pyq_bank.json       # 1,960+ question papers dataset
│   └── search_index.json   # Offline search index
├── server/                 # Optional Express REST API & proxy backend
└── scripts/                # Generators and deployment automation
```

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Creator & Maintainer

- **Developer / Maintainer**: **Shivansh**
- **Instagram**: [@Shiva._SWE](https://instagram.com/Shiva._SWE)
- **GitHub**: [@ShivanshSWE-cmd](https://github.com/ShivanshSWE-cmd)
