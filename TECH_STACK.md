# ⚡ Jan Sahayak — Tech Stack

> AI-powered civic grievance platform for Indian municipalities

---

## 🎨 Frontend

| Tech | Version | Kaam |
|------|---------|------|
| **React** | 19 | UI banata hai |
| **Vite** | 6 | Build tool — super fast |
| **React Router** | v7 | Page navigation |
| **Lucide React** | 0.475 | Icons |
| **Canvas Confetti** | 1.9 | Complaint resolve hone pe celebration 🎉 |
| **Custom CSS** | — | Full design control |

---

## 🖥️ Backend

| Tech | Version | Kaam |
|------|---------|------|
| **Node.js** | 18+ | Server runtime |
| **Express** | v5 | REST API |
| **SSE** | Built-in | Real-time notifications |
| **Nominatim** | Free API | GPS → Address convert |

---

## 🗄️ Database

| Tech | Kaam |
|------|------|
| **Supabase** | Auth + PostgreSQL + Storage |
| **PostgreSQL** (`pg`) | Main database |
| **JSON Fallback** | Offline / Demo mode |

---

## 🤖 AI System

**Model:** Google Gemini Flash

```
Citizen complaint → 8 AI Agents → Smart Action
```

| Agent | Kaam |
|-------|------|
| 🎯 Orchestrator | Sab agents coordinate karta hai |
| 🧬 DNA Agent | Complaint ka unique fingerprint banata hai |
| 🔁 Cluster Agent | Duplicate complaints group karta hai |
| 🗺️ Routing Agent | Sahi department ko bhejta hai |
| 🔍 Root Cause Agent | Infrastructure failure analyze karta hai |
| ✅ Verification Agent | Spam filter karta hai |
| 💡 Resolution Agent | SOP + equipment recommend karta hai |
| 🧠 Memory Agent | Historical cases yaad rakhta hai (RAG) |

---

## 🗺️ Maps

| Tech | Kaam |
|------|------|
| **Leaflet.js** | Interactive maps (Google Maps ka free alternative) |
| **React Leaflet** | Maps as React components |
| **OpenStreetMap** | Free map tiles — India accurate |

---

## 🔐 Security

| Layer | Kaam |
|-------|------|
| JWT (Supabase) | Secure login tokens |
| CORS | Sirf allowed domains access kar saken |
| Rate Limiting | Spam attacks block |
| Privacy Masking | Citizen data protect — `R****** K****` |

---

## 🛠️ Dev Tools

```
npm run dev      →  Frontend (port 3737)
npm run server   →  Backend  (port 3001)
npm start        →  Dono ek saath
npm test         →  11 tests run karo
npm run build    →  Production build
```

**Git Branches:** `main` (production) → `citizens` (development)

---

## 🏗️ Architecture

```
Browser (React)
    ↕ REST API + SSE
Express Server (Node.js)
    ↕             ↕
8 AI Agents    Supabase DB
    ↕
Google Gemini API
```

---

> Made for 🇮🇳 Bharat · MIT License · [github.com/SDRRAUT/Jan_Sahayak](https://github.com/SDRRAUT/Jan_Sahayak)
