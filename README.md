<div align="center">

# 🏛️ JanSahayk (जनसहायक)
### Autonomous AI-Powered Civic Intelligence & Public Grievance Resolution Platform

[![JanSahayk CI](https://github.com/SDRRAUT/Jan_Sahayak/actions/workflows/ci.yml/badge.svg)](https://github.com/SDRRAUT/Jan_Sahayak/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0E5E3A.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express API](https://img.shields.io/badge/Express-5.2.1-000000.svg?logo=express&logoColor=white)](https://expressjs.com)
[![Database: Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![GIS: PostGIS](https://img.shields.io/badge/GIS-PostGIS-336791.svg?logo=postgresql&logoColor=white)](https://postgis.net)
[![Vector: pgvector](https://img.shields.io/badge/Vector-pgvector%20768d-4169E1.svg)](https://github.com/pgvector/pgvector)
[![LLM: Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Flash-8E75B2.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-10B981.svg)](#-how-to-run-locally-quickstart)

<p align="center">
  <b>One Single Source of Truth for Municipal Governance.</b><br/>
  JanSahayk unifies <b>Citizens</b>, <b>Civic Officers</b>, and <b>Super Admins</b> into one interconnected, real-time civic ecosystem powered by an 8-Agent AI mesh, PostGIS geospatial intelligence, and pgvector semantic retrieval.
</p>

[10 Unique Points](#-10-unique-special-points--what-makes-jansahayk-different) • [Core Architecture](#-1-core-architecture--one-source-of-truth) • [8-Agent AI Mesh](#-2-multi-agent-ai-pipeline-under-the-hood) • [Canonical Status & Events](#-3-canonical-state--real-time-event-model) • [Key Features](#-4-features-by-role) • [Tech Stack](#-5-complete-technology-stack) • [Quickstart](#-6-how-to-run-locally-quickstart) • [Validation & Tests](#-7-validation--automated-testing) • [API Guide](#-8-api-endpoints-reference)

---

</div>

## 💡 What Makes JanSahayk Revolutionary?

Traditional civic complaint systems treat citizen reports as isolated, text-only tickets dumped into departmental silos. Citizens face a "black hole", officers drown in hundreds of duplicates for the same burst pipe, and leadership lacks root-cause visibility.

**JanSahayk solves this end-to-end:**
1. **Multimodal Citizen Intake**: Voice input in natural Indic languages (Hindi, Hinglish, English), photo upload, and instant GPS geolocation.
2. **Autonomous Multi-Agent AI Pipeline**: 8 cooperative agents extract Complaint DNA, compute 768-dim embeddings, cluster reports spatially and semantically, synthesize high-level **Civic Incidents**, diagnose root causes, and prescribe Standard Operating Procedures (SOPs).
3. **One Authoritative Truth**: The database is the single source of truth (`public.grievances`, `public.civic_incidents`, `public.field_actions`, `public.verification_records`). Zero fake state, zero role-specific duplicates.
4. **Real-Time Cross-Role Sync**: When an officer uploads field remediation evidence, the citizen's verification modal and the Super Admin's city dashboard update in real time via WebSockets and Server-Sent Events (SSE).
5. **Closed-Loop Verification**: A complaint is never closed until the citizen verifies the repair with photo proof, rating, or disputes it back into the investigation queue.

---

## 🌟 10 Unique Special Points — What Makes JanSahayk Different?

### 1. 🧬 **Grievance DNA™ — Complete Intelligence Fingerprint**
Har complaint ka ek structured profile: category, department, location, urgency, affected people, history, duplicates, recommendation — sab ek jagah.
> **Why unique:** CPGRAMS aur traditional state portals complaint ko sirf raw text ki tarah store karte hain. Hum use ek complete **"intelligence document"** banate hain.

---

### 2. 🔄 **Duplicate Fusion Engine — 50 Complaints = 1 Action**
Semantic similarity (`pgvector`) + GPS proximity (`PostGIS`) + time window se same issue ki multiple complaints ko ek cohesive **Civic Incident** mein merge karta hai, aur automatically priority badha deta hai.
> **Why unique:** Existing portals mein duplicate detection nahi hai — officer ek hi pothole ya water leak ki 50 complaints alag-alag padh ke confuse hota hai.

---

### 3. 💡 **Resolution Recommendation (RAG-based) — Sirf Forward Nahi, Solve Karne Mein Madad**
AI past similar resolved cases dhundhta hai aur officer ko batata hai: *"Pichli baar aisa case pipe replacement se 5 din mein solve hua, required tools: 200mm clamp, citizen rating 4.5★."*
> **Why unique:** Koi bhi Indian grievance portal officer ko "kya karna chahiye" nahi batata. Yeh hamara core differentiator hai.

---

### 4. 🎤 **Voice-First for Bharat — Bolo, Complaint Ho Gayi**
Illiterate ya semi-literate citizen apni bhasha mein bol de → Speech-to-Text → AI structured complaint bana de → voice mein confirmation bhi sune.
> **Why unique:** Existing portals complex text-form-centric hain — jahan 40%+ population effectively form fill nahi kar sakti.

---

### 5. 🌐 **Cross-Language Bridge — Citizen Tamil/Hindi Mein, Officer English/Hindi Mein**
Citizen kisi bhi Indian language mein complaint kare, officer ko apni language mein structured brief mile, aur citizen ko status updates wapas uski apni language mein jaayein.
> **Why unique:** Language barrier poori tarah eliminate — kisi manual translation team ki zaroorat nahi.

---

### 6. ⚡ **Smart Priority Scoring — FIFO Nahi, Urgency First**
Multi-factor scoring: safety risk, affected population, duration, school/hospital proximity, recurrence, photo evidence — se priority score (0–100) banta hai. Open live electrical wire pothole se pehle triage hoga.
> **Why unique:** Existing systems mein complaints "first-come-first-served" (FIFO) queue mein hoti hain — emergency issues bhi line mein intezar karte hain.

---

### 7. 🔍 **Explainable AI — "Yeh HIGH Priority KYUN Hai?"**
Har AI decision ke saath 3-line clear reasoning: *"200 households affected, 14 days pending, 3rd recurrence in 12 months near School boundary."*
> **Why unique:** Government mein black-box AI accept nahi hota. Transparency = Trust = Real Adoption.

---

### 8. 🗺️ **Proactive Systemic Alerts — Root Cause Detection**
Location + category + time pattern mining se administration ko proactive alert: *"Ward 14 mein water complaints 300% badhi hain — possible main pipeline fracture. Patching band karo, pipeline replacement sanction karo."*
> **Why unique:** Existing analytics sirf static historical pie charts dikhate hain. Hum reactive governance ko proactive predictive governance banate hain.

---

### 9. 📋 **AI Officer Brief — 30 Second Mein Poori Picture**
Officer ko 10 page lambi complaint nahi padhni — ek concise one-page operational brief: kya hua, kahan hua, kitna urgent hai, kaun affected hai, pehle kya hua tha, aur ab kya karna chahiye.
> **Why unique:** Field engineers aur officers ka ghanton ka paperwork bachta hai, leading to faster ground action.

---

### 10. 🛡️ **Human-in-the-Loop by Design — AI Recommend Karega, Decide Nahi**
AI kabhi complaint unilaterally reject ya close nahi karta, aur budget sanction decide nahi karta. Har recommendation ko authorized officer accept, modify, ya reject karta hai — aur har human action tamper-proof audit log mein record hota hai.
> **Why unique:** Yeh sirf ek marketing disclaimer nahi, platform ke software architecture ka hissa hai. Government-ready, transparent, aur accountable.

---

## 🏗️ 1. Core Architecture & One Source of Truth

Every citizen report is tracked under the same primary entities throughout its entire lifecycle:
`complaint_id` ⟷ `incident_id` ⟷ `evidence_id` ⟷ `action_id` ⟷ `verification_id`.

```
                       ┌──────────────────────────────────────┐
                       │          Citizen Submission          │
                       │    (Voice / Text / Photo / GPS)      │
                       └──────────────────┬───────────────────┘
                                          │
                                          ▼
                       ┌──────────────────────────────────────┐
                       │     Autonomous Multi-Agent Mesh      │
                       │   (8 Cooperative Agents in Node)     │
                       └──────────────────┬───────────────────┘
                                          │
                                          ▼
                       ┌──────────────────────────────────────┐
                       │       Supabase PostgreSQL DB         │
                       │  - PostGIS Spatial Proximity         │
                       │  - pgvector HNSW 768-dim Embeddings  │
                       │  - Immutable Audit & Status History  │
                       └──────────┬────────────────┬──────────┘
                                  │                │
             PostgreSQL Changes   │                │ Server-Sent Events
             (Supabase Realtime)  ▼                ▼ (23 Canonical Types)
             ┌─────────────────────────────────────────────────────────┐
             │            Authoritative Reactive Event Bus             │
             └────────────┬────────────────┬─────────────────┬──────────┘
                          │                │                 │
                          ▼                ▼                 ▼
                 ┌─────────────────┐ ┌───────────┐ ┌─────────────────┐
                 │ 👤 Citizen View │ │ 🏛️ Officer│ │ 🛡️ Super Admin  │
                 │ - Live Timeline │ │ - Dispatch│ │ - City Heatmaps │
                 │ - Photo Audit   │ │ - SOPs    │ │ - Audit Trail   │
                 │ - Verification  │ │ - Actions │ │ - SLA Analytics │
                 └─────────────────┘ └───────────┘ └─────────────────┘
```

---

## 🧠 2. Multi-Agent AI Pipeline Under the Hood

The backend orchestrates **8 specialized AI agents** (`server/agents/`) executing sequentially with automatic fallback handling:

```
                  [ Citizen Complaint Input ]
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Complaint Analyzer Agent (Multilingual NLP & Category) │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 2. Complaint DNA Agent (Problem, Asset, Cause Extraction) │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 3. Similarity & Cluster Agent (pgvector + PostGIS 300m)   │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 4. Civic Incident Agent (Cluster Synthesis & Title)       │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 5. Root Cause Agent (Underground Infrastructure Diagnosis)│
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 6. Resolution Agent (Past SOPs, Tool List, Repair Hours)  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 7. Authority Routing Agent (Jurisdiction Allocation)      │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ 8. Civic Memory Agent (RAG Search on Historical Fixes)    │
└───────────────────────────────────────────────────────────┘
```

| Agent | Responsibility | Underlying Technology |
|---|---|---|
| **ComplaintAnalyzerAgent** | Translates Hinglish/Hindi, scores urgency, and maps category | Google Gemini 3.5 Flash |
| **ComplaintDNAAgent** | Deconstructs complaint into standardized structured DNA | Structured JSON Output Schema |
| **SimilarityClusterAgent** | Finds duplicate/related reports using spatial and semantic similarity | PostGIS `ST_DWithin` + `pgvector` |
| **CivicIncidentAgent** | Merges multiple citizen complaints into 1 unified master incident | Graph Aggregation |
| **RootCauseAgent** | Identifies chronic failures (e.g. 35-year decaying cast iron mains) | Causal Chain Inference |
| **ResolutionAgent** | Prescribes required tools, crew size, SOP checklist, and repair ETA | Municipal Knowledge Base |
| **AuthorityRoutingAgent** | Matches incident to correct department (DJB, PWD, MCD, Tata Power) | Jurisdictional Decision Rules |
| **CivicMemoryAgent** | Queries and stores resolved incidents for long-term municipal learning | `pgvector` Cosine Similarity |

---

## 🔄 3. Canonical State & Real-Time Event Model

### 11-Stage Canonical Status Graph (`server/constants/statuses.js`)
All database records conform to one canonical status, translated dynamically into role-tailored perspectives:

```text
REPORTED ──► ANALYZING ──► CONNECTED ──► INCIDENT_CREATED ──► AUTHORITY_ASSIGNED
                                                                      │
                                                                      ▼
RESOLVED (CONFIRMED) ◄── VERIFICATION_PENDING ◄── ACTION_COMPLETED ◄── INVESTIGATION ──► ACTION_IN_PROGRESS
        ▲                                                                                       │
        └────────────────────────────── REOPENED (DISPUTED) ◄───────────────────────────────────┘
```

| Canonical Status | 👤 Citizen Sees | 🏛️ Civic Officer Sees | 🛡️ Super Admin Sees |
|---|---|---|---|
| `REPORTED` | Report Submitted | New Ingestion | Pending Classification |
| `ANALYZING` | AI Processing | AI Engine Active | Ingest Pipeline Running |
| `CONNECTED` | Related Reports Linked | Clustered Incident | Cluster Synthesized |
| `INCIDENT_CREATED` | Civic Incident Created | Incident Queue | Incident Recorded |
| `AUTHORITY_ASSIGNED` | Department Assigned | Assigned to Queue | Department Allocated |
| `INVESTIGATION` | Field Inspection Started | Investigation Active | Active Investigation |
| `ACTION_IN_PROGRESS` | Work in Progress | Remediation Underway | Remediation in Progress |
| `ACTION_COMPLETED` | Remediation Completed | Work Completed | Remediation Signed Off |
| `VERIFICATION_PENDING` | Verification Required | Pending Citizen Audit | Awaiting Citizen Audit |
| `RESOLVED` | Issue Resolved & Confirmed | Resolved & Signed Off | Resolved (Historical) |
| `REOPENED` | Dispute Reopened | Reopened by Citizen | SLA Escalated Dispute |

### 23 Canonical Real-Time Events (`server/constants/events.js`)
Emitted across Server-Sent Events (`/api/events`) and Supabase Realtime channels:
- `complaint_created`, `complaint_updated`, `complaint_analyzed`, `dna_generated`, `embedding_generated`
- `similar_complaints_found`, `incident_created`, `incident_updated`, `incident_escalated`
- `root_cause_ready`, `recommendation_ready`, `authority_assigned`, `officer_assigned`
- `investigation_started`, `field_action_started`, `field_action_updated`, `field_action_completed`, `evidence_uploaded`
- `verification_requested`, `verification_submitted`, `incident_resolved`, `incident_reopened`, `notification_created`

---

## 👥 4. Features by Role

### 👤 Citizen
- **Voice-to-Text Input**: Built-in speech recognition for Hindi, Hinglish, and English via the Web Speech API.
- **GPS Pinpoint**: Automatically attaches coordinates and ward details via HTML5 Geolocation.
- **"We Understood You As"**: Immediate verification of AI comprehension before final submission.
- **Authoritative Shared Timeline**: Live chronological audit of every inspection, dispatch, and repair step.
- **Closed-Loop Verification**: Review officer completion photos, provide 1–5 star ratings, or reopen disputes with 1 tap.

### 🏛️ Civic Officer
- **Incident Dispatch Queue**: View clustered incidents rather than 50 duplicate tickets.
- **AI Operational Briefing**: Instant display of required tools, estimated repair hours, and SOP checklists.
- **Field Action Sign-Off**: Upload completion evidence photos and log field actions directly into the database.
- **Cross-Department Coordination**: Coordinate joint work between water (DJB) and road (PWD) departments on shared incidents.

### 🛡️ Super Admin
- **City-Wide Heatmaps**: Interactive PostGIS density map of emerging and chronic municipal hotspots.
- **Tamper-Proof Audit Trail**: Real-time queryable audit logs (`public.audit_logs`) tracking every system mutation and officer action.
- **Civic Memory Intelligence**: Persistent institutional knowledge tracking recurring failures and contractor warranties.

---

## 💻 5. Complete Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | **React 19**, **Vite 6**, **React Router v7** | Ultra-responsive modern SPA architecture |
| **Icons & Design** | **Lucide React**, Custom CSS Design System | Glassmorphism, accessible dark/light themes, micro-animations |
| **Native APIs** | **Web Speech API**, **Geolocation API**, **Canvas Confetti** | Indic voice input, GPS positioning, celebratory feedback |
| **Backend** | **Node.js (ESM)**, **Express.js v5** | Lightweight, high-throughput REST API server |
| **Database** | **Supabase PostgreSQL** | Authoritative Single Source of Truth |
| **GIS & Spatial** | **PostGIS** (`ST_MakePoint`, `ST_DWithin`, `ST_Distance`) | Geographic radius clustering and spatial queries |
| **Vector Engine** | **`pgvector`** (768-dimension HNSW indexing) | Semantic complaint matching & Civic Memory RAG |
| **AI / Foundation** | **Google Gemini (2.5/3.5 Flash)** | Low-latency multimodal reasoning & structured outputs |
| **Real-Time Bus** | **Supabase Realtime (WebSockets)** + **Server-Sent Events** | Zero-latency event propagation & multi-tab cache sync |
| **Media Storage** | **Supabase Storage** | Cloud storage for complaint media and completion proof |
| **Testing** | **Node.js Native Test Runner** (`node --test`) | Zero-dependency unit and cross-role integration testing |

---

## ⚡ 6. How to Run Locally (Quickstart)

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/SDRRAUT/Jan_Sahayak.git
cd Jan_Sahayak
```

### Step 2: Configure Environment Variables
Copy the template `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in your configuration variables:
```env
# Server Configuration
PORT=3001
VITE_PORT=3737
NODE_ENV=development
DEMO_MODE=false

# Supabase Auth & Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authoritative PostgreSQL Database (PostGIS + pgvector)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres

# Google Gemini Multi-Agent AI
GEMINI_API_KEY=your-gemini-api-key

# Production Domain Whitelist (CORS)
ALLOWED_ORIGINS=http://localhost:3737,http://localhost:3000,http://127.0.0.1:3737
```

### Step 3: Database & Migrations Setup
The PostgreSQL schema requires the `postgis` and `vector` extensions:
1. In your Supabase SQL Editor or `psql` connection, run:
```sql
\i database/migrations/001_initial_schema.sql
```
This automatically initializes:
- `extensions.postgis` (Geographic coordinates, distance calculations, spatial buffering)
- `extensions.vector` (768-dimensional embeddings with HNSW indexing for cosine similarity)
- All 18 relational tables with strict foreign keys, timestamps, and indexes
- Row Level Security (RLS) policies for Citizen, Officer, and Super Admin roles
- Stored procedures: `search_nearby_complaints`, `search_similar_complaints`, `search_civic_memory`

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start the Full Platform
```bash
npm start
```
This automatically starts:
- 📡 **Backend API Server**: `http://localhost:3001`
- ⚡ **Frontend Client**: `http://localhost:3737` (or `http://localhost:3000`)

### Step 6: Build for Production
```bash
npm run build
```

---

## 🧪 7. Validation & Automated Testing

Jan_Sahayak includes a comprehensive, multi-layer validation suite:

### 1. Unit Test Suite (`npm test`)
```bash
npm test
```
**Results: 11 PASSED, 0 FAILED**
- ✔ `Gemini AI Assistant - Role-segregated tool declarations`
- ✔ `Gemini AI Assistant - Citizen tools execution against real/fallback data`
- ✔ `Gemini AI Assistant - Civic officer tools operational structure`
- ✔ `Gemini AI Assistant - Super admin live citywide metrics`
- ✔ `Gemini AI Assistant - High-impact action confirmation detection`
- ✔ `Gemini AI Assistant - Hinglish grounding & response processing`
- ✔ `Canonical Events - Completeness (23 canonical event types)`
- ✔ `Orchestrator - Ingests and processes complaint into Incident entity`
- ✔ `Canonical Statuses - Normalization`
- ✔ `Canonical Statuses - Valid Transitions`
- ✔ `Canonical Statuses - Role-Specific Labels`

### 2. Multi-Agent Pipeline Verification (`npm run test:pipeline`)
Simulates 5 realistic school waterlogging complaints through the 9-agent pipeline:
```bash
npm run test:pipeline
```
- Ingests 5 citizen signals ➔ Generates 5 Complaint DNAs
- Clusters complaints spatially (PostGIS) and semantically (pgvector) into 1 Civic Incident
- Runs forensic Root Cause Analysis and Resolution Simulations
- Generates Cross-Department Coordination Graph
- Executes Section 20 closed-loop verification and logs to Civic Memory

### 3. Cross-Role End-to-End Suite (`node scripts/test_cross_role_sync.js`)
Validates the full operational lifecycle across Citizen, Officer, and Super Admin:
```bash
node scripts/test_cross_role_sync.js
```
**Results: 24 PASSED, 0 FAILED**
- ✅ Database & System Health Check
- ✅ Citizen Ingestion & AI Pipeline Execution
- ✅ Officer Incident Visibility & Status Transition (`INVESTIGATION`)
- ✅ Officer Action & Completion Evidence (`ACTION_COMPLETED`)
- ✅ Citizen Dispute (`DISPUTE_REOPENED`) ➔ Re-escalation ➔ Confirmation (`RESOLVED_CONFIRMED`)
- ✅ Authoritative Shared Timeline Retrieval
- ✅ Super Admin Audit Trail & Live Analytics

---

## 📡 8. API Endpoints Reference

| Category | Method & Path | Access | Description |
|---|---|---|---|
| **Health** | `GET /api/health` | Public | System status and uptime |
| **Health** | `GET /api/health/db` | Public | PostgreSQL/Supabase connectivity status |
| **Auth** | `POST /api/auth/register` | Public | Citizen registration with role-based profile |
| **Auth** | `POST /api/auth/login` | Public | Authentication with Supabase JWT & demo support |
| **Auth** | `POST /api/auth/logout` | Authenticated | Terminate session |
| **Grievances** | `GET /api/grievances` | Authenticated | Fetch authoritative grievances (role-scoped) |
| **Grievances** | `POST /api/grievances` | Citizen | Ingest complaint through the 8-Agent AI mesh |
| **Grievances** | `GET /api/grievances/:id/timeline` | Authenticated | Fetch unified chronological timeline from DB |
| **Grievances** | `POST /api/grievances/:id/transition-status` | Officer / Admin | Transition canonical status with strict validation |
| **Grievances** | `POST /api/grievances/:id/resolve` | Officer / Admin | Mark field action completed with required photo evidence |
| **Grievances** | `POST /api/grievances/:id/verify` | Citizen | Closed-loop citizen satisfaction verification / dispute |
| **Field Actions** | `GET /api/field-actions` | Officer / Admin | List operational field actions with photos & GPS |
| **Field Actions** | `POST /api/field-actions` | Officer / Admin | Dispatch repair squad, record before/after photos & coordinates |
| **Verifications**| `GET /api/verifications` | Authenticated | List citizen verification records (role-filtered) |
| **Verifications**| `POST /api/verifications` | Citizen | Submit closed-loop rating, ground feedback, or dispute |
| **Evidence** | `POST /api/evidence/upload` | Authenticated | Secure file upload with MIME & size validation |
| **Incidents** | `GET /api/incidents` | Officer / Admin | Fetch synthesized civic incidents with linked tickets |
| **Incidents** | `GET /api/incidents/:id` | Officer / Admin | Fetch full incident detail with graph nodes & SOPs |
| **Admin** | `GET /api/admin/audit-logs` | Super Admin | Query immutable audit logs (`public.audit_logs`) |
| **Admin** | `GET /api/admin/analytics` | Super Admin | Query live aggregation metrics across all wards |
| **Realtime** | `GET /api/events` | Authenticated / App | Server-Sent Events stream for 23 canonical event types |

---

## 🔒 9. Security Architecture

1. **No Insecure Hardcoded Secrets**: All database connection strings, Supabase JWTs, and Gemini API keys are externalized into environment variables (`.env`).
2. **Strict Domain-Restricted CORS**: Unrestricted CORS disabled. Express enforces origins whitelist configured via `ALLOWED_ORIGINS`.
3. **Sliding-Window Rate Limiting**: In-memory rate limiting applied to `/api/auth/*` (15 req/15min), `/api/complaints` and `/api/grievances` (20 req/15min), `/api/ai/*` (30 req/min), and `/api/evidence/upload` (20 req/15min).
4. **Secure File Uploads**: MIME-type sniffing validation, file extension whitelist (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, `.mp3`, `.wav`, `.m4a`, `.webm`), file size caps (10MB for photos, 20MB for audio), and unique filename hashing.
5. **Authenticated, Deduplicated SSE**: Server-Sent Events endpoint (`/api/events`) enforces session-token authorization, role-based event filtering, and single-connection-per-client deduplication.
6. **Strict Canonical Status Validation**: Backend rejects illegal workflow status transitions with HTTP 422 unless authorized with Super Admin override.
7. **Database Row Level Security (RLS)**: PostgreSQL tables enforce role isolation: citizens query only their submissions; officers access departmental incidents; super admins access systemwide audit records.

---

## 👥 Demo Personas (1-Click Switch in UI)

| Persona | Name & Role | Credentials | Focus Area |
|---|---|---|---|
| 👤 **Citizen** | Aditya Verma | `aditya@citizen.in` / `citizen123` | File voice/photo report, track live timeline, verify fix |
| 🏛️ **Civic Officer** | Er. Sanjay Sharma *(AEE, DJB)* | `sanjay.sharma@djb.gov.in` / `officer123` | Triage incidents, execute field action, upload photo proof |
| 🛡️ **Super Admin** | Dr. Meenakshi Sundaram, IAS | `superadmin@delhi.gov.in` / `superadmin123` | City heatmaps, SLA compliance, chronic hotspot memory |

---

## 📄 License
JanSahayk is distributed under the **[MIT License](LICENSE)**.  
*Engineered for municipal empowerment, transparency, and resilient public infrastructure.*
