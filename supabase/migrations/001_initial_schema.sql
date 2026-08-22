-- ============================================================================
-- GlobeTrotter PostgreSQL Database Schema (Supabase Migration 001)
-- ============================================================================

-- Enable pgcrypto for UUID generator and helper functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Helper function for updating 'updated_at' timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. Profiles Table (Linked to auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for profiles updated_at
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 3. Cities Table (Public Reference Data)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  description TEXT,
  image_url TEXT,
  cost_index NUMERIC(5, 2) DEFAULT 1.00 CHECK (cost_index >= 0),
  popularity_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (popularity_score >= 0 AND popularity_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cities_country_name ON public.cities(country, name);

-- ----------------------------------------------------------------------------
-- 4. Trips Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_image_url TEXT,
  budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_trip_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON public.trips(is_public);

-- Trigger for trips updated_at
CREATE TRIGGER trg_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 5. Trip Stops Table (Multi-City Route Stops with Ordering)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  stop_order INTEGER NOT NULL CHECK (stop_order >= 1),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_stop_dates CHECK (end_date >= start_date),
  CONSTRAINT unique_trip_stop_order UNIQUE (trip_id, stop_order)
);

CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON public.trip_stops(city_id);

-- ----------------------------------------------------------------------------
-- 6. Activities Table (City Curated Activities)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (estimated_cost >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_city_id ON public.activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);

-- ----------------------------------------------------------------------------
-- 7. Trip Activities Table (Activities scheduled in specific Trip Stops)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  activity_date DATE,
  start_time TIME,
  end_time TIME,
  activity_order INTEGER NOT NULL DEFAULT 1 CHECK (activity_order >= 1),
  notes TEXT,
  actual_cost NUMERIC(10, 2) CHECK (actual_cost >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON public.trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_activity_id ON public.trip_activities(activity_id);

-- ----------------------------------------------------------------------------
-- 8. Expenses Table (Budget and Expense Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- ----------------------------------------------------------------------------
-- 9. Trip Shares Table (Public Share Tokens)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trip_shares_token ON public.trip_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_trip_shares_trip_id ON public.trip_shares(trip_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_shares ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Profiles Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- Cities Policies (Public Reference Data)
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can view cities"
  ON public.cities FOR SELECT
  USING (true);

-- ----------------------------------------------------------------------------
-- Activities Policies (Public Reference Data)
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can view activities"
  ON public.activities FOR SELECT
  USING (true);

-- ----------------------------------------------------------------------------
-- Trips Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own or public or shared trips"
  ON public.trips FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_public = true
    OR EXISTS (
      SELECT 1 FROM public.trip_shares
      WHERE trip_shares.trip_id = trips.id
        AND trip_shares.is_active = true
        AND (trip_shares.expires_at IS NULL OR trip_shares.expires_at > now())
    )
  );

CREATE POLICY "Users can insert own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Trip Stops Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view stops for accessible trips"
  ON public.trip_stops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_stops.trip_id
        AND (
          trips.user_id = auth.uid()
          OR trips.is_public = true
          OR EXISTS (
            SELECT 1 FROM public.trip_shares
            WHERE trip_shares.trip_id = trips.id
              AND trip_shares.is_active = true
              AND (trip_shares.expires_at IS NULL OR trip_shares.expires_at > now())
          )
        )
    )
  );

CREATE POLICY "Users can manage stops for own trips"
  ON public.trip_stops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Trip Activities Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view activities for accessible trips"
  ON public.trip_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops
      JOIN public.trips ON trips.id = trip_stops.trip_id
      WHERE trip_stops.id = trip_activities.trip_stop_id
        AND (
          trips.user_id = auth.uid()
          OR trips.is_public = true
          OR EXISTS (
            SELECT 1 FROM public.trip_shares
            WHERE trip_shares.trip_id = trips.id
              AND trip_shares.is_active = true
              AND (trip_shares.expires_at IS NULL OR trip_shares.expires_at > now())
          )
        )
    )
  );

CREATE POLICY "Users can manage activities for own trips"
  ON public.trip_activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops
      JOIN public.trips ON trips.id = trip_stops.trip_id
      WHERE trip_stops.id = trip_activities.trip_stop_id AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_stops
      JOIN public.trips ON trips.id = trip_stops.trip_id
      WHERE trip_stops.id = trip_activities.trip_stop_id AND trips.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Expenses Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view expenses for accessible trips"
  ON public.expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id
        AND (
          trips.user_id = auth.uid()
          OR trips.is_public = true
          OR EXISTS (
            SELECT 1 FROM public.trip_shares
            WHERE trip_shares.trip_id = trips.id
              AND trip_shares.is_active = true
              AND (trip_shares.expires_at IS NULL OR trip_shares.expires_at > now())
          )
        )
    )
  );

CREATE POLICY "Users can manage expenses for own trips"
  ON public.expenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Trip Shares Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view share tokens for own or active shared trips"
  ON public.trip_shares FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_shares.trip_id AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage share tokens for own trips"
  ON public.trip_shares FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_shares.trip_id AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_shares.trip_id AND trips.user_id = auth.uid()
    )
  );
