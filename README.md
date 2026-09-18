# 🌍 GlobeTrotter

<div align="center">

## Intelligent Multi-City Travel Planning Platform

**Discover destinations. Build itineraries. Track budgets. Optimize trips. Share journeys.**

<p>
  <a href="https://globetrotter-app-lime.vercel.app/">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-GlobeTrotter-0A84FF?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/codebynv/GlobeTrotter">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Status-Hackathon%20Ready-success?style=for-the-badge" alt="Status">
</p>

**Odoo × LDCE Ahmedabad Hackathon 26**

</div>

---

## ✈️ What is GlobeTrotter?

Planning a multi-city trip often means switching between destination research, activity planning, calendars, budgets, and spreadsheets.

**GlobeTrotter brings that workflow into one platform.**

```text
DISCOVER
   ↓
PLAN
   ↓
OPTIMIZE
   ↓
VISUALIZE
   ↓
SHARE
```

The platform helps travelers turn multiple destinations into a structured, budget-aware and actionable journey.

---

## 🌟 Key Features

### 🔐 Authentication
- Email/password signup and login
- Persistent sessions
- Secure logout
- Protected routes
- Profile management

### 🌎 Destination Discovery
- Search cities
- Filter by region
- Explore country, popularity and cost information
- Browse curated destinations

### 🧳 Multi-City Trip Planning
- Create personalized trips
- Define start and end dates
- Set budget and currency
- Add multiple destination stops
- Edit, delete and reorder trip stops

### 🎯 Activity Planning
- Discover activities for each city
- Filter by category
- View duration and estimated cost
- Schedule activities by date and time
- Reorder or remove scheduled activities

### 🗓️ Smart Itinerary
- Day-wise organization
- City-based planning
- Chronological activity timeline
- Activity cost visibility
- Dynamic trip summaries

### 💰 Budget & Expenses
- Trip budget tracking
- Expense recording
- Category-wise breakdown
- Activity cost inclusion
- Average daily cost
- Remaining budget
- Over-budget warnings

### 📅 Calendar & Timeline
- Interactive monthly calendar
- Activity indicators
- Day-based agenda
- Timeline view
- City and activity context

### 🧠 Trip Intelligence
GlobeTrotter includes a deterministic **Trip Intelligence Engine** that evaluates the actual itinerary.

It considers:
- Budget health
- Activity density
- Travel pace
- Schedule balance
- Free vs. busy days

Example:

> ⚠️ Day 4 is overloaded with activities.

> 💡 Move one activity to a lighter day to improve the trip's pacing.

The intelligence layer is **explainable and deterministic** and does not depend on an external AI API.

### 🔗 Public Trip Sharing
- Generate public share links
- Read-only public itinerary
- Activate/deactivate sharing
- Copy-to-clipboard support
- Share without exposing private profile data

### 📋 Copy Trip
Authenticated users can copy a shared itinerary into their own account while preserving the planning structure without copying private expenses or share settings.

---

## 🧭 Complete User Journey

```text
Landing
   ↓
Signup / Login
   ↓
Dashboard
   ↓
Create Trip
   ↓
Add Cities
   ↓
Add Activities
   ↓
Build Itinerary
   ↓
Budget & Expenses
   ↓
Calendar / Timeline
   ↓
Trip Intelligence
   ↓
Share Trip
   ↓
Public Itinerary
   ↓
Copy Trip
```

---

## 🧠 Trip Intelligence

Instead of acting as a simple itinerary database, GlobeTrotter analyzes the structure of a trip.

```text
Trip Health: 86 / 100

Budget Health       ✓ Healthy
Activity Density    ⚠ High on Day 4
Travel Pace         ✓ Balanced
Schedule Balance    ✓ Good

Recommendation:
Move one activity from Day 4 to a lighter day
to improve the overall trip pace.
```

This gives users practical feedback on schedule pressure, budget health and travel pacing.

---

## 🏗️ Architecture

