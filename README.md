# PathoLens 🔬

**Community Foodborne Pathogen Surveillance & Risk Assessment**  
*Social Project by Team Udte Parinde — Group 4*

---

## Overview

PathoLens is a production-ready full-stack web application built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **Recharts**. It enables real-time foodborne disease risk assessment for rural households through:

- 📊 **Live Google Sheets integration** (linked to a Google Form)
- 🧮 **Risk Score Algorithm** (0–100, weighted across 9 factors)
- 🤖 **AI Q&A Assistant** (Google Gemini 1.5 Flash or Groq Llama 3.1 — free tier)
- 📈 **Analytics Dashboard** with interactive charts
- 🗂️ **Multi-step Assessment Form** with printable PDF summary

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and add your keys (see below)

# 3. Start development server
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key — [Get free at AI Studio](https://aistudio.google.com/app/apikey) |
| `GROQ_API_KEY` | Groq API key (Llama 3.1) — [Get free at Groq Console](https://console.groq.com/keys) |
| `GOOGLE_SHEET_CSV_URL` | CSV export URL of the Google Form response sheet |
| `SHEET_CACHE_SECONDS` | Cache duration in seconds (default: 300) |

> **Without any keys**, the app runs fully on sample data. Only the AI chat shows a configuration message.

### Setting up Google Sheet URL

1. Open your Google Form response Google Sheet.
2. **File → Share → Publish to web → CSV → Copy link**
3. Paste into `GOOGLE_SHEET_CSV_URL` in `.env.local`.

Expected format: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv`

---

## Project Structure

```
patholens/
├── app/
│   ├── api/
│   │   ├── survey-data/route.js    # GET: Analytics from Google Sheet
│   │   ├── assessments/route.js    # POST: Save household assessment
│   │   └── chat/route.js          # POST: AI Q&A with survey context
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Navbar.js         # Responsive nav with scroll effect
│   ├── Hero.js           # Animated hero with live metric badges
│   ├── RiskCalculator.js # 5-step form with real-time risk dial
│   ├── Dashboard.js      # Charts + filterable survey table
│   ├── TeamSection.js    # Team cards with photo/initials fallback
│   ├── ChatWidget.js     # Floating AI chat drawer
│   └── Footer.js
├── lib/
│   ├── googleSheets.js   # Data ingestion + analytics pipeline
│   ├── risk.js           # Risk scoring algorithm (shared)
│   ├── csv.js            # Dependency-free CSV parser
│   ├── team.js           # Team member data (edit LinkedIn URLs here)
│   └── assessmentsStore.js # Local JSON persistence
├── public/
│   └── team/             # Team photos: parth.jpg, lovisha.jpg, etc.
├── data/
│   └── assessments.json  # Auto-created when assessments are submitted
└── .env.example
```

---

## Team Photos

Drop individual photos into `public/team/` using these exact filenames:

| Member | Filename |
|---|---|
| Parth Sharma | `parth.jpg` |
| Lovisha Arora | `lovisha.jpg` |
| Megha Hooda | `megha.jpg` |
| Niharika | `niharika.jpg` |
| Prachi Pal | `prachi_pal.jpg` |
| Prachi Arya | `prachi_arya.jpg` |
| Palak | `palak.jpg` |
| Palak Anand | `palak_anand.jpg` |
| Palak Tiwari | `palak_tiwari.jpg` |
| Kush | `kush.jpg` |
| Prachi Aggarwal | `prachi_aggarwal.jpg` |

> **No photo?** No problem — the app automatically displays styled initials as a fallback.

---

## LinkedIn URLs

Edit `lib/team.js` and update the `linkedin` field for each team member.

---

## Risk Score Algorithm

Scores are computed across 9 weighted factors (0–100 total):

| Factor | Max Weight |
|---|---|
| Drinking water source | 25 |
| Water treatment method | 15 |
| Symptoms reported | 15 |
| Food storage method | 15 |
| Food cooking method | 10 |
| Handwashing habits | 10 |
| Toilet access | 10 |
| Waste disposal | 5 |
| Household size | 5 |

**Risk Classification:**
- 🟢 **Low** (0–24)
- 🟡 **Moderate** (25–49)
- 🟠 **High** (50–74)
- 🔴 **Critical** (75–100)

---

## AI Chat Assistant

The chat widget at the bottom-right corner:
- Injects **live survey analytics** into the AI's system prompt
- Supports **Gemini 1.5 Flash** (Google, free) and **Groq Llama 3.1-8b-Instant** (free)
- Falls back gracefully if no API key is configured
- Handles conversation history (last 8 messages)

---

## Production Build

```bash
npm run build
npm start
```

---

*Built with ❤️ by Team Udte Parinde for rural community health.*
