-- =============================================================================
-- Village Hub — New Modules Schema Migration (Additive, Idempotent)
-- Tables: crop_calendar, mandi_prices, weather_advisories,
--         crop_production_stats, school_info, healthcare_facilities,
--         panchayat_funds, site_settings
-- SAFE: Uses IF NOT EXISTS — will NOT drop or recreate existing tables
-- =============================================================================

-- =========================================================
-- 1. KISAN CORNER — Crop Calendar
-- =========================================================
CREATE TABLE IF NOT EXISTS public.crop_calendar (
    id BIGSERIAL PRIMARY KEY,
    crop_name TEXT NOT NULL,
    crop_season TEXT NOT NULL DEFAULT '',
    sowing_period TEXT NOT NULL DEFAULT '',
    growth_stages TEXT DEFAULT '',
    harvesting_period TEXT NOT NULL DEFAULT '',
    recommended_varieties TEXT DEFAULT '',
    estimated_yield TEXT DEFAULT '',
    advisory TEXT DEFAULT '',
    district TEXT NOT NULL DEFAULT 'All Western UP',
    reporting_year TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    source_url TEXT DEFAULT '',
    last_updated_date TEXT DEFAULT '',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_crop_calendar_crop ON public.crop_calendar(crop_name);
CREATE INDEX IF NOT EXISTS idx_crop_calendar_district ON public.crop_calendar(district);
CREATE INDEX IF NOT EXISTS idx_crop_calendar_season ON public.crop_calendar(crop_season);

DROP TRIGGER IF EXISTS trigger_set_crop_calendar_updated_at ON public.crop_calendar;
CREATE TRIGGER trigger_set_crop_calendar_updated_at
    BEFORE UPDATE ON public.crop_calendar
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 2. KISAN CORNER — Mandi Prices
-- =========================================================
CREATE TABLE IF NOT EXISTS public.mandi_prices (
    id BIGSERIAL PRIMARY KEY,
    commodity TEXT NOT NULL,
    variety TEXT DEFAULT '',
    mandi_name TEXT NOT NULL DEFAULT '',
    district TEXT NOT NULL DEFAULT '',
    min_price NUMERIC(12,2) DEFAULT NULL,
    max_price NUMERIC(12,2) DEFAULT NULL,
    modal_price NUMERIC(12,2) DEFAULT NULL,
    price_unit TEXT NOT NULL DEFAULT '₹/Quintal',
    price_date DATE DEFAULT NULL,
    source TEXT NOT NULL DEFAULT 'AGMARKNET',
    source_url TEXT DEFAULT '',
    data_type TEXT NOT NULL DEFAULT 'historical' CHECK (data_type IN ('live', 'historical', 'imported')),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_mandi_prices_commodity ON public.mandi_prices(commodity);
CREATE INDEX IF NOT EXISTS idx_mandi_prices_district ON public.mandi_prices(district);
CREATE INDEX IF NOT EXISTS idx_mandi_prices_date ON public.mandi_prices(price_date);

DROP TRIGGER IF EXISTS trigger_set_mandi_prices_updated_at ON public.mandi_prices;
CREATE TRIGGER trigger_set_mandi_prices_updated_at
    BEFORE UPDATE ON public.mandi_prices
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 3. KISAN CORNER — Weather Advisories
-- =========================================================
CREATE TABLE IF NOT EXISTS public.weather_advisories (
    id BIGSERIAL PRIMARY KEY,
    district TEXT NOT NULL DEFAULT '',
    block_name TEXT DEFAULT '',
    advisory_type TEXT NOT NULL DEFAULT 'general',
    title TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    temperature_min TEXT DEFAULT '',
    temperature_max TEXT DEFAULT '',
    rainfall_info TEXT DEFAULT '',
    warnings TEXT DEFAULT '',
    forecast_period TEXT DEFAULT '',
    source TEXT NOT NULL DEFAULT 'IMD',
    source_url TEXT DEFAULT '',
    advisory_date DATE DEFAULT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_weather_advisories_district ON public.weather_advisories(district);
CREATE INDEX IF NOT EXISTS idx_weather_advisories_date ON public.weather_advisories(advisory_date);

DROP TRIGGER IF EXISTS trigger_set_weather_advisories_updated_at ON public.weather_advisories;
CREATE TRIGGER trigger_set_weather_advisories_updated_at
    BEFORE UPDATE ON public.weather_advisories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 4. KISAN CORNER — Crop Production Statistics
-- =========================================================
CREATE TABLE IF NOT EXISTS public.crop_production_stats (
    id BIGSERIAL PRIMARY KEY,
    crop_name TEXT NOT NULL,
    agricultural_year TEXT NOT NULL DEFAULT '',
    cultivated_area TEXT DEFAULT '',
    production TEXT DEFAULT '',
    yield TEXT DEFAULT '',
    area_unit TEXT NOT NULL DEFAULT 'Hectares',
    production_unit TEXT NOT NULL DEFAULT 'Tonnes',
    yield_unit TEXT NOT NULL DEFAULT 'Kg/Hectare',
    district TEXT NOT NULL DEFAULT '',
    geographic_level TEXT NOT NULL DEFAULT 'District' CHECK (geographic_level IN ('Village', 'Block', 'District', 'State')),
    source TEXT NOT NULL DEFAULT '',
    source_url TEXT DEFAULT '',
    reporting_date TEXT DEFAULT '',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_crop_production_crop ON public.crop_production_stats(crop_name);
CREATE INDEX IF NOT EXISTS idx_crop_production_district ON public.crop_production_stats(district);
CREATE INDEX IF NOT EXISTS idx_crop_production_year ON public.crop_production_stats(agricultural_year);

DROP TRIGGER IF EXISTS trigger_set_crop_production_updated_at ON public.crop_production_stats;
CREATE TRIGGER trigger_set_crop_production_updated_at
    BEFORE UPDATE ON public.crop_production_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 5. EDUCATION & HEALTHCARE — School Info
-- =========================================================
CREATE TABLE IF NOT EXISTS public.school_info (
    id BIGSERIAL PRIMARY KEY,
    school_name TEXT DEFAULT '',
    school_type TEXT NOT NULL DEFAULT 'Government' CHECK (school_type IN ('Government', 'Private', 'Aided')),
    village TEXT DEFAULT '',
    block_name TEXT DEFAULT '',
    district TEXT NOT NULL DEFAULT '',
    total_students INTEGER DEFAULT NULL,
    boys_enrolment INTEGER DEFAULT NULL,
    girls_enrolment INTEGER DEFAULT NULL,
    total_teachers INTEGER DEFAULT NULL,
    facilities TEXT DEFAULT '',
    academic_year TEXT NOT NULL DEFAULT '',
    geographic_level TEXT NOT NULL DEFAULT 'District' CHECK (geographic_level IN ('Village', 'Gram Panchayat', 'Block', 'District', 'State')),
    govt_school_count INTEGER DEFAULT NULL,
    private_school_count INTEGER DEFAULT NULL,
    source TEXT NOT NULL DEFAULT 'UDISE+',
    source_url TEXT DEFAULT '',
    last_verified_date TEXT DEFAULT '',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_school_info_district ON public.school_info(district);
CREATE INDEX IF NOT EXISTS idx_school_info_village ON public.school_info(village);
CREATE INDEX IF NOT EXISTS idx_school_info_type ON public.school_info(school_type);

DROP TRIGGER IF EXISTS trigger_set_school_info_updated_at ON public.school_info;
CREATE TRIGGER trigger_set_school_info_updated_at
    BEFORE UPDATE ON public.school_info
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 6. EDUCATION & HEALTHCARE — Healthcare Facilities
-- =========================================================
CREATE TABLE IF NOT EXISTS public.healthcare_facilities (
    id BIGSERIAL PRIMARY KEY,
    facility_name TEXT NOT NULL DEFAULT '',
    facility_type TEXT NOT NULL DEFAULT 'PHC' CHECK (facility_type IN ('PHC', 'CHC', 'Sub-Centre', 'District Hospital', 'Government Hospital', 'Other')),
    village TEXT DEFAULT '',
    block_name TEXT DEFAULT '',
    district TEXT NOT NULL DEFAULT '',
    contact_details TEXT DEFAULT '',
    services TEXT DEFAULT '',
    doctors_count INTEGER DEFAULT NULL,
    staff_count INTEGER DEFAULT NULL,
    bed_capacity INTEGER DEFAULT NULL,
    operational_status TEXT DEFAULT 'Unknown',
    geographic_level TEXT NOT NULL DEFAULT 'District' CHECK (geographic_level IN ('Village', 'Gram Panchayat', 'Block', 'District', 'State')),
    reporting_date TEXT DEFAULT '',
    source TEXT NOT NULL DEFAULT 'UP Health Department',
    source_url TEXT DEFAULT '',
    last_verified_date TEXT DEFAULT '',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_healthcare_district ON public.healthcare_facilities(district);
CREATE INDEX IF NOT EXISTS idx_healthcare_type ON public.healthcare_facilities(facility_type);
CREATE INDEX IF NOT EXISTS idx_healthcare_village ON public.healthcare_facilities(village);

DROP TRIGGER IF EXISTS trigger_set_healthcare_updated_at ON public.healthcare_facilities;
CREATE TRIGGER trigger_set_healthcare_updated_at
    BEFORE UPDATE ON public.healthcare_facilities
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 7. PANCHAYAT FUNDS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.panchayat_funds (
    id BIGSERIAL PRIMARY KEY,
    gram_panchayat TEXT NOT NULL DEFAULT '',
    block_name TEXT NOT NULL DEFAULT '',
    district TEXT NOT NULL DEFAULT '',
    financial_year TEXT NOT NULL DEFAULT '',
    scheme_name TEXT NOT NULL DEFAULT '',
    fund_source TEXT DEFAULT '',
    sanctioned_amount NUMERIC(14,2) DEFAULT NULL,
    released_amount NUMERIC(14,2) DEFAULT NULL,
    expenditure NUMERIC(14,2) DEFAULT NULL,
    balance NUMERIC(14,2) DEFAULT NULL,
    work_name TEXT DEFAULT '',
    work_status TEXT DEFAULT '',
    physical_progress TEXT DEFAULT '',
    reporting_date TEXT DEFAULT '',
    source TEXT NOT NULL DEFAULT 'eGramSwaraj',
    source_url TEXT DEFAULT '',
    data_type TEXT NOT NULL DEFAULT 'imported' CHECK (data_type IN ('live', 'historical', 'imported')),
    original_source_value TEXT DEFAULT '',
    is_admin_edited BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_panchayat_funds_gp ON public.panchayat_funds(gram_panchayat);
CREATE INDEX IF NOT EXISTS idx_panchayat_funds_district ON public.panchayat_funds(district);
CREATE INDEX IF NOT EXISTS idx_panchayat_funds_fy ON public.panchayat_funds(financial_year);
CREATE INDEX IF NOT EXISTS idx_panchayat_funds_scheme ON public.panchayat_funds(scheme_name);

DROP TRIGGER IF EXISTS trigger_set_panchayat_funds_updated_at ON public.panchayat_funds;
CREATE TRIGGER trigger_set_panchayat_funds_updated_at
    BEFORE UPDATE ON public.panchayat_funds
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- 8. SITE SETTINGS (Logo, Branding)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT DEFAULT '',
    setting_type TEXT NOT NULL DEFAULT 'text',
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT ''
);

DROP TRIGGER IF EXISTS trigger_set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY FOR ALL NEW TABLES
-- =========================================================
ALTER TABLE public.crop_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_production_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panchayat_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for all module tables
DO $$ BEGIN
    -- Crop Calendar
    DROP POLICY IF EXISTS "crop_calendar_public_read" ON public.crop_calendar;
    CREATE POLICY "crop_calendar_public_read" ON public.crop_calendar FOR SELECT USING (true);
    DROP POLICY IF EXISTS "crop_calendar_admin_insert" ON public.crop_calendar;
    CREATE POLICY "crop_calendar_admin_insert" ON public.crop_calendar FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "crop_calendar_admin_update" ON public.crop_calendar;
    CREATE POLICY "crop_calendar_admin_update" ON public.crop_calendar FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "crop_calendar_admin_delete" ON public.crop_calendar;
    CREATE POLICY "crop_calendar_admin_delete" ON public.crop_calendar FOR DELETE USING (public.is_admin());

    -- Mandi Prices
    DROP POLICY IF EXISTS "mandi_prices_public_read" ON public.mandi_prices;
    CREATE POLICY "mandi_prices_public_read" ON public.mandi_prices FOR SELECT USING (true);
    DROP POLICY IF EXISTS "mandi_prices_admin_insert" ON public.mandi_prices;
    CREATE POLICY "mandi_prices_admin_insert" ON public.mandi_prices FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "mandi_prices_admin_update" ON public.mandi_prices;
    CREATE POLICY "mandi_prices_admin_update" ON public.mandi_prices FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "mandi_prices_admin_delete" ON public.mandi_prices;
    CREATE POLICY "mandi_prices_admin_delete" ON public.mandi_prices FOR DELETE USING (public.is_admin());

    -- Weather Advisories
    DROP POLICY IF EXISTS "weather_advisories_public_read" ON public.weather_advisories;
    CREATE POLICY "weather_advisories_public_read" ON public.weather_advisories FOR SELECT USING (true);
    DROP POLICY IF EXISTS "weather_advisories_admin_insert" ON public.weather_advisories;
    CREATE POLICY "weather_advisories_admin_insert" ON public.weather_advisories FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "weather_advisories_admin_update" ON public.weather_advisories;
    CREATE POLICY "weather_advisories_admin_update" ON public.weather_advisories FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "weather_advisories_admin_delete" ON public.weather_advisories;
    CREATE POLICY "weather_advisories_admin_delete" ON public.weather_advisories FOR DELETE USING (public.is_admin());

    -- Crop Production Stats
    DROP POLICY IF EXISTS "crop_production_public_read" ON public.crop_production_stats;
    CREATE POLICY "crop_production_public_read" ON public.crop_production_stats FOR SELECT USING (true);
    DROP POLICY IF EXISTS "crop_production_admin_insert" ON public.crop_production_stats;
    CREATE POLICY "crop_production_admin_insert" ON public.crop_production_stats FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "crop_production_admin_update" ON public.crop_production_stats;
    CREATE POLICY "crop_production_admin_update" ON public.crop_production_stats FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "crop_production_admin_delete" ON public.crop_production_stats;
    CREATE POLICY "crop_production_admin_delete" ON public.crop_production_stats FOR DELETE USING (public.is_admin());

    -- School Info
    DROP POLICY IF EXISTS "school_info_public_read" ON public.school_info;
    CREATE POLICY "school_info_public_read" ON public.school_info FOR SELECT USING (true);
    DROP POLICY IF EXISTS "school_info_admin_insert" ON public.school_info;
    CREATE POLICY "school_info_admin_insert" ON public.school_info FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "school_info_admin_update" ON public.school_info;
    CREATE POLICY "school_info_admin_update" ON public.school_info FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "school_info_admin_delete" ON public.school_info;
    CREATE POLICY "school_info_admin_delete" ON public.school_info FOR DELETE USING (public.is_admin());

    -- Healthcare Facilities
    DROP POLICY IF EXISTS "healthcare_public_read" ON public.healthcare_facilities;
    CREATE POLICY "healthcare_public_read" ON public.healthcare_facilities FOR SELECT USING (true);
    DROP POLICY IF EXISTS "healthcare_admin_insert" ON public.healthcare_facilities;
    CREATE POLICY "healthcare_admin_insert" ON public.healthcare_facilities FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "healthcare_admin_update" ON public.healthcare_facilities;
    CREATE POLICY "healthcare_admin_update" ON public.healthcare_facilities FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "healthcare_admin_delete" ON public.healthcare_facilities;
    CREATE POLICY "healthcare_admin_delete" ON public.healthcare_facilities FOR DELETE USING (public.is_admin());

    -- Panchayat Funds
    DROP POLICY IF EXISTS "panchayat_funds_public_read" ON public.panchayat_funds;
    CREATE POLICY "panchayat_funds_public_read" ON public.panchayat_funds FOR SELECT USING (true);
    DROP POLICY IF EXISTS "panchayat_funds_admin_insert" ON public.panchayat_funds;
    CREATE POLICY "panchayat_funds_admin_insert" ON public.panchayat_funds FOR INSERT WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "panchayat_funds_admin_update" ON public.panchayat_funds;
    CREATE POLICY "panchayat_funds_admin_update" ON public.panchayat_funds FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "panchayat_funds_admin_delete" ON public.panchayat_funds;
    CREATE POLICY "panchayat_funds_admin_delete" ON public.panchayat_funds FOR DELETE USING (public.is_admin());

    -- Site Settings
    DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
    CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "site_settings_admin_all" ON public.site_settings;
    CREATE POLICY "site_settings_admin_all" ON public.site_settings FOR ALL USING (public.is_admin());
END $$;

-- =========================================================
-- GRANTS (Matching existing privilege pattern)
-- =========================================================

-- Service Role (Full CRUD for backend)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.crop_calendar TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.mandi_prices TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.weather_advisories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.crop_production_stats TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.school_info TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.healthcare_facilities TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.panchayat_funds TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.site_settings TO service_role;

GRANT USAGE, SELECT ON SEQUENCE public.crop_calendar_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.mandi_prices_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.weather_advisories_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.crop_production_stats_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.school_info_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.healthcare_facilities_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.panchayat_funds_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.site_settings_id_seq TO service_role;

-- Anonymous (Public Read Only)
GRANT SELECT ON TABLE public.crop_calendar TO anon;
GRANT SELECT ON TABLE public.mandi_prices TO anon;
GRANT SELECT ON TABLE public.weather_advisories TO anon;
GRANT SELECT ON TABLE public.crop_production_stats TO anon;
GRANT SELECT ON TABLE public.school_info TO anon;
GRANT SELECT ON TABLE public.healthcare_facilities TO anon;
GRANT SELECT ON TABLE public.panchayat_funds TO anon;
GRANT SELECT ON TABLE public.site_settings TO anon;

-- Authenticated Users (Read Only for module data)
GRANT SELECT ON TABLE public.crop_calendar TO authenticated;
GRANT SELECT ON TABLE public.mandi_prices TO authenticated;
GRANT SELECT ON TABLE public.weather_advisories TO authenticated;
GRANT SELECT ON TABLE public.crop_production_stats TO authenticated;
GRANT SELECT ON TABLE public.school_info TO authenticated;
GRANT SELECT ON TABLE public.healthcare_facilities TO authenticated;
GRANT SELECT ON TABLE public.panchayat_funds TO authenticated;
GRANT SELECT ON TABLE public.site_settings TO authenticated;

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description)
VALUES ('logo_url', 'assets/logo.png', 'text', 'Main website logo image path')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description)
VALUES ('site_name', 'Village Hub', 'text', 'Website brand name')
ON CONFLICT (setting_key) DO NOTHING;
