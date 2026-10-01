# 🛠️ Jan Sahayak — Complete Tech Stack

> **जन सहायक** — AI-Powered Civic Grievance Management Platform for Indian Municipal Governance  
> Yeh document **Hinglish** mein likha gaya hai taaki sab samajh sakein — technical aur non-technical dono.

---

## 📋 Table of Contents

1. [Project Kya Hai?](#project-kya-hai)
2. [Frontend Technologies](#-frontend-technologies)
3. [Backend Technologies](#-backend-technologies)
4. [Database & Storage](#-database--storage)
5. [AI & Multi-Agent System](#-ai--multi-agent-system)
6. [Maps & Geospatial](#-maps--geospatial)
7. [Dev Tools & Build System](#-dev-tools--build-system)
8. [Security & Middleware](#-security--middleware)
9. [Project Architecture Summary](#-project-architecture-summary)

---

## Project Kya Hai?

**Jan Sahayak** ek AI-powered civic platform hai jo India ke municipal officers aur citizens ko connect karta hai. Agar kisi ke area mein pothole hai, paani kharab hai, ya bijli gayi hai — toh citizen apni complaint file kare, aur AI automatically:
- Complaint samjhe (Hindi, Hinglish, English sab)
- Department ko route kare
- Officer ko priority bata de
- Duplicate complaints detect kare
- Jan Suchna (public advisory) bheje

---

## 🎨 Frontend Technologies

### React 19
- **Kya hai:** JavaScript ka ek library jo UI banata hai — buttons, pages, modals sab kuch.
- **Kyun use kiya:** India ke civic platforms mein real-time data update bahut zaroori hai. React ka virtual DOM bahut fast re-render karta hai bina page reload kiye. Version 19 mein latest performance improvements aaye hain.
- **Package:** `react@^19.0.0`, `react-dom@^19.0.0`

### React Router DOM v7
- **Kya hai:** Ek routing library jo ek hi page (SPA) mein multiple URLs handle karta hai.
- **Kyun use kiya:** `/citizen`, `/officer`, `/admin` — yeh sab alag pages lagte hain par actually ek hi React app hai. User ko navigate karna smooth lagta hai, full page reload nahi hota. v7 mein URL pattern matching bahut better ho gaya.
- **Package:** `react-router-dom@^7.2.0`

### Vite 6
- **Kya hai:** Next-generation build tool aur dev server jo React apps ke liye use hota hai.
- **Kyun use kiya:** Purana Create React App bahut slow tha. Vite HMR (Hot Module Replacement) use karta hai — code change karo aur browser mein instantly reflect hota hai bina full reload ke. Production build bhi bahut fast aur optimized hota hai. Port `3737` pe local dev server run hota hai.
- **Package:** `vite@^6.2.0`, `@vitejs/plugin-react@^4.3.4`

### Lucide React
- **Kya hai:** Beautiful, consistent SVG icons ka library — 500+ icons available hain.
- **Kyun use kiya:** Har jagah icons chahiye — complaint cards pe, buttons pe, tabs pe. Lucide icons lightweight SVG hain jo React components ki tarah kaam karte hain. File size bhi minimal hai kyunki sirf jo icons use karo wohi bundle mein jaate hain.
- **Package:** `lucide-react@^0.475.0`

### Custom CSS + index.css (2000+ lines)
- **Kya hai:** Ek central CSS file jisme saari styling hai — Tailwind-style utilities nahi, pure custom CSS.
- **Kyun use kiya:** Government officers ke liye ek specific design language chahiye tha — authoritative, professional, clean. Custom CSS se pixel-perfect control milta hai. Responsive design (mobile 320px se desktop 1440px tak) bhi handle kiya gaya hai `@media` queries se.

### Canvas Confetti
- **Kya hai:** Ek fun animation library jo confetti particles screen pe giraati hai.
- **Kyun use kiya:** Jab citizen ki complaint resolve ho jaati hai, toh ek celebration moment hona chahiye. Yeh small UX touch citizen ko emotionally connect karta hai — unka problem actually solve hua. Citizen engagement badhata hai.
- **Package:** `canvas-confetti@^1.9.4`

---

## 🖥️ Backend Technologies

### Node.js (Runtime)
- **Kya hai:** JavaScript ko server pe chalane ka engine. Browser ke bahar bhi JS run hoti hai.
- **Kyun use kiya:** Frontend bhi JavaScript mein hai, backend bhi — ek hi language, ek hi team. Node.js event-loop architecture se hazar concurrent requests handle hoti hain bina extra threads ke. Government APIs ke liye perfect.
- **Command:** `node server/index.js`

### Express.js v5
- **Kya hai:** Node.js ke liye sabse popular web framework — REST API banane ke liye.
- **Kyun use kiya:** Simple, minimal, aur flexible. `/api/grievances`, `/api/auth/login`, `/api/intelligence` — yeh sab Express routes hain. v5 async error handling automatically karta hai jo production mein bahut helpful hai. Government data APIs ke liye reliable aur battle-tested.
- **Package:** `express@^5.2.1`

### ESM (ES Modules — `"type": "module"`)
- **Kya hai:** Modern JavaScript import/export syntax — `import` aur `export` use karo, purana `require()` nahi.
- **Kyun use kiya:** Modern JavaScript standard hai. Frontend (Vite) bhi ESM use karta hai, toh frontend aur backend mein consistency hai. Tree-shaking se bundle size optimize hoti hai.

### Server-Sent Events (SSE)
- **Kya hai:** Server se browser ko real-time data push karne ki technique — WebSocket se simple.
- **Kyun use kiya:** Jab officer koi action le, toh citizen ko instantly notification chahiye. SSE ek simple one-way real-time channel hai jisme dedicated WebSocket server nahi chahiye. Endpoint: `/api/events` aur `/api/intelligence/events`.

### Nominatim (OpenStreetMap Reverse Geocoding)
- **Kya hai:** Free, open-source geocoding service — GPS coordinates ko address mein convert karta hai.
- **Kyun use kiya:** Jab citizen photo kheenchta hai ya GPS location share karta hai, hume address chahiye. Google Maps API ka cost bahut zyada hota. Nominatim bilkul free hai aur India ke addresses ke liye accha kaam karta hai. Endpoint: `/api/location/reverse-geocode`.

---

## 🗄️ Database & Storage

### Supabase
- **Kya hai:** Open-source Firebase alternative — PostgreSQL database + Auth + Storage ek saath.
- **Kyun use kiya:** Jan Sahayak ko real authentication chahiye (citizens register karein, officers login karein) aur persistent data storage. Supabase ne ye sab ek platform pe diya — managed PostgreSQL, JWT-based auth, row-level security. Indian government data ke liye compliance-friendly.
- **Package:** `@supabase/supabase-js@^2.116.0`
- **Features used:**
  - `supabase.auth.signUp()` — Citizen registration
  - `supabase.auth.signInWithPassword()` — Login
  - `supabase.auth.getUser()` — Token verify karna
  - PostgreSQL tables — Grievances, profiles, notifications

### PostgreSQL (via `pg` driver)
- **Kya hai:** World ka most advanced open-source relational database.
- **Kyun use kiya:** Grievances, timelines, notifications, audit logs — yeh sab structured relational data hai jiske liye SQL bahut suitable hai. Supabase ke andar PostgreSQL hi run hota hai. Direct `pg` driver se complex queries bhi chalate hain jab Supabase client slow ho.
- **Package:** `pg@^8.23.0`

### In-Memory JSON Store (Fallback / Demo Mode)
- **Kya hai:** Server ki memory mein data rakhna — koi external database nahi.
- **Kyun use kiya:** Development mein ya jab Supabase unreachable ho, app crash nahi karna chahiye. `server/db/database.js` ek local JSON file (`server/data/store.json`) mein data save karta hai. Demo mode mein bhi sab features kaam karte hain. Graceful degradation ka principle.

### Supabase Storage (File Uploads)
- **Kya hai:** Cloud file storage service — images, videos store karo.
- **Kyun use kiya:** Citizen jab complaint file karta hai, photos ya video evidence attach kar sakta hai. Yeh files Supabase Storage mein jaati hain. Local uploads ke liye `/public/uploads` folder bhi hai as fallback.

---

## 🤖 AI & Multi-Agent System

### Google Gemini AI (`gemini-flash-latest`)
- **Kya hai:** Google ka most powerful multimodal AI model — text, images, JSON sab samajhta hai.
- **Kyun use kiya:** Citizen ki complaint Hindi/Hinglish mein ho sakti hai. Gemini usse samjhe, category determine kare, severity judge kare, aur structured JSON output de. `gemini-flash` model fast hai aur cost-effective — government scale pe thousands of complaints daily process karne ke liye suitable.
- **Used in:** `server/services/geminiAssistant.js`, `server/agents/aiProvider.js`
- **Capabilities:**
  - Complaint text analysis aur classification
  - Structured JSON generation (category, department, severity, SLA)
  - Hindi/Hinglish to English translation
  - Citizen communication drafts (Hindi aur English dono)
  - Conversational AI assistant (JanSahayak Assistant)

### Multi-Agent Pipeline (8 Specialized AI Agents)

Yeh ek "AI team" hai jisme har agent ek kaam mein expert hai:

| Agent | File | Kaam kya hai |
|-------|------|-------------|
| **Orchestrator** | `orchestrator.js` | Boss agent — baaki sab agents ko coordinate karta hai, SSE events broadcast karta hai |
| **Complaint Analyzer Agent** | `ComplaintAnalyzerAgent.js` | Complaint text parse karta hai — language detect, category classify |
| **Complaint DNA Agent** | `ComplaintDNAAgent.js` | Har complaint ka unique "DNA fingerprint" banata hai — description, location, category ka combination |
| **Similarity Cluster Agent** | `SimilarityClusterAgent.js` | Similar ya duplicate complaints ko ek "cluster" mein group karta hai |
| **Authority Routing Agent** | `AuthorityRoutingAgent.js` | Complaint ko sahi department aur officer ke paas route karta hai |
| **Civic Incident Agent** | `CivicIncidentAgent.js` | Multiple complaints ek bade civic incident mein merge karta hai |
| **Root Cause Agent** | `RootCauseAgent.js` | Infrastructure failure ke underlying root cause ko analyze karta hai |
| **Verification Agent** | `VerificationAgent.js` | Complaint ki validity verify karta hai, spam filter karta hai |
| **Resolution Agent** | `ResolutionAgent.js` | Resolution ki recommend karta hai — SOP, equipment, estimated time |
| **Civic Memory Agent** | `CivicMemoryAgent.js` | Historical cases remember karta hai — RAG (Retrieval Augmented Generation) |

### AI Provider Abstraction (`aiProvider.js`)
- **Kya hai:** Ek wrapper jo Gemini API call karta hai, aur agar API unavailable ho toh deterministic fallback use karta hai.
- **Kyun use kiya:** Government systems 24/7 kaam karne chahiye. Agar Gemini API down ho ya API key missing ho, system gracefully degrade kare aur rule-based fallback se kaam kare. Zero downtime approach.

### Client-Side AI Engine (`src/services/aiEngine.js`)
- **Kya hai:** Browser pe chalane wala lightweight AI — koi server call nahi karta.
- **Kyun use kiya:** Real-time complaint analysis — citizen type kare aur instantly feedback mile. Server pe API call lagega toh latency hogi. Client-side rules-based engine instantly:
  - Language detect karta hai (Hindi/Hinglish/English)
  - Department predict karta hai
  - Duplicate candidates dikhata hai
  - Ward aur location extract karta hai

### JanSahayak Assistant (Floating AI Chatbot)
- **Component:** `src/components/assistant/JanSahayakAssistant.jsx`
- **Backend:** `server/services/geminiAssistant.js`
- **Kya hai:** Ek floating AI chat button jo har page pe available hai.
- **Kyun use kiya:** Citizens aur officers ko kabhi bhi help chahiye ho sakti hai. Gemini se powered, yeh assistant civic queries answer karta hai — "meri complaint ka status kya hai?", "water complaint kaise file karein?" etc.

---

## 🗺️ Maps & Geospatial

### Leaflet.js
- **Kya hai:** Open-source interactive map library — Google Maps ka free alternative.
- **Kyun use kiya:** Jan Sahayak mein heatmaps, problem spread maps, ward boundary maps dikhane hain. Google Maps API ka cost astronomical hota. Leaflet + OpenStreetMap bilkul free hai aur India ke maps ke liye accurate hai. Touch-friendly, mobile-ready.
- **Package:** `leaflet@^1.9.4`

### React Leaflet
- **Kya hai:** Leaflet ka React wrapper — maps ko React components ki tarah use karo.
- **Kyun use kiya:** React mein Leaflet directly use karna tricky hota hai (DOM manipulation conflicts). React Leaflet ne sab simplify kar diya — `<MapContainer>`, `<TileLayer>`, `<Marker>` jaise clean React components.
- **Package:** `react-leaflet@^5.0.0`

### OpenStreetMap (OSM)
- **Kya hai:** Free, crowdsourced world map — Wikipedia of maps.
- **Kyun use kiya:** Satellite tiles, street map tiles — sab free aur open-source. Indian cities ke liye bahut accurate data hai. Government transparency ke liye open-source maps appropriate hain.

### Nominatim Reverse Geocoding
- **Kya hai:** GPS coordinates (lat, lng) → Human-readable address converter.
- **Kyun use kiya:** Citizen jab complaint file karta hai aur GPS location share karta hai, hume ward name, area, pincode chahiye. Nominatim yeh sab free mein deta hai.

---

## 🔧 Dev Tools & Build System

### Git + GitHub
- **Kya hai:** Version control system — code ka history track karna aur collaborate karna.
- **Kyun use kiya:** Multiple developers ek saath kaam kar sakein bina code conflict ke. GitHub pe repository hai: `https://github.com/SDRRAUT/Jan_Sahayak`
- **Branch strategy:** `main` (production), `citizens` (feature development)

### npm (Node Package Manager)
- **Kya hai:** JavaScript packages install aur manage karne ka tool.
- **Kyun use kiya:** `npm install` se sab dependencies ek command mein aa jaati hain. `package.json` mein sab packages listed hain with exact versions.
- **Key scripts:**
  ```
  npm run dev      → Development server start (port 3737)
  npm run build    → Production build banao
  npm test         → 11 automated tests chalao
  npm run server   → Backend API server start (port 3001)
  npm start        → Frontend + Backend dono ek saath
  ```

### Vite Build System
- **Kya hai:** Ultra-fast frontend bundler.
- **Kyun use kiya:** `npm run build` se optimized production files `dist/` folder mein aati hain. Code splitting, tree-shaking, minification — sab automatic. Development mein HMR (Hot Module Replacement) se har save pe instant browser update.
- **Proxy setup:** Dev server mein `/api` requests automatically port 3001 pe forward ho jaate hain.

### Node.js Built-in Test Runner
- **Kya hai:** Node.js 18+ mein built-in testing framework — koi extra package nahi.
- **Kyun use kiya:** External testing frameworks (Jest, Mocha) install karne ki zaroorat nahi. Lightweight aur fast. 11 tests cover: auth flows, AI pipeline, grievance CRUD, status transitions.
- **Command:** `npm test`

### `start.js` (Unified Launcher)
- **Kya hai:** Ek single script jo frontend dev server aur backend API server dono simultaneously start karta hai.
- **Kyun use kiya:** Developer ko do terminal windows open karne ki zaroorat nahi. `npm start` se sab kuch ek saath start.

---

## 🔐 Security & Middleware

### CORS Middleware (`server/middleware/cors.js`)
- **Kya hai:** Cross-Origin Resource Sharing — controls karta hai ki kaun-se domains API access kar sakte hain.
- **Kyun use kiya:** Government API ko publicly accessible nahi hona chahiye. Sirf approved domains (frontend ka domain) hi API call kar sake.

### Rate Limiting (`server/middleware/rateLimiter.js`)
- **Kya hai:** Ek user/IP se zyada requests aayein toh block kar do.
- **Kyun use kiya:** Spam attacks, brute-force login attempts, ya AI endpoint abuse se protect karne ke liye. Separate rate limits hain:
  - `authLimiter` — Login/Register pe strict limit
  - `aiEndpointLimiter` — Gemini API calls pe limit (cost protection)
  - `complaintSubmitLimiter` — Spam complaints rok ne ke liye
  - `fileUploadLimiter` — File upload abuse rok ne ke liye

### JWT (JSON Web Tokens) via Supabase
- **Kya hai:** Secure, stateless authentication tokens — ek encrypted string jo user identity prove karta hai.
- **Kyun use kiya:** User login kare, server JWT token de. Har API call mein yeh token bhejo — server verify kare bina database query kiye. Stateless auth fast aur scalable hai.

### Privacy Utilities (`src/utils/privacy.js`)
- **Kya hai:** Custom functions jo citizen PII (Personally Identifiable Information) mask karte hain.
- **Kyun use kiya:** Government data governance — officer view mein citizen ka full name ya phone number dikhai nahi dena chahiye. `maskCitizenName("Ramesh Kumar")` → `"R****** K****"`. Privacy by design principle.

### Error Handler (`server/middleware/errorHandler.js`)
- **Kya hai:** Global error catcher — koi bhi unhandled error ho, proper JSON response bhejo.
- **Kyun use kiya:** Production mein crash nahi hona chahiye. `ApiError` class structured error codes deta hai (`VALIDATION_ERROR`, `UNAUTHORIZED`, etc.) jo frontend easily parse kar sake.

---

## 📂 Project Architecture Summary

```
Jan_Sahayak/
│
├── 🖥️ FRONTEND (React + Vite — Port 3737)
│   ├── src/pages/          → Full page components (Home, CitizenDashboard, OfficerWorkspace...)
│   ├── src/components/     → Reusable UI components (Navbar, Maps, Modals, AI Assistant...)
│   ├── src/context/        → AppContext.jsx — Global state management (user, grievances, janSuchna)
│   ├── src/services/       → aiEngine.js — Client-side AI analysis
│   ├── src/data/           → Mock data for demo & testing
│   └── src/utils/          → Privacy masking, status helpers
│
├── 🖥️ BACKEND (Express.js — Port 3001)
│   ├── server/index.js     → Main Express app — 3000+ lines, all REST API routes
│   ├── server/agents/      → 8 AI Agents (Orchestrator + 7 specialists)
│   ├── server/db/          → PostgreSQL + JSON fallback database layer
│   ├── server/services/    → Gemini Assistant, Storage Service
│   ├── server/middleware/  → CORS, Rate Limiting, Auth, Error Handling
│   └── server/constants/   → Status codes, Event types
│
├── 🤖 AI LAYER (Google Gemini + Multi-Agent)
│   ├── Gemini Flash API    → Cloud AI (text analysis, JSON generation, chat)
│   └── 8 Local Agents     → Orchestrator, DNA, Cluster, Routing, Incident, RootCause, Verify, Memory
│
├── 🗄️ DATABASE (Supabase PostgreSQL)
│   ├── Auth               → Citizen/Officer registration & JWT sessions
│   ├── Grievances table   → All complaint records
│   ├── Profiles table     → User roles, departments, designations
│   └── Notifications      → Real-time alerts & Jan Suchna broadcasts
│
└── 🗺️ MAPS (Leaflet + OpenStreetMap)
    ├── Heatmap            → AdminHeatmap.jsx — Ward-wise problem density
    ├── Problem Spread Map → CivicIntelligenceDashboard — Real spread of complaints
    └── Territory Explorer → Officer view — Apne ward ka map
```

---

## 🏆 Key Design Decisions

| Decision | Alternative | Kyun yeh choose kiya |
|----------|-------------|----------------------|
| React 19 | Vue.js, Angular | Largest ecosystem, fastest updates, best for team scalability |
| Vite | Create React App, Webpack | 10x faster HMR, modern ESM, smaller bundles |
| Supabase | Firebase, custom PostgreSQL | Open-source, PostgreSQL power, built-in Auth + Storage |
| Leaflet + OSM | Google Maps | Zero cost, open-source, India maps accurate |
| Express v5 | Fastify, Hono | Mature, well-documented, familiar to all Node.js devs |
| Gemini Flash | GPT-4, Claude | Google ecosystem integration, cost-effective at scale, Indic language support |
| Multi-Agent Pattern | Single AI endpoint | Separation of concerns, each agent is testable & replaceable |
| SSE over WebSocket | Socket.io | Simpler, no extra library, one-way push is sufficient here |
| Custom CSS | Tailwind CSS | Full pixel control for government design system |

---

> **Made with ❤️ for Bharat** — Jan Sahayak ka mission hai har citizen ki awaaz government tak pahunchana, aur har officer ko intelligent tools dena taaki wo apni territory best serve kar sake.

> 📌 **Version:** 1.0.0 | **License:** MIT | **Repository:** [github.com/SDRRAUT/Jan_Sahayak](https://github.com/SDRRAUT/Jan_Sahayak)
