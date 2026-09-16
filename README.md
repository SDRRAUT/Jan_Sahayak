# JanSahayk (जनसहायक) — AI-Powered Public Grievance Analysis & Resolution Recommendation Platform

> **Track AI-04 — Hack2Ignite Production Build**  
> *Transforming public grievance redressal from a bureaucratic dead-end into a transparent, closed-loop civic intelligence system.*

---

## 🏛️ 1. Executive Summary & Vision

**JanSahayk (जनसहायक)** is an enterprise-grade civic technology web platform designed for municipal governments, public utility boards, and citizens across India.

Traditional government grievance portals suffer from severe failure modes:
1. **The Citizen Black Hole**: Complaints disappear without clear acknowledgement, classification, or human accountability.
2. **Linguistic Barriers**: Millions of citizens explain problems in colloquial Indic dialects, mixed Hinglish, or voice notes that fail rigid form-based dropdowns.
3. **Officer Triage Overload**: Municipal field officers are buried under thousands of repetitive, duplicate, or misrouted tickets without actionable decision support.
4. **Siloed Recurrence**: The same water pipeline breaks 18 times in Rohini Sector 14, but each ticket is closed as an isolated incident instead of diagnosing the systemic infrastructure failure.

**JanSahayk breaks this paradigm** by connecting individual citizen voice inputs to high-precision Indic NLP, historical case intelligence (RAG), automated SLA tracking, supervised human-in-the-loop triage, and systemic geographic hotspot detection.

---

## 🔄 2. The 14-Stage Closed Intelligence Loop

The platform enforces a continuous feedback cycle:

```
[Citizen Submission: Voice / Text / Photo / GPS]
                      ↓
  [AI Understanding: Indic NLP / Entity Extraction]
                      ↓
 ["We understood your issue as..." Citizen Review & Confirmation]
                      ↓
 [Department Routing & Severity / Priority Prediction]
                      ↓
 [4-Way Duplicate Candidate Classification & Clustering]
                      ↓
   [Historical Precedent Retrieval (Municipal RAG)]
                      ↓
 [Resolution Recommendation with SOPs & Equipment Lists]
                      ↓
 [Officer Decision Support: Accept / Modify / Reject]
                      ↓
 [Field Work Order Execution & Photo Evidence Upload]
                      ↓
        [Citizen Notification & Verification]
                      ↓
 [5-Star Citizen Feedback & Dissatisfaction Dispute Appeal]
                      ↓
 [Department Analytics & Workload Distribution]
                      ↓
 [Systemic Recurring Issue & Ward Hotspot Discovery]
                      ↓
    [Preventative Infrastructure Intervention]
```

---

## 👥 3. User Roles & Pre-Seeded 1-Click Credentials

For instant hackathon demonstration, the platform includes a **1-Click Persona Switcher** in the sticky navigation header:

| Role | Name | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Aditya Verma | `aditya@citizen.in` | `citizen123` | Multimodal complaint filing, Indic review, timeline tracking, information clarification, dispute appeal, feedback rating. |
| **Government Officer** | Er. Sanjay Sharma | `sanjay.sharma@djb.gov.in` | `officer123` | Case triage, verbatim Hindi/Hinglish review, duplicate verification, RAG SOP inspection, resolution recommendation, evidence upload. |
| **Department Admin** | Er. Rajiv Malhotra | `admin.djb@delhi.gov.in` | `deptadmin123` | Queue health monitoring, 94.8% SLA compliance auditing, officer workload roster, recurring hotspots, municipal PDF/CSV export. |
| **Super Admin** | Dr. Meenakshi Sundaram, IAS | `superadmin@delhi.gov.in` | `superadmin123` | Municipal department directory, platform user management, SLA rule editor, cryptographic audit trail, AI configuration sliders. |

---

## 🧠 4. AI Engine & Core Differentiators

The AI service layer (`src/services/aiEngine.js`) encapsulates **20 distinct capabilities**:

1. **Indic Language Detection**: Accurately classifies English, Hindi (Devanagari), and mixed Hinglish inputs.
2. **Colloquial Hinglish Translation**: Automatically produces high-accuracy English translations for administrative staff while preserving the citizen's original verbatim text.
3. **Structured Summary (*"We understood your issue as..."*)**: Synthesizes unstructured citizen descriptions into concise, clear core summaries.
4. **Missing Information Suggestions**: Detects missing landmark details, house numbers, or evidence photos before submission.
5. **Entity & Infrastructure Extraction**: Extracts landmarks, pipe dimensions, electrical feeder lines, and estimated household impact.
6. **Sentiment & Distress Scoring**: Calibrates urgency from biological contamination hazards or safety risks.
7. **Department Routing**: Routes complaints to DJB, PWD, MCD, or BSES with confidence scoring.
8. **4-Way Duplicate Candidate Classification**:
   - **`Likely Duplicate`**: Same failure, same location, reported by multiple independent citizens.
   - **`Related Complaint`**: Downstream symptom of an upstream failure (e.g. low pressure 2 streets away).
   - **`Similar Complaint`**: Same category and issue type in another sector or ward.
   - **`Unrelated`**: Independent problem occurring concurrently.
