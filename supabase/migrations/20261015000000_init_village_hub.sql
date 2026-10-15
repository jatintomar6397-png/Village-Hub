-- =============================================================================
-- Village Hub — Supabase PostgreSQL Schema & Security Migration
-- Tables: profiles, villages, complaints, applications
-- Row Level Security (RLS) & Policies included
-- =============================================================================

-- Enable pgcrypto extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Profiles Table (Linked to Supabase Auth auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- -----------------------------------------------------------------------------
-- 2. Villages Table (46 Western UP census villages)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.villages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil TEXT NOT NULL DEFAULT '',
    population TEXT NOT NULL DEFAULT '0',
    problems TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Under Assessment' CHECK (status IN ('Completed', 'In Progress', 'Under Assessment')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    latitude NUMERIC(10, 6) NOT NULL DEFAULT 28.65,
    longitude NUMERIC(10, 6) NOT NULL DEFAULT 77.65,
    schools INTEGER NOT NULL DEFAULT 0,
    hospitals INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_villages_name_district UNIQUE (name, district)
);

CREATE INDEX IF NOT EXISTS idx_villages_district ON public.villages(district);
CREATE INDEX IF NOT EXISTS idx_villages_status ON public.villages(status);
CREATE INDEX IF NOT EXISTS idx_villages_name ON public.villages(name);

DROP TRIGGER IF EXISTS trigger_set_villages_updated_at ON public.villages;
CREATE TRIGGER trigger_set_villages_updated_at
    BEFORE UPDATE ON public.villages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Complaints Table (Citizen Grievances & Live Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil TEXT NOT NULL DEFAULT '',
    village TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image TEXT,
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_complaints_complaint_id ON public.complaints(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaints_phone ON public.complaints(phone);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);

DROP TRIGGER IF EXISTS trigger_set_complaints_updated_at ON public.complaints;
CREATE TRIGGER trigger_set_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Applications Table (Volunteers, Youth Leaders, CSR Sponsors)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    village TEXT NOT NULL,
    requested_role TEXT NOT NULL DEFAULT 'Volunteer',
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_village ON public.applications(village);

DROP TRIGGER IF EXISTS trigger_set_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_set_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =============================================================================
-- Row Level Security (RLS) Configuration
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an administrator?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- RLS Policies: Profiles
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile name" ON public.profiles;
CREATE POLICY "Users can update own profile name"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS Policies: Villages (Public directory read, Admin write)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Villages are publicly viewable" ON public.villages;
CREATE POLICY "Villages are publicly viewable"
    ON public.villages FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert villages" ON public.villages;
CREATE POLICY "Admins can insert villages"
    ON public.villages FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update villages" ON public.villages;
CREATE POLICY "Admins can update villages"
    ON public.villages FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete villages" ON public.villages;
CREATE POLICY "Admins can delete villages"
    ON public.villages FOR DELETE
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS Policies: Complaints
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit complaints" ON public.complaints;
CREATE POLICY "Anyone can submit complaints"
    ON public.complaints FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Track complaints by query or user ownership" ON public.complaints;
CREATE POLICY "Track complaints by query or user ownership"
    ON public.complaints FOR SELECT
    USING (
        auth.uid() = user_id
        OR public.is_admin()
        OR auth.uid() IS NULL -- allows public lookup through backend/tracking API
    );

DROP POLICY IF EXISTS "Admins can update complaint status" ON public.complaints;
CREATE POLICY "Admins can update complaint status"
    ON public.complaints FOR UPDATE
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS Policies: Applications
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit volunteer applications" ON public.applications;
CREATE POLICY "Anyone can submit volunteer applications"
    ON public.applications FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view applications" ON public.applications;
CREATE POLICY "Admins can view applications"
    ON public.applications FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update application status" ON public.applications;
CREATE POLICY "Admins can update application status"
    ON public.applications FOR UPDATE
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- Table & Sequence Privileges (Strict Least Privilege)
-- PostgREST requires table-level privileges before RLS is evaluated.
-- service_role has BYPASSRLS attribute, while anon and authenticated are restricted by RLS.
-- -----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Service Role (Full CRUD for backend server & migrations)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.villages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.complaints TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.applications TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.villages_id_seq TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.set_current_timestamp_updated_at() TO service_role;

-- Anonymous / Public
GRANT SELECT ON TABLE public.villages TO anon;
GRANT INSERT, SELECT ON TABLE public.complaints TO anon;
GRANT INSERT ON TABLE public.applications TO anon;

-- Authenticated Users
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.villages TO authenticated;
GRANT INSERT, SELECT ON TABLE public.complaints TO authenticated;
GRANT INSERT ON TABLE public.applications TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_current_timestamp_updated_at() TO authenticated;