```text
┌───────────────────────────────┐
│          Next.js App          │
│      React + TypeScript       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Data Access Layer       │
│   Auth • Trips • Activities   │
│   Expenses • Sharing • Logic  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           Supabase            │
│      Auth + PostgreSQL        │
│          + RLS Policies       │
└───────────────────────────────┘
```

---

## 🗄️ Database Architecture

```text
profiles
   │
   └── trips
        │
        ├── trip_stops ─── cities
        │        │
        │        └── trip_activities ─── activities
        │
        ├── expenses
        │
        └── trip_shares
```

### Main Tables

| Table | Purpose |
|---|---|
| `profiles` | User profile information |
| `trips` | User-created travel plans |
| `cities` | Curated destination catalog |
| `trip_stops` | Cities included in a trip |
| `activities` | Curated activities |
| `trip_activities` | Activities scheduled within trip stops |
| `expenses` | Trip expense records |
| `trip_shares` | Public sharing tokens |

---

## 🛡️ Security

GlobeTrotter uses **Supabase Row Level Security (RLS)** to isolate user-owned data.

- Users access their own private trips.
- Private trip data is isolated between users.
- Public shared trips are intentionally read-only.
- Share tokens can be activated or deactivated.
- Copy Trip derives ownership from the authenticated session.
- Service-role credentials are not exposed to the client.
- Environment secrets are kept outside the repository through local environment files and deployment environment variables.

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### Backend / Data
- **Supabase**
- **PostgreSQL**
- **Supabase Auth**
- **Row Level Security**

### Architecture
- Next.js App Router
- Reusable component architecture
- Centralized data-access layers
- Typed database models
- Deterministic Trip Intelligence Engine

---

## 📁 Project Structure

```text
GlobeTrotter/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── dashboard/
│   │   ├── trips/
│   │   ├── explore/
│   │   ├── shared/
│   │   └── profile/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── trips/
│   │   ├── itinerary/
│   │   ├── explore/
│   │   ├── budget/
│   │   ├── calendar/
│   │   ├── sharing/
│   │   └── intelligence/
│   │
│   ├── context/
│   ├── lib/
│   │   ├── api/
│   │   ├── intelligence/
│   │   └── supabase/
│   │
│   └── types/
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Demo Dataset

The project includes curated reference data for demonstration:

- **30 cities**
- **120 activities**

The dataset supports destination discovery, activity search, itinerary construction and budget calculations.

---

## 🚀 Run Locally

### 1. Clone

```bash
git clone https://github.com/codebynv/GlobeTrotter.git
cd GlobeTrotter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

**Do not commit `.env.local`.**

### 4. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
```

---

## 🌐 Live Demo

### 🚀 Production

**https://globetrotter-app-lime.vercel.app/**

---

## 🏆 Hackathon Context

Built for the **GlobeTrotter problem statement** at the **Odoo × LDCE Ahmedabad Hackathon 26**.

The project focuses on combining:

**Real Data + Useful Intelligence + Complete Travel Workflow**

Users can move from destination discovery to itinerary creation, budgeting, optimization and sharing in one application.

---

## 📌 Project Status

**Hackathon Ready 🚀**

Core functionality implemented across:

- Authentication
- Trip CRUD
- Multi-city itinerary management
- Destination and activity discovery
- Budget and expense tracking
- Calendar and timeline
- Public trip sharing
- Copy Trip
- Trip Intelligence
- Supabase/PostgreSQL integration
- Row Level Security

---

## 👥 Team

| Role | Member |
|---|---|
| Team Leader | **Nirav Vala** |
| Team Member | **Yash Chauhan** |

---

<div align="center">

### 🌍 Plan less manually. Travel more intelligently.

**GlobeTrotter — Intelligent Multi-City Travel Planning Platform**

[🚀 Live Demo](https://globetrotter-app-lime.vercel.app/) · [📦 Repository](https://github.com/codebynv/GlobeTrotter)

</div>
