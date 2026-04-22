# 🚀 Yojna Saathi — Next.js PWA

> Discover, understand, and apply for 3500+ Indian government schemes in your own language.

A modern Progressive Web App built with Next.js 15, Neon PostgreSQL, and Google Gemini AI.

## ✨ Features

- **🌐 Multilingual**: Supports 11 Indian languages (Hindi, Tamil, Telugu, Bengali, etc.)
- **🤖 AI Chatbot**: Gemini-powered chatbot with voice input/output
- **📱 PWA**: Install on any device, works offline
- **🔍 Smart Search**: Full-text search across 3500+ schemes
- **🎯 Filters**: Category, level, benefit type filtering
- **⚡ Serverless**: No separate backend needed — Next.js API Routes
- **🔒 Secure**: API keys never exposed to browser
- **🎨 Premium UI**: Glassmorphism, micro-animations, responsive design

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | Full-stack framework (App Router) |
| Neon PostgreSQL | Serverless database |
| Google Gemini AI | Chatbot intelligence |
| TailwindCSS v4 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |

## 📦 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Edit `.env.local` with your credentials:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Set Up Neon Database
1. Create a new project on [Neon Console](https://console.neon.tech)
2. Copy the connection string to `DATABASE_URL` in `.env.local`
3. Run the schema in Neon SQL Editor:
   - Open `database/schema.sql`
   - Copy and paste into Neon's SQL Editor
   - Execute to create tables and indexes

### 4. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `GEMINI_API_KEY` in `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.js          # Gemini AI (server-side, secure!)
│   │   └── schemes/
│   │       ├── route.js           # List/filter schemes
│   │       ├── [id]/route.js      # Get scheme by ID
│   │       ├── search/route.js    # Full-text search
│   │       └── summary/route.js   # Category counts
│   ├── chat/page.js               # Full-page chatbot
│   ├── offline/page.js            # Offline fallback
│   ├── schemes/
│   │   ├── page.js                # Browse schemes
│   │   └── [id]/page.js           # Scheme details
│   ├── layout.js                  # Root layout + PWA meta
│   ├── page.js                    # Home page
│   └── globals.css                # Design system
├── components/
│   ├── Navbar.jsx                 # Navigation bar
│   ├── Footer.jsx                 # Footer
│   ├── YojnaSaathi.jsx            # AI Chatbot widget
│   └── PWAInstallPrompt.jsx       # PWA install banner
├── data/
│   └── schemesData.js             # Chatbot schemes data
└── lib/
    └── db.js                      # Neon DB connection
```

## 🚀 Deployment on Cloudflare Pages

### Option 1: Git Integration
1. Push to GitHub
2. Connect repo in Cloudflare Pages Dashboard
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variables in Cloudflare dashboard

### Option 2: Direct Upload
```bash
npm run build
npx wrangler pages deploy .next
```

## 🔐 Environment Variables

| Variable | Description | Where to get |
|----------|-------------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string | [Neon Console](https://console.neon.tech) |
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |

## 📱 PWA Features

- ✅ Installable on mobile and desktop
- ✅ Offline fallback page
- ✅ Custom app icon
- ✅ Service worker caching
- ✅ Add to home screen prompt

---

**Yojna Saathi** — Empowering citizens with accessible, multilingual government scheme assistance! 🇮🇳
