<div align="center">

# 🏛️ JanSahayk (जनसहायक)
### AI-Powered Public Grievance Resolution Platform for Smart Cities & Municipalities

[![JanSahayk CI](https://github.com/SDRRAUT/Jan_Sahayak/actions/workflows/ci.yml/badge.svg)](https://github.com/SDRRAUT/Jan_Sahayak/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0E5E3A.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express API](https://img.shields.io/badge/Express-5.2.1-000000.svg?logo=express&logoColor=white)](https://expressjs.com)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-10B981.svg)](#-how-to-run-locally)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<p align="center">
  <b>JanSahayk makes it effortless for everyday citizens to report problems in their own voice or language, and gives government officers intelligent tools to solve them quickly without drowning in paperwork.</b>
</p>

[The Problem](#-1-what-is-the-actual-problem) • [How We Solve It (USPs)](#-2-how-jansahayk-solves-it-our-core-ai-features--usps) • [Complaint Journey](#-3-the-step-by-step-complaint-journey) • [Try the Demo](#-4-try-it-in-2-minutes-pre-seeded-demo-logins) • [Under the Hood (AI)](#-5-how-the-ai-works-under-the-hood) • [Quickstart](#-6-how-to-run-locally-quickstart) • [Docker](#-7-run-with-docker) • [API Guide](#-8-api-endpoints-summary)

---

</div>

## 💡 Quick Summary (TL;DR)

Traditional government grievance portals are confusing, slow, and feel like black holes. Citizens don't know which department handles their problem, complaints get lost, and officers are overwhelmed by hundreds of duplicate tickets.

**JanSahayk solves this with intelligent AI:**
1. **Citizens speak or type in everyday language (Hindi, English, or Hinglish).**
2. **AI figures out what is wrong, which department handles it, and how urgent it is.**
3. **AI automatically detects duplicate complaints** and groups them together so officers only have to solve one big issue instead of 50 separate tickets.
4. **AI suggests exact past solutions (SOPs, required tools, and estimated repair times)** to help officers get the job done quickly.
5. **Live countdown timers & photo proof** ensure real accountability for every neighborhood.

---

## 🛑 1. What is the Actual Problem?

Every year, millions of citizens across Indian cities deal with broken roads, leaking water pipes, sewage overflows, and power outages. But when they try to complain, the system fails them in four major ways:

### 1. The Citizen's "Black Hole"
When you lodge a complaint on existing portals, you usually get an SMS with a reference number like `GRV-98214` and then... **total silence**. You don't know who is handling it, whether someone visited the spot, or when it will be fixed. Eventually, the ticket gets marked "Closed" without any explanation or proof.

### 2. The Language & Tech Barrier
Most portals force people to fill complex English forms with technical dropdown menus. Citizens are asked: *"Is this issue under PWD, MCD, or DJB?"* Most people don't know and shouldn't have to know! When people describe issues naturally in Hinglish (*"Bhai hamare gali mein pipeline phat gayi hai aur ganda paani supply mein aa raha hai"*), traditional systems fail to understand.

### 3. Officer Triage Overload (Drowning in Duplicates)
When a water pipeline bursts at a busy road junction, 60 different residents file complaints about the same spot. The field engineer receives 60 separate tickets, spends half the day reading and answering the same thing, and gets delayed in actually sending a repair team.

### 4. Temporary Fixes Instead of Permanent Solutions
A rusty water pipe in Sector 14 breaks 10 times in 3 months. Each time, workers put a quick rubber patch and close the ticket. Because the complaints are treated as isolated events, top officials never realize that the entire 35-year-old pipeline is decaying and needs complete replacement.

---

## ✨ 2. How JanSahayk Solves It (Our Core AI Features & USPs)

JanSahayk fixes every single one of these problems using practical, human-centered AI:

### 🎯 USP 1: File by Voice or Plain Hinglish (Speak Naturally)
Citizens don't need to learn government terminology. You can:
- Speak via **Voice Note** (AI transcribes in real time).
- Type in **Hindi, English, or mixed Hinglish**.
- Upload a photo and let GPS pinpoint the exact spot.

### 🎯 USP 2: Saral Mode (सरल मोड — For Non-Tech Users)
Built specifically for senior citizens and people who struggle with smartphones:
- Extra-large buttons and high-contrast visuals.
- Spoken audio instructions in simple Hindi/English.
- 1-click photo and voice submission without tedious typing.

### 🎯 USP 3: "We Understood You As..." (Instant AI Verification)
Before the complaint is submitted, the AI translates the text and clearly summarizes what it understood:
> *"We understood your issue as: Contaminated tap water mixed with sewage near Mother Dairy in Rohini Sector 14, affecting approximately 450 households. Is this correct?"*

This gives the citizen complete confidence that their voice was truly heard.

### 🎯 USP 4: Automatic Department Routing & Urgency Scoring
Our AI reads the description and automatically:
- Identifies the right department (e.g., Delhi Jal Board vs. PWD).
- Evaluates health and safety hazards (e.g., biological water contamination is automatically scored as **Critical Urgency**).
- Assigns the correct SLA deadline (e.g., 24-hour target for critical water hazards).

### 🎯 USP 5: Smart Duplicate Detection & Grouping
When multiple people report the same problem:
- AI detects that they are talking about the **same issue at the same location**.
- It groups them into a **Single Civic Incident Cluster**.
- **Human-in-the-Loop Safeguard**: The AI highlights duplicates, but an authorized government officer clicks to approve the merge.
- When the officer fixes the problem, **all 60 citizens receive resolution updates at the same moment**!

### 🎯 USP 6: Past Solution Recommendations (Municipal RAG)
When an engineer opens a ticket, they don't have to guess how to fix it. The AI checks historical records and suggests:
- *"Similar pipeline fracture happened 200m away last month."*
- **Recommended Equipment**: 200mm Cast-Iron Repair Clamp, Excavation Shovel, Water Pump.
- **Estimated Repair Time**: 4 hours.
- **Standard Operating Procedure (SOP)** step-by-step checklist.

### 🎯 USP 7: Live Ticking Countdown (SLA Clock) & Auto-Escalations
Every ticket has a public **live countdown timer** (e.g., *"16 hours remaining"*). If an issue is ignored, it turns red and automatically escalates to senior officers (Superintending Engineer or District Magistrate).

### 🎯 USP 8: Mandatory Photo Proof & 5-Star Citizen Rating
An officer cannot just click "Resolved" and walk away.
- The officer **must upload a photo of the completed repair**.
- The citizen receives an instant alert, views the photo, and gives a **1 to 5 star rating**.
- If the work was poor, the citizen can click **"Reopen Dispute"** with one tap.

### 🎯 USP 9: Civic Memory & Chronic Problem Detection
Our system connects the dots over time:
- It notices if a specific ward has had 18 pipe bursts in 6 months.
- It flags this as a **Chronic Infrastructure Hazard** on the Super Admin GIS map.
- Instead of paying for 50 temporary repairs, the city can allocate budget to replace the entire pipeline once and for all.

---

## 🔄 3. The Step-by-Step Complaint Journey

Here is how a complaint travels from a citizen's phone to a permanent fix:

```
[ Citizen Files Complaint ]
(Speaks in Hinglish / takes photo / shares GPS)
               ↓
[ AI Understanding & Translation ]
(Detects language, extracts landmark, and verifies meaning with citizen)
               ↓
[ Smart Triage & Duplicate Check ]
(Routes to right department, scores urgency, and checks if neighbors reported it)
               ↓
[ Field Officer Receives Ticket ]
(Sees AI suggestions: past fixes, required tools, and SOP checklist)
               ↓
[ Work in Progress & Photo Proof ]
(Team fixes the issue and uploads photo of the completed repair)
               ↓
[ Citizen Confirmation & 5-Star Feedback ]
(Citizen inspects the photo, rates the work, or appeals if unsatisfied)
               ↓
[ Long-Term Civic Memory ]
(If issues keep happening in the same ward, city leadership is alerted)
```

---

## 👥 4. Try It in 2 Minutes (Pre-Seeded Demo Logins)

JanSahayk comes with pre-configured demo personas. You can switch between them with **1 click** in the top navigation bar or log in using these credentials:

| Persona | Name & Title | Email | Password | What You Can Do in This Role |
| :--- | :--- | :--- | :--- | :--- |
| 👤 **Citizen** | Aditya Verma | `aditya@citizen.in` | `citizen123` | File complaints by voice/Hinglish, use Saral Mode, track live resolution timeline, and submit ratings. |
| 🛠 **Field Officer** | Er. Sanjay Sharma *(AEE, Delhi Jal Board)* | `sanjay.sharma@djb.gov.in` | `officer123` | Review tickets, accept/modify AI past solutions, merge duplicate tickets, and upload photo proof. |
| 🏛 **Department Admin** | Er. Rajiv Malhotra *(Chief Engineer)* | `admin.djb@delhi.gov.in` | `deptadmin123` | Monitor overall department queue, check 94.8% SLA compliance, manage officers, and export reports (PDF/CSV). |
| 🛡 **Super Admin** | Dr. Meenakshi Sundaram, IAS *(Principal Secretary)* | `superadmin@delhi.gov.in` | `superadmin123` | View Delhi-wide GIS heatmaps, audit tamper-proof system logs, and inspect chronic infrastructure hotspots. |

---

## 🧠 5. How the AI Works Under the Hood

The intelligence backend uses **5 cooperating AI agents** (found in `server/agents/`):

```
       [ Citizen Input ]
              │
              ▼
┌───────────────────────────────┐
│ 1. ComplaintAnalyzerAgent     │ ── Translates Hinglish/Hindi, extracts landmarks & urgency
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 2. SimilarityClusterAgent     │ ── Checks spatial radius (300m) & flags duplicate tickets
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 3. HistoricalPrecedentRAG     │ ── Finds past similar fixes, SOPs, and required tools
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 4. CivicIncidentAgent         │ ── Groups multiple complaints into 1 unified incident
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 5. CivicMemoryAgent           │ ── Identifies chronic neighborhood decay & aging assets
└───────────────────────────────┘
```

### Simple Overview of Each Agent:
1. **The Reader & Translator (`ComplaintAnalyzerAgent`)**: Understands everyday spoken Hindi/English, finds key facts (like *"Mother Dairy"* or *"450 homes affected"*), and calculates urgency.
2. **The Duplicate Finder (`SimilarityClusterAgent`)**: Checks if another complaint was filed nearby within the last 72 hours so officers don't do double work.
3. **The Municipal Expert (`HistoricalPrecedentRAG`)**: An AI assistant that remembers previous city repairs and tells the engineer what equipment to pack.
4. **The Incident Grouper (`CivicIncidentAgent`)**: Combines 50 individual reports into one master incident for the field squad.
5. **The Memory Keeper (`CivicMemoryAgent`)**: Keeps long-term institutional memory so repeated breakdowns trigger permanent upgrades instead of temporary band-aids.

---

## 💻 6. How to Run Locally (Quickstart)

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/SDRRAUT/Jan_Sahayak.git
cd Jan_Sahayak
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment File
```bash
cp .env.example .env
```
*(Runs 100% locally out of the box with embedded AI heuristics — no paid API keys required!)*

### Step 4: Start the Application
Run our 1-step integrated startup script:
```bash
npm start
```
This automatically starts:
- 📡 **Backend API Server**: running on `http://localhost:3001`
- ⚡ **Frontend Web Application**: running on `http://localhost:3737` (or `http://localhost:3000`)

### Step 5: Verify the Build
```bash
npm run build
```
Creates a clean, production-ready static bundle in `dist/`.

---

## 🐳 7. Run with Docker

You can run the entire platform with a single command using Docker:

```bash
# Build and start container in the background
docker compose up -d --build

# Check status
docker compose ps
```
Open **`http://localhost:3001`** in your browser to view the live platform!

---

## 📡 8. API Endpoints Summary

| Type | Method & URL | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **Health** | `GET /api/health` | Public | Check if the system is running and healthy. |
| **Auth** | `POST /api/auth/login` | Public | Log in with email and password to receive a session token. |
| **Auth** | `GET /api/auth/me` | Logged In | Get profile info for the currently logged-in user. |
| **Grievances** | `GET /api/grievances` | Role-filtered | View all complaints (citizens see their ward, officers see their dept). |
| **Grievances** | `POST /api/grievances` | Citizen | Submit a new complaint to be triaged by the AI mesh. |
| **Grievances** | `PATCH /api/grievances/:id/status` | Officer / Admin | Move status (e.g. from *Triaged* to *In Progress* to *Resolved*). |
| **Grievances** | `POST /api/grievances/:id/duplicate-action` | Officer | Approve or dismiss a suggested duplicate candidate. |
| **Grievances** | `POST /api/grievances/:id/feedback` | Citizen | Submit 1 to 5 star rating and feedback after repair. |
| **Intelligence**| `GET /api/intelligence/clusters` | Officer / Admin | View active geographic clusters of related complaints. |
| **Intelligence**| `GET /api/intelligence/memory` | Officer / Admin | View chronic infrastructure hotspot memory for wards. |
| **Security** | `GET /api/admin/audit-logs` | Super Admin | View tamper-proof logs of every action taken in the system. |

---

## 📁 9. Project Files & Folders

```text
Jan_Sahayak/
├── server/
│   ├── agents/            # The 5 AI agents (Analyzer, Clusterer, RAG, Incidents, Memory)
│   ├── data/              # Pre-seeded municipal data & historical records
│   ├── db/                # In-memory database with persistent backup
│   └── index.js           # Express API server + static file hosting
├── src/
│   ├── components/        # Reusable UI components (Cards, Modals, Navbar, Footer)
│   ├── context/           # App state & 1-click persona logins
│   ├── pages/             # All platform screens (Citizen, Officer, Admin, Intelligence)
│   ├── services/          # Client-side AI helpers
│   ├── App.jsx            # Main route manager
│   └── index.css          # Design tokens, typography & styling
├── public/                # Logo, favicon, and citizen banners
├── .github/workflows/     # Automated testing & build pipeline (CI)
├── Dockerfile             # Container configuration
├── docker-compose.yml     # 1-command container launcher
├── CONTRIBUTING.md        # How to contribute to this project
├── SECURITY.md            # Security & data privacy policies
└── package.json           # Dependencies and run scripts
```

---

## 🛡️ 10. Security & Privacy Highlights

- **Privacy First (PII Masking)**: Citizen phone numbers and private addresses are automatically masked so field staff only see what is needed for repair.
- **Strict Role Permissions**: Citizens cannot view other citizens' private data, and officers can only manage issues inside their assigned jurisdiction.
- **Tamper-Proof Audit Trail**: Every status change, ticket merge, or SLA adjustment is recorded in an immutable log with timestamps and actor names.

---

## 🤝 11. Contributing & Community

We welcome contributions from civic technologists, students, and open-source developers!
- Review our [Contributing Guidelines](CONTRIBUTING.md) to get started.
- Check our [Code of Conduct](CODE_OF_CONDUCT.md).
- Report security issues following our [Security Policy](SECURITY.md).

---

## 📄 12. License

JanSahayk is distributed under the **[MIT License](LICENSE)**.  
*Built with pride for Indian Municipalities, Public Utility Boards, and Citizen Empowerment.*
