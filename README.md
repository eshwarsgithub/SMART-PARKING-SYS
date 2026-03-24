# SafePark — Smart City Parking System 

A full-stack real-time parking management platform built for smart cities. Find, reserve, and manage parking spots with live availability updates, an interactive dark map, and a seamless booking experience.

---

## Features

### User
- **Interactive Map** — Dark-themed Leaflet map with live parking lot markers showing real-time available spot counts
- **Real-time Availability** — Spot statuses update live via Supabase Realtime (no refresh needed)
- **Quick-Book Drawer** — Book directly from the map sidebar without navigating away
- **Search & Geocoding** — Search any location in India; map pans instantly to results
- **Geolocation** — "Find Me" button centers the map on your location with distance to each lot
- **Floor Navigation** — Switch between floors in a multi-level parking lot
- **Pricing Preview** — Each spot shows the rate per hour before booking
- **My Bookings** — View, track, and cancel reservations with live status updates
- **Profile Management** — Update name, phone, and account details

### Admin
- **Dashboard** — Live stats: total bookings, revenue, occupancy rates, active users
- **Lot Management** — Add, edit, and toggle parking lots; manage spot inventory
- **Booking Overview** — Full table of all bookings with status, user, and revenue data
- **Analytics** — Revenue over time (area chart) + per-lot occupancy (bar chart)
- **Pricing Engine** — Set price-per-hour and minimum duration per lot and spot type

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom liquid-glass design system |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime (postgres_changes) |
| Map | Leaflet.js + CartoDB Dark Matter tiles |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Fonts | Instrument Serif + Barlow (Google Fonts) |
| Notifications | Sonner |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login / Sign-up page
│   ├── (user)/
│   │   ├── map/               # Interactive parking map
│   │   ├── book/[spotId]/     # Spot booking page
│   │   ├── bookings/          # My bookings list + detail
│   │   └── profile/           # User profile
│   ├── (admin)/admin/
│   │   ├── page.tsx           # Admin dashboard
│   │   ├── lots/              # Lot management
│   │   ├── bookings/          # All bookings
│   │   ├── analytics/         # Charts & revenue
│   │   └── pricing/           # Pricing rules
│   └── api/
│       ├── bookings/          # Booking CRUD API
│       ├── spots/             # Spot status API
│       └── geocode/           # Nominatim geocoding proxy
├── components/
│   ├── shared/                # Navbar, LandingNavbar, FadeIn, LoadingSpinner
│   ├── map/                   # ParkingMap, MapControls, SearchBar, QuickBookDrawer
│   ├── booking/               # BookingForm
│   └── admin/                 # StatsCard, Charts, AdminSidebar
├── hooks/
│   ├── useAuth.ts             # Auth state + profile
│   ├── useRealtimeSpots.ts    # Live spot updates
│   ├── useRealtimeLots.ts     # Live lot marker updates
│   ├── useRealtimeBookings.ts # Live booking updates
│   └── useBooking.ts          # Booking API calls
├── lib/
│   ├── supabase/              # Client, server, types
│   ├── utils.ts               # Helpers + Haversine distance
│   ├── pricing.ts             # Cost calculation
│   ├── validations.ts         # Zod schemas
│   └── constants.ts           # Map defaults, spot colors
└── middleware.ts              # Route protection (auth guard)
```

---

## Database Schema

| Table | Description |
|---|---|
| `profiles` | Extended user info (name, phone, role) |
| `parking_lots` | Lot name, address, coordinates, hours, spot counts |
| `parking_spots` | Individual spots with type, floor, status |
| `pricing_rules` | Price/hr per lot + spot type |
| `bookings` | Reservations with start/end time, vehicle plate, cost |
| `booking_events` | Audit trail of all status changes |

DB triggers automatically sync `available_spots` counts and update spot status when bookings change state (confirmed → reserved → occupied → available).

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone & Install

```bash
git clone https://github.com/eshwarsgithub/SMART-PARKING-SYS.git
cd SMART-PARKING-SYS
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up the Database

Run the SQL migrations in order via the Supabase SQL editor:

```
supabase/migrations/001_create_tables.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_functions_triggers.sql
supabase/migrations/004_seed_data.sql   ← optional: adds sample lots & spots
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Spot Types

| Type | Icon | Description |
|---|---|---|
| Standard | 🚗 | Regular car parking |
| EV Charging | ⚡ | Electric vehicle with charging |
| Accessible | ♿ | Handicap-accessible spots |
| Motorcycle | 🏍️ | Two-wheeler parking |

---

## User Roles

- **User** — Browse the map, book spots, view bookings, manage profile
- **Admin** — Full access to the admin panel: manage lots, all bookings, analytics, pricing

To grant admin access, update a user's `role` in the `profiles` table to `'admin'`.

---

## Design System

Custom **liquid glass morphism** UI:
- Pure black background (`#000`)
- `liquid-glass` — frosted glass cards with gradient border mask via CSS `::before` + mask composite
- `liquid-glass-strong` — deeper blur for panels and drawers
- **Instrument Serif** (italic) for all headings
- **Barlow** (300–600 weight) for body text
- CartoDB Dark Matter map tiles

---

## Built with ♥ by Sahithi
