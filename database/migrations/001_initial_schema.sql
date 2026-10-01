-- ==============================================================================
-- Jan Sahayak (जनसहायक) — Authoritative Database Schema Migration 001
-- PostgreSQL + PostGIS (Geographic Intelligence) + pgvector (Semantic Search)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 2. DEPARTMENTS & REGISTRY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id VARCHAR(32) PRIMARY KEY,
    name TEXT NOT NULL,
    code VARCHAR(16),
    head_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    domains TEXT[] DEFAULT '{}',
    sla_compliance NUMERIC(5, 2) DEFAULT 92.5,
    active_officers_count INT DEFAULT 0,
    open_cases_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backward-compatible alias for existing code
CREATE OR REPLACE VIEW public.civic_departments AS SELECT * FROM public.departments;

-- ------------------------------------------------------------------------------
-- 3. USER PROFILES & ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'officer', 'civic_officer', 'dept_admin', 'super_admin')),
    department_id VARCHAR(32) REFERENCES public.departments(id) ON DELETE SET NULL,
    designation TEXT,
    zone TEXT,
    ward TEXT DEFAULT 'Ward 14 (Rohini Sector 14)',
    pincode TEXT DEFAULT '110085',
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backward-compatible alias for existing code
CREATE OR REPLACE VIEW public.civic_profiles AS SELECT * FROM public.profiles;

