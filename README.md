# TraceMind - AI Incident Response Agent with Hindsight Persistent Memory

> **“Your production history becomes your AI’s experience.”**

TraceMind is a production-ready DevOps/SRE incident response agent. It investigates live production incidents, searches **Hindsight Persistent Memory** to recall similar past incidents, compares previous root causes and effective fixes, warns against repeating failed approaches, recommends verified actions with high confidence, and commits the final resolution back into Hindsight.

---

## 🚀 Core Loop

```
New Incident
  ↓
Analyze Telemetry (Service, Error, Symptoms, Logs)
  ↓
Query Hindsight Persistent Memory (Semantic + BM25 + Graph + Outcome weighting)
  ↓
Compare Historical Precedents & Blacklisted Failed Fixes
  ↓
Synthesize Diagnosis & Action Recommendation (Gemini 3.8 Flash)
  ↓
Human SRE Validates or Adjusts Resolution
  ↓
Retain Outcome in Hindsight Bank
  ↓
Future Incidents Become Instantly Smarter (MTTR drops by 92%)
```

---

## 🧠 Hindsight Persistent Memory Architecture

Hindsight is the foundational memory layer of TraceMind, implemented using the `@vectorize-io/hindsight-client` SDK and backed by a persistent memory bank:

1. **Experience Network (Past Actions & Post-Mortems):**
   - Retains first-person actions, verified root causes, effective resolutions, and explicit failed attempts to avoid repeating mistakes.
2. **Observation Network (Systemic Patterns):**
   - Consolidates recurring cross-service issues (e.g., HikariCP connection pool starvation across microservices during checkout spikes) into proactive engineering policies.
3. **World Network (Architecture & Topology):**
   - Maintains service dependencies, database cluster topologies, and infrastructure configurations.

### 4-Strategy Hybrid Recall
When an incident is reported, TraceMind queries Hindsight using a 4-phase retrieval algorithm:
- **Semantic & Lexical Overlap**: Matches contextual failure descriptions and stack traces.
- **Error Signature BM25**: Matches specific exception classes (`HikariPool-1 timeout`, `JWT signature mismatch`).
- **Entity & Service Graph**: Traverses upstream and downstream dependencies.
- **Outcome & Feedback Weighting**: Prioritizes validated successful resolutions and penalizes failed attempts.

---

## 🎬 1-Click Interactive Demo Flow

TraceMind features a built-in Hackathon Demo switcher in the Dashboard and Sidebar to clearly demonstrate the difference between an agent without historical memory and an agent with accumulated Hindsight memory:

### Interaction 1: Cold Start (Zero Memory)
1. In the Dashboard or Sidebar, click **"1️⃣ Test Cold Incident"** (or **"❄️ Cold Memory"**).
2. The Database Connection Pool Exhaustion incident is pre-filled.
3. Click **"Analyze Incident"**.
4. **Observe:** TraceMind detects zero matching memories in Hindsight. It flags `COLD_START_NO_MEMORY` and performs a first-principles diagnosis.
5. In the Resolution section, click **"Confirm Resolution"**.
6. Set the resolution to: `Increased HikariCP maximumPoolSize to 50 and set connectionTimeout to 3000ms`.
7. Add failed approach: `Restarting replica pods (queue immediately re-exhausted)`.
8. Click **"Commit to Hindsight"**.
9. The outcome is now permanently stored in Hindsight!

### Interaction 2: Warm Memory (Accumulated Hindsight)
1. Click **"2️⃣ Test Warm Hindsight Recall"**.
2. Pre-fills an identical database timeout occurring in another service (`OrderService`).
3. Click **"Analyze Incident"**.
4. **Observe the difference:**
   - TraceMind queries Hindsight and finds the precedent with **94% relevance**.
   - Displays **Previous Root Cause**: `HikariCP connection pool exhaustion`.
   - Displays **Previous Successful Fix**: `Increased maximumPoolSize to 50`.
   - Explicitly warns: `DO NOT REPEAT: Restarting replica pods failed`.
   - Diagnosis confidence jumps to **96%**.
5. Click **"Confirm Resolution"** to retain and strengthen the cross-service memory.

---

## 🛠️ Tech Stack & Key Files

- **Framework**: React 19 SPA, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Express on Node.js (`server.ts`) serving unified API endpoints and Vite dev middleware.
- **Memory Layer**: `@vectorize-io/hindsight-client` with durable JSON bank persistence (`.data/hindsight-bank.json`).
- **AI Reasoning**: Google Gemini 3.8 Flash (`@google/genai`) on server-side with structured JSON schemas.

### Key Files
- `server.ts`: Express backend and API routing.
- `server/hindsight-service.ts`: Hindsight memory service (Retain, Recall, Reflect, Observation synthesis).
- `server/gemini-service.ts`: AI SRE incident diagnostic reasoning engine.
- `src/components/IncidentAnalysisView.tsx`: 3-section split view (Current Telemetry, Hindsight Memory, AI Recommendation).
- `src/components/MemoryTimelineView.tsx`: Compounding intelligence timeline (Incident #1 → #5 → #12 → #20).
- `src/components/MemoryBankView.tsx`: Live Hindsight Memory Bank inspector and interactive recall tester.

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional, fallback engine active by default)
# GEMINI_API_KEY="your-gemini-api-key"
# HINDSIGHT_BASE_URL="http://localhost:8888" # Optional local Hindsight daemon

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:3000
```
