-- =============================================================================
-- Village Hub — Least-Privilege Database Permissions Migration
-- Migration: 20261015000001_fix_permissions.sql
-- =============================================================================

-- 1. Schema Usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Backend Service Role (Full CRUD for backend operations & migrations)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.villages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.complaints TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.applications TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.villages_id_seq TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.set_current_timestamp_updated_at() TO service_role;

-- 3. Anonymous / Public Role (Strict Least Privilege)
-- Villages: public directory read-only
GRANT SELECT ON TABLE public.villages TO anon;
-- Complaints: anyone can submit and track
GRANT INSERT, SELECT ON TABLE public.complaints TO anon;
-- Applications: anyone can submit, but CANNOT view or manage
GRANT INSERT ON TABLE public.applications TO anon;
-- No privileges on public.profiles for anon

-- 4. Authenticated Normal Users (Strict Least Privilege)
-- Profiles: can only read and update own profile (RLS blocks role changes)
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
-- Villages: read-only
GRANT SELECT ON TABLE public.villages TO authenticated;
-- Complaints: submit and track
GRANT INSERT, SELECT ON TABLE public.complaints TO authenticated;
-- Applications: submit only (applications remain private to admin)
GRANT INSERT ON TABLE public.applications TO authenticated;

-- Routine execution for RLS policy checks
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_current_timestamp_updated_at() TO authenticated;