-- Department Users junction table for multi-officer department assignment
CREATE TABLE IF NOT EXISTS public.department_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id VARCHAR(32) NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'officer',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(department_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 4. CONTRACTORS & WARRANTIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    reg_number TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contractor_warranties (
    id VARCHAR(64) PRIMARY KEY,
    asset TEXT NOT NULL,
    contractor_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
    contractor TEXT NOT NULL,
    work_order TEXT NOT NULL,
    completion_date DATE NOT NULL,
    warranty_start DATE NOT NULL,
    warranty_end DATE NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE_WARRANTY' CHECK (status IN ('ACTIVE_WARRANTY', 'EXPIRED', 'CLAIM_IN_PROGRESS', 'VOID')),
    coverage_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.warranties AS SELECT * FROM public.contractor_warranties;

-- ------------------------------------------------------------------------------
-- 5. CIVIC INCIDENTS (Aggregated Infrastructure Failures)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.civic_incidents (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'EMERGING' CHECK (stage IN ('EMERGING', 'GROWING', 'CRITICAL', 'CONTAINED', 'RESOLVED')),
    severity TEXT NOT NULL DEFAULT 'HIGH' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    urgency TEXT NOT NULL DEFAULT 'HIGH' CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    summary TEXT,
    lead_department TEXT NOT NULL,
    participating_departments JSONB DEFAULT '[]'::jsonb,
    affected_area TEXT,
    affected_population TEXT,
    complaint_count INT NOT NULL DEFAULT 1,
    unique_citizens INT NOT NULL DEFAULT 1,
    cluster_ids JSONB DEFAULT '[]'::jsonb,
    complaint_ids JSONB DEFAULT '[]'::jsonb,
    stage_velocity TEXT,
    velocity_data JSONB DEFAULT '{}'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    root_cause JSONB DEFAULT '{}'::jsonb,
    simulations JSONB DEFAULT '[]'::jsonb,
    cross_dept_coordination JSONB DEFAULT '{}'::jsonb,
    civic_memory JSONB DEFAULT '{}'::jsonb,
    human_decisions JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    verification_status TEXT NOT NULL DEFAULT 'PENDING',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. GRIEVANCES (Individual Citizen Reports)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grievances (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    citizen_name TEXT NOT NULL DEFAULT 'Citizen',
    citizen_phone TEXT,
    title TEXT NOT NULL,
    description_raw TEXT NOT NULL,
    language_detected TEXT DEFAULT 'English / Hinglish',
    category TEXT NOT NULL,
    department TEXT NOT NULL,
    officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    officer_name TEXT,
    officer_designation TEXT,
    location_ward TEXT NOT NULL,
    location_area TEXT NOT NULL,
    location_city TEXT DEFAULT 'New Delhi',
    location_pincode TEXT DEFAULT '110085',
    geom GEOMETRY(Point, 4326),
    geog GEOGRAPHY(Point, 4326),
    urgency TEXT NOT NULL DEFAULT 'HIGH',
    urgency_score INT NOT NULL DEFAULT 80,
    status TEXT NOT NULL DEFAULT 'REPORTED',
    sla_deadline TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    sla_hours_left INT DEFAULT 24,
    upvotes INT NOT NULL DEFAULT 1,
    cluster_id TEXT,
    cluster_title TEXT,
    cluster_count INT DEFAULT 1,
    incident_id VARCHAR(64) REFERENCES public.civic_incidents(id) ON DELETE SET NULL,
    analysis JSONB DEFAULT '{}'::jsonb,
    dna JSONB DEFAULT '{}'::jsonb,
    evidence JSONB DEFAULT '{}'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    resolution_notes TEXT,
    resolution_photo_url TEXT,
    citizen_verification JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. COMPLAINT DNA & VECTOR EMBEDDINGS (pgvector 768-dimensional)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_dna (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(64) NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    problem_type TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    infrastructure TEXT NOT NULL DEFAULT 'Municipal Infrastructure',
    affected_population TEXT DEFAULT 'Local Residents',
    severity INT NOT NULL DEFAULT 5,
    urgency_score INT NOT NULL DEFAULT 50,
    normalized_description TEXT NOT NULL,
    landmarks JSONB DEFAULT '[]'::jsonb,
    entities JSONB DEFAULT '[]'::jsonb,
    temporal_signals JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(768),
    confidence NUMERIC(4, 3) DEFAULT 0.900,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(complaint_id)
);

-- ------------------------------------------------------------------------------
-- 8. INCIDENT COMPLAINTS (Relational Linkage)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incident_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id VARCHAR(64) NOT NULL REFERENCES public.civic_incidents(id) ON DELETE CASCADE,
    complaint_id VARCHAR(64) NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    similarity_score NUMERIC(4, 3) DEFAULT 0.850,
    correlation_reason TEXT,
    distance_meters INT,
    linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(incident_id, complaint_id)
);

-- ------------------------------------------------------------------------------
-- 9. FIELD ACTIONS (Officer Operations & On-Ground Remediation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.field_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id VARCHAR(64) REFERENCES public.civic_incidents(id) ON DELETE SET NULL,
    grievance_id VARCHAR(64) REFERENCES public.grievances(id) ON DELETE SET NULL,
    officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    officer_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED')),
    notes TEXT,
    evidence_url TEXT,
    before_photo_url TEXT,
    after_photo_url TEXT,
    gps_lat NUMERIC(9, 6),
    gps_lng NUMERIC(9, 6),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. CITIZEN VERIFICATION RECORDS (Closed-Loop Validation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grievance_id VARCHAR(64) REFERENCES public.grievances(id) ON DELETE SET NULL,
    incident_id VARCHAR(64) REFERENCES public.civic_incidents(id) ON DELETE SET NULL,
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    citizen_name TEXT,
    status TEXT NOT NULL CHECK (status IN ('CONFIRMED', 'DISPUTED', 'PENDING')),
    feedback TEXT,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    photo_url TEXT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. INCIDENT STATUS TRANSITION HISTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incident_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id VARCHAR(64) NOT NULL,
    grievance_id VARCHAR(64),
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    reason TEXT,
    trigger TEXT DEFAULT 'OPERATIONAL_ACTION',
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL DEFAULT 'System',
    actor_role TEXT NOT NULL DEFAULT 'SYSTEM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. AUDIT LOGS (Immutable Application Ledger)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL DEFAULT 'SYSTEM',
    action TEXT NOT NULL,
    target_id TEXT,
    details TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. NOTIFICATIONS (Role-Aware Persistent Alerts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_role TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    grievance_id VARCHAR(64),
    incident_id VARCHAR(64),
    link TEXT,
    type TEXT NOT NULL DEFAULT 'GENERAL',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. EVIDENCE RECORDS & ATTACHMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evidence_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(64) REFERENCES public.grievances(id) ON DELETE SET NULL,
    incident_id VARCHAR(64) REFERENCES public.civic_incidents(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('PHOTO', 'VIDEO', 'AUDIO', 'DOCUMENT')),
    storage_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT DEFAULT 'image/jpeg',
    file_size_bytes BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.attachments AS SELECT * FROM public.evidence_records;

-- ------------------------------------------------------------------------------
-- 15. CIVIC MEMORY / RAG KNOWLEDGE BASE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.civic_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_title TEXT NOT NULL,
    category TEXT NOT NULL,
    department TEXT NOT NULL,
    root_cause TEXT NOT NULL,
    resolution_applied TEXT NOT NULL,
    contractor TEXT,
    warranty_period TEXT,
    recurrence_rate TEXT DEFAULT 'LOW',
    cost_estimate NUMERIC(12, 2) DEFAULT 0,
    embedding VECTOR(768),
    sop_code TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.civic_knowledge AS SELECT * FROM public.civic_memory;

-- ------------------------------------------------------------------------------
-- 16. RESOLUTION OPTIONS & SIMULATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resolution_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id VARCHAR(64) NOT NULL REFERENCES public.civic_incidents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'HIGH',
    estimated_cost TEXT,
    estimated_time TEXT,
    required_department TEXT,
    required_resources TEXT[] DEFAULT '{}',
    recurrence_risk TEXT DEFAULT 'LOW',
    expected_impact TEXT,
    confidence NUMERIC(4, 3) DEFAULT 0.850,
    verification_required BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'ACCEPTED', 'MODIFIED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. CIVIC SIGNALS (Raw Multimodal Signal Stream)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.civic_signals (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES public.civic_incidents(id) ON DELETE SET NULL,
    citizen_name TEXT NOT NULL,
    ward TEXT NOT NULL,
    channel TEXT NOT NULL,
    raw_input TEXT NOT NULL,
    translated_text TEXT,
    category TEXT NOT NULL,
    inferred_asset TEXT,
    has_photo BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    geom GEOMETRY(Point, 4326),
    geog GEOGRAPHY(Point, 4326),
    status TEXT DEFAULT 'CLUSTERED',
    confidence TEXT DEFAULT 'HIGH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. POSTGIS & PGVECTOR INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_grievances_geom ON public.grievances USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_grievances_geog ON public.grievances USING GIST(geog);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON public.grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_department ON public.grievances(department);
CREATE INDEX IF NOT EXISTS idx_grievances_citizen_id ON public.grievances(citizen_id);
CREATE INDEX IF NOT EXISTS idx_grievances_incident_id ON public.grievances(incident_id);

CREATE INDEX IF NOT EXISTS idx_civic_incidents_status ON public.civic_incidents(status);
CREATE INDEX IF NOT EXISTS idx_civic_incidents_lead_dept ON public.civic_incidents(lead_department);

CREATE INDEX IF NOT EXISTS idx_complaint_dna_complaint_id ON public.complaint_dna(complaint_id);
-- HNSW vector similarity index for 768-dim embeddings using cosine distance
CREATE INDEX IF NOT EXISTS idx_complaint_dna_embedding ON public.complaint_dna USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_civic_memory_embedding ON public.civic_memory USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_status_history_incident_id ON public.incident_status_history(incident_id);

-- ------------------------------------------------------------------------------
-- 19. POSTGIS SPATIAL FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_nearby_complaints(
    query_lat DOUBLE PRECISION,
    query_lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 1500
)
RETURNS TABLE (
    id VARCHAR,
    title TEXT,
    category TEXT,
    department TEXT,
    urgency TEXT,
    status TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        g.id,
        g.title,
        g.category,
        g.department,
        g.urgency,
        g.status,
        ST_Y(g.geom::geometry) AS lat,
        ST_X(g.geom::geometry) AS lng,
        ST_Distance(
            g.geog,
            ST_SetSRID(ST_MakePoint(query_lng, query_lat), 4326)::geography
        ) AS distance_meters
    FROM public.grievances g
    WHERE ST_DWithin(
        g.geog,
        ST_SetSRID(ST_MakePoint(query_lng, query_lat), 4326)::geography,
        radius_meters
    )
    ORDER BY distance_meters ASC
    LIMIT 50;
$$;

-- ------------------------------------------------------------------------------
-- 20. PGVECTOR SEMANTIC SIMILARITY FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_similar_complaints(
    query_embedding VECTOR(768),
    match_threshold DOUBLE PRECISION DEFAULT 0.70,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    complaint_id VARCHAR,
    problem_type TEXT,
    category TEXT,
    normalized_description TEXT,
    similarity DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        d.complaint_id,
        d.problem_type,
        d.category,
        d.normalized_description,
        1 - (d.embedding <=> query_embedding) AS similarity
    FROM public.complaint_dna d
    WHERE d.embedding IS NOT NULL
      AND 1 - (d.embedding <=> query_embedding) >= match_threshold
    ORDER BY d.embedding <=> query_embedding ASC
    LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION public.search_civic_memory(
    query_embedding VECTOR(768),
    match_threshold DOUBLE PRECISION DEFAULT 0.65,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    incident_title TEXT,
    category TEXT,
    department TEXT,
    root_cause TEXT,
    resolution_applied TEXT,
    contractor TEXT,
    similarity DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        m.id,
        m.incident_title,
        m.category,
        m.department,
        m.root_cause,
        m.resolution_applied,
        m.contractor,
        1 - (m.embedding <=> query_embedding) AS similarity
    FROM public.civic_memory m
    WHERE m.embedding IS NOT NULL
      AND 1 - (m.embedding <=> query_embedding) >= match_threshold
    ORDER BY m.embedding <=> query_embedding ASC
    LIMIT match_count;
$$;

-- ------------------------------------------------------------------------------
-- 21. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile; admins can read all
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'civic_officer', 'dept_admin')
    ));

-- Grievances: citizens can read/write their own; officers and admins can read all
DROP POLICY IF EXISTS "Citizens can view own grievances" ON public.grievances;
CREATE POLICY "Citizens can view own grievances" ON public.grievances
    FOR SELECT USING (
        auth.uid() = citizen_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('officer', 'civic_officer', 'dept_admin', 'super_admin'))
    );

DROP POLICY IF EXISTS "Citizens can insert grievances" ON public.grievances;
CREATE POLICY "Citizens can insert grievances" ON public.grievances
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications: users can read and update their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (
        auth.uid() = user_id OR 
        user_role = 'all' OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = user_role)
    );

-- Audit logs: append-only from service role / authenticated system
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );
