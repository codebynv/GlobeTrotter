# 🌍 GlobeTrotter

### Intelligent Multi-City Travel Planning Platform

GlobeTrotter is a personalized travel planning platform designed to help travelers **discover destinations, build multi-city itineraries, manage activities, track expenses, visualize schedules, and share trips** from one place.

Built for the **Odoo × LDCE Ahmedabad Hackathon 26**, GlobeTrotter goes beyond basic itinerary creation with a deterministic **Trip Intelligence Engine** that analyzes budget, activity density, travel pace, and schedule balance to provide actionable recommendations.

---

## ✨ Why GlobeTrotter?

Traditional travel planners often make users manually piece together cities, activities, schedules, and budgets.

GlobeTrotter combines those tasks into one workflow:

**Discover → Plan → Optimize → Visualize → Share**

The platform can also evaluate whether a planned trip is actually practical instead of simply storing the itinerary.

---

## 🚀 Key Features

### 🔐 Authentication

* Email/password signup and login
* Persistent sessions
* Secure logout
* Protected user routes
* Profile management

### ✈️ Multi-City Trip Planning

* Create personalized trips
* Define start/end dates
* Set budget and currency
* Add multiple destination stops
* Edit and delete trips
* Reorder destinations

### 🏙️ Destination Discovery

* Search cities
* Filter by region
* View country, popularity and cost index
* Explore curated destinations

### 🎯 Activity Planning

* Discover activities for each city
* Filter by category
* View duration and estimated cost
* Schedule activities by date and time
* Reorder/remove scheduled activities

### 🗓️ Smart Itinerary

* Day-wise itinerary
* City-based organization
* Activity time and cost visibility
* Chronological timeline
* Dynamic trip summaries

### 💰 Budget & Expenses

* Trip budget tracking
* Expense recording
* Category-wise breakdown
* Activity cost inclusion
* Average daily cost
* Remaining budget
* Over-budget warnings

### 📅 Calendar & Timeline

* Interactive monthly calendar
* Activity indicators
* Day-based agenda
* Timeline view
* City and activity context

### 🧠 Trip Intelligence ⭐

GlobeTrotter analyzes real trip data and generates a deterministic **Trip Health Score (0–100)**.

It evaluates:

* Budget health
* Activity density
* Travel pace
* Schedule balance
* Free vs. busy days

It can also generate actionable recommendations such as:

> ⚠️ Day 4 is overloaded with activities.

> 💡 Move an activity to a lighter day to improve the trip's pacing.

The intelligence layer is explainable and does not depend on an external AI API.

### 🔗 Public Trip Sharing

* Generate public share links
* Read-only public itinerary
* Active/inactive share control
* Copy-to-clipboard support
* Share trips without exposing private profile data

### 📋 Copy Trip

Authenticated users can copy a shared itinerary into their own trips while preserving the planning structure without copying private expenses or share settings.

---

## 🏗️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**

### Backend / Data

* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Row Level Security (RLS)**

### Architecture

* Next.js App Router
* Reusable component architecture
* Centralized data-access layers
* Typed database models
* Deterministic trip intelligence engine

---

## 🗄️ Database Architecture

GlobeTrotter uses a relational PostgreSQL database.

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

| Table             | Purpose                                |
| ----------------- | -------------------------------------- |
| `profiles`        | User profile information               |
| `trips`           | User-created travel plans              |
| `cities`          | Curated destination catalog            |
| `trip_stops`      | Cities included in a trip              |
| `activities`      | Curated activities                     |
| `trip_activities` | Activities scheduled within trip stops |
| `expenses`        | Trip expense records                   |
| `trip_shares`     | Public sharing tokens                  |

---

## 🛡️ Security

GlobeTrotter uses Supabase Row Level Security to protect user-owned data.

* Users can access their own private trips.
* Private trip data is isolated between users.
* Public shared trips are read-only.
* Share tokens can be activated/deactivated.
* Copy Trip derives ownership from the authenticated session.
* No service-role credentials are exposed to the client.

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

* **30 cities**
* **120 activities**

The data supports destination discovery, activity search, itinerary construction, and budget calculations.

---

## ⚙️ Getting Started

### 1. Clone the repository

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

Do not commit `.env.local`.

### 4. Run the development server

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

## 🧭 Core User Flow

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

## 🧠 Trip Intelligence Example

A typical analysis can look like:

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

---

## 🎯 Hackathon Focus

GlobeTrotter was designed around three principles:

**1. Real data**
Trips, destinations, activities, expenses and sharing are backed by a relational PostgreSQL database.

**2. Useful intelligence**
The platform evaluates the actual itinerary instead of relying on a generic chatbot response.

**3. Complete travel workflow**
Users can go from destination discovery to itinerary creation, budgeting, optimization, and sharing in one application.

---

## 📌 Project Status

**Hackathon Ready 🚀**

Core functionality implemented and verified, including:

* Authentication
* Trip CRUD
* Multi-city itinerary management
* Destination/activity discovery
* Budget and expense tracking
* Calendar/timeline
* Public sharing
* Copy Trip
* Trip Intelligence
* Supabase/PostgreSQL integration
* Row Level Security

---

## 👥 Team

**GlobeTrotter — Odoo × LDCE Ahmedabad Hackathon 26**

**Team Leader:** Nirav Vala
**Team Member:** Yash Chauhan

---

## 📄 Challenge

Built for the **GlobeTrotter** problem statement of the Odoo × LDCE Ahmedabad Hackathon 26.