9. **Strict Human-in-the-Loop Mandate**: AI classifies candidates, but **only authorized officers** can merge, link, or dismiss duplicate tickets.
10. **Municipal RAG (Retrieval-Augmented Precedents)**: Matches incoming grievances against historical municipal cases with verified resolution times, equipment lists, and SOPs.
11. **SLA Intelligence & Real-Time Countdown**: Tracks SLA target, elapsed time, remaining hours, urgency, and auto-escalation thresholds (`ON_TRACK`, `AT_RISK`, `OVERDUE`).
12. **Systemic Hotspot Detection**: Groups spatial and temporal complaint frequencies to surface root-cause infrastructure decay (e.g. 1988 cast-iron pipeline degradation).
13. **Saral Mode (सरल मोड)**: Audio-first, high-contrast, simplified layout with bilingual guidance designed for citizens with low digital literacy.
14. **Fallback AI Resilience**: Embedded `local_indic_bert` heuristics ensure 100% functionality even when external AI API keys are unavailable.

---

## 🎨 5. UI/UX Design Language: *The Luminary Architecture*

Built strictly in accordance with `website-ui-ux.md`:

- **Typography**: 
  - Display Serifs: *Fraunces* for civic prestige and trust.
  - Body Sans: *Plus Jakarta Sans* for modern administrative clarity.
  - Telemetry Monospace: *JetBrains Mono* for ticket codes, coordinates, and audit hashes.
- **Color Palette**:
  - Primary Canvas: Bone-White (`#F8F9FA`)
  - Deep Telemetry: Obsidian Forest (`#0B1914`)
  - Primary Civic Accent: Deep Imperial Emerald (`#0E5E3A`)
  - Status Indicators: Ruby Coral (`#DC2626`), Amber Sun (`#F59E0B`), Emerald Leaf (`#10B981`)
- **Navigation**: Floating pill dock with glassmorphism blur (`backdrop-filter: blur(20px)`), responsive hamburger menu for mobile, and built-in notification bell popover.

---

## 💻 6. Technology Stack

- **Frontend**: React 18, React Router v6, Lucide React icons, Vanilla CSS tokens.
- **Backend API**: Node.js, Express, CORS, JSON REST endpoints.
- **Session & Security**: JWT-style bearer tokens, role-based access control (RBAC), and server-side route guards.
- **Storage**: In-memory relational state engine synchronized to browser `localStorage` and Express database stores.
- **Dev Tooling**: Vite with Hot Module Replacement (HMR).

---

## 🚀 7. Quickstart & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/your-repo/jansahayk.git
cd jansahayk
npm install
```

### Step 2: Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
*(Default settings run completely offline without needing external API keys!)*

### Step 3: Run the Application
Open two terminal windows:

**Terminal 1 — Backend API Server:**
```bash
node server/index.js
```
*API runs on `http://localhost:3001`.*

**Terminal 2 — Frontend Dev Server:**
```bash
npm run dev
```
*Web application opens on `http://localhost:3000`.*

### Step 4: Production Build
```bash
npm run build
```
Generates an optimized bundle in `dist/`.

---

## 🧪 8. Complete Hackathon Demonstration Walkthrough

Follow this scripted 10-minute demonstration flow:

1. **Visit Landing Page (`/`)**: Inspect the civic hero banner, live telemetry ticker (148,920 processed cases), and core differentiators.
2. **Citizen Submission Flow (`/citizen/submit`)**:
   - Switch to **Citizen** persona.
   - Click **Quick Fill Hinglish Contamination** to populate a real Rohini Sector 14 water complaint.
   - Toggle **Saral Mode (सरल मोड)** to show audio-first accessibility.
   - Click **Proceed to AI Understanding**.
   - Review Step 2 Modal: Verify the AI extracted Hinglish translation, entities (Mother Dairy, 450 households), and generated *"We understood your issue as..."*.
   - Click **Confirm & Submit Grievance**.
3. **Citizen Detail & Timeline (`/citizen/:id`)**:
   - Inspect the live 9-stage resolution workflow and status indicator.
   - View officer clarifications, SLA remaining countdown, and 5-star rating submission.
4. **Officer Triage Workspace (`/officer`)**:
   - Switch to **Officer** persona.
   - Open ticket `DL-2026-W14-0892`.
   - Inspect the **4-Way Duplicate Candidate Classifier** with human authorization buttons (`Merge as Duplicate`, `Link as Related`, `Mark Independent`).
   - Review **Historical RAG Precedents** and **Resolution Recommendations** (`Accept`, `Modify`, `Reject`).
   - Progress the grievance through the **Formal Status Transition Modal** (`In Progress` → `Resolved`).
5. **Notification Hub (Navbar Bell)**:
   - Click the Bell icon in the top header to view real-time dispatched notifications (Dispatches, SLA warnings, AI triage completions).
6. **Department Admin Console (`/admin/department`)**:
   - Switch to **Dept Admin**.
   - Review live department queue, dynamic citizen satisfaction (4.8/5.0), and officer roster.
   - Click **Export Municipal Report (PDF/CSV)**.
7. **Super Admin Command Console (`/admin/super`)**:
   - Switch to **Super Admin**.
   - Audit immutable system logs with cryptographic target hashes.
   - Adjust SLA threshold rules and AI model weights.
8. **Ward Heatmap Intelligence (`/admin`)**:
   - Inspect the geospatial interactive ward map highlighting high-severity biological hazard clusters across Delhi NCT.

---

## 🔒 9. Security & Governance

- **Server-Side Authorization**: Every protected API route enforces `authenticateToken` and `requireRole(['officer', 'dept_admin', 'super_admin'])`.
- **Untrusted Input Sanitization**: All citizen-submitted text, audio notes, and attachments are treated as untrusted inputs.
- **Audit Trails**: Critical municipal events (triage, duplicate authorization, escalations, closures, SLA modifications) are stored in an append-only audit register.
- **Privacy First**: Sensitive citizen telephone numbers and addresses are masked in public and officer views.

---

## 📄 10. License

JanSahayk is released under the **MIT License** for open civic innovation.
Developed with pride for Indian Municipalities and Civic Governance.
