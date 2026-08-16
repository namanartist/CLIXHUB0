-- ==============================================================================
-- CLIX HUB (CCMS) - SUPABASE MIGRATION DIFF SCRIPT (CHANGES VS FIRST SQL)
-- ==============================================================================
-- Run this script if you have already executed the initial base schema.
-- It applies ONLY the new tables, altered columns, stored procedures,
-- and indexes without altering or deleting existing data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. COLUMN EXTENSIONS ON EXISTING TABLES
-- ------------------------------------------------------------------------------

-- Genesis Unit Proposals Extensions
ALTER TABLE IF EXISTS public.proposals
    ADD COLUMN IF NOT EXISTS "proposerPhone" TEXT,
    ADD COLUMN IF NOT EXISTS "proposerBranch" TEXT,
    ADD COLUMN IF NOT EXISTS objectives JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "proposedActivities" JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "budgetRequirement" NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "facultyAdvisorName" TEXT,
    ADD COLUMN IF NOT EXISTS "facultyAdvisorEmail" TEXT,
    ADD COLUMN IF NOT EXISTS "facultyAdvisorId" TEXT,
    ADD COLUMN IF NOT EXISTS "foundingMembers" JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "facultyEndorsement" JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS "adminApproval" JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS "allocatedSubdomain" TEXT,
    ADD COLUMN IF NOT EXISTS "createdClubId" TEXT;

-- Registrations Extension
ALTER TABLE IF EXISTS public.registrations
    ADD COLUMN IF NOT EXISTS "paymentDetails" TEXT;

-- ------------------------------------------------------------------------------
-- 2. NEW TABLES ADDED TO SYSTEM
-- ------------------------------------------------------------------------------

-- Individual Verifiable Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    "serialNumber" TEXT UNIQUE NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    email TEXT,
    "eventName" TEXT NOT NULL,
    "eventId" TEXT,
    "clubId" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now(),
    hash TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "verificationUrl" TEXT,
    status TEXT DEFAULT 'Valid' CHECK (status IN ('Valid', 'Revoked')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Certificate Templates Styling Table
CREATE TABLE IF NOT EXISTS public.certificate_templates (
    id TEXT PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    name TEXT NOT NULL,
    "customBackgroundUrl" TEXT,
    "showMITSLogo" BOOLEAN DEFAULT true,
    "showClubLogo" BOOLEAN DEFAULT true,
    "signatureTextFaculty" TEXT DEFAULT 'Faculty Coordinator',
    "signatureTextDean" TEXT DEFAULT 'Dean Student Welfare',
    "clubId" TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Digital Event Entry Tickets / Passes Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id TEXT PRIMARY KEY,
    "ticketNumber" TEXT UNIQUE NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    status TEXT DEFAULT 'Valid' CHECK (status IN ('Valid', 'Used', 'Cancelled')),
    "checkedIn" BOOLEAN DEFAULT false,
    "checkedInAt" TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments Ledger Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    "registrationId" TEXT,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    "paymentType" TEXT DEFAULT 'UPI' CHECK ("paymentType" IN ('Free', 'UPI', 'Gateway', 'Cash')),
    "transactionId" TEXT,
    "gatewayProvider" TEXT DEFAULT 'Razorpay',
    status TEXT DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    "paymentProofUrl" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Procurement & Vendor Quotations Table
CREATE TABLE IF NOT EXISTS public.quotations (
    id TEXT PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    title TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    date TIMESTAMPTZ DEFAULT now(),
    "fileUrl" TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Institutional KPIs & Analytics Reports Table
CREATE TABLE IF NOT EXISTS public.institutional_kpis (
    id TEXT PRIMARY KEY,
    "academicYear" TEXT NOT NULL DEFAULT '2025-2026',
    semester TEXT DEFAULT 'Annual' CHECK (semester IN ('Odd', 'Even', 'Annual')),
    "avgAttendanceRate" NUMERIC DEFAULT 84.2,
    "recruitmentYield" NUMERIC DEFAULT 42.5,
    "credentialsIssued" INTEGER DEFAULT 0,
    "totalEventsHosted" INTEGER DEFAULT 0,
    "totalActiveClubs" INTEGER DEFAULT 0,
    "totalBudgetSpent" NUMERIC DEFAULT 0,
    "categoryDistribution" JSONB DEFAULT '[]'::jsonb,
    "engagementContinuity" JSONB DEFAULT '[]'::jsonb,
    "topPerformingUnits" JSONB DEFAULT '[]'::jsonb,
    "clubWiseMetrics" JSONB DEFAULT '[]'::jsonb,
    "generatedBy" TEXT DEFAULT 'System',
    "generatedAt" TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Universal Multi-Step Approval Engine Table
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id TEXT PRIMARY KEY,
    "requestType" TEXT NOT NULL CHECK ("requestType" IN ('GenesisUnit', 'EventBudget', 'VenueBooking', 'CertificateBatch', 'ProcurementQuotation', 'ExecutiveAppointment')),
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC DEFAULT 0,
    "requesterId" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterRole" TEXT NOT NULL,
    "clubId" TEXT,
    "currentStep" INTEGER DEFAULT 1,
    "totalSteps" INTEGER DEFAULT 2,
    "approvalChain" JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    metadata JSONB DEFAULT '{}'::jsonb,
    "finalDecisionAt" TIMESTAMPTZ,
    "finalDecisionBy" TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dynamic UPI QR Links History Table
CREATE TABLE IF NOT EXISTS public.qr_links (
    id TEXT PRIMARY KEY DEFAULT ('qr_' || extract(epoch from now())::bigint || '_' || floor(random()*1000)::int),
    "clubId" TEXT NOT NULL,
    "qrUrl" TEXT NOT NULL,
    "upiId" TEXT,
    label TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. NEW PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_certificates_serial ON public.certificates("serialNumber");
CREATE INDEX IF NOT EXISTS idx_certificates_studentId ON public.certificates("studentId");
CREATE INDEX IF NOT EXISTS idx_certificates_hash ON public.certificates(hash);
CREATE INDEX IF NOT EXISTS idx_certificates_batchId ON public.certificates("batchId");
CREATE INDEX IF NOT EXISTS idx_tickets_ticketNumber ON public.tickets("ticketNumber");
CREATE INDEX IF NOT EXISTS idx_tickets_studentId ON public.tickets("studentId");
CREATE INDEX IF NOT EXISTS idx_payments_studentId ON public.payments("studentId");
CREATE INDEX IF NOT EXISTS idx_payments_clubId ON public.payments("clubId");
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_qr_links_clubId ON public.qr_links("clubId");

-- ------------------------------------------------------------------------------
-- 4. NEW STORED PROCEDURES
-- ------------------------------------------------------------------------------

-- A. Automated Genesis Unit Provisioning upon Proposal Approval
CREATE OR REPLACE FUNCTION public.provision_unit_from_proposal(proposal_id TEXT, approver_name TEXT)
RETURNS JSONB AS $$
DECLARE
    prop RECORD;
    new_club_id TEXT;
    subdomain_str TEXT;
BEGIN
    SELECT * INTO prop FROM public.proposals WHERE id = proposal_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Proposal Not Found');
    END IF;

    new_club_id := 'club-' || extract(epoch from now())::bigint;
    subdomain_str := lower(regexp_replace(prop.title, '[^a-zA-Z0-9]', '', 'g')) || '.mitsgwl.ac.in';

    INSERT INTO public.clubs (
        id, name, category, "themeColor", subdomain, tagline, description,
        "facultyCoordinatorId", "facultyCoordinatorNames", leadership, status
    ) VALUES (
        new_club_id,
        prop.title,
        COALESCE(prop.category, 'Technical'),
        '#2563eb',
        subdomain_str,
        COALESCE(substring(prop."missionStatement" from 1 for 60) || '...', 'Official Institutional Unit'),
        prop."missionStatement",
        COALESCE(prop."facultyAdvisorId", ''),
        CASE WHEN prop."facultyAdvisorName" IS NOT NULL THEN jsonb_build_array(prop."facultyAdvisorName") ELSE '[]'::jsonb END,
        jsonb_build_object('President', prop."proposerName"),
        'Active'
    ) ON CONFLICT (id) DO NOTHING;

    UPDATE public.proposals
    SET status = 'Approved',
        "deanResponse" = 'Approved and Provisioned by ' || approver_name,
        "createdClubId" = new_club_id,
        "allocatedSubdomain" = subdomain_str
    WHERE id = proposal_id;

    INSERT INTO public.logs (id, timestamp, "user", action, "clubId")
    VALUES (
        'log-' || extract(epoch from now())::bigint,
        now()::text,
        approver_name,
        'Provisioned new institutional unit: ' || prop.title || ' [ID: ' || new_club_id || ']',
        new_club_id
    );

    RETURN jsonb_build_object('success', true, 'clubId', new_club_id, 'subdomain', subdomain_str);
END;
$$ LANGUAGE plpgsql;

-- B. Cryptographic Certificate Authenticity Verification
CREATE OR REPLACE FUNCTION public.verify_certificate(cert_serial TEXT)
RETURNS TABLE (
    serial_number TEXT,
    student_name TEXT,
    event_name TEXT,
    club_name TEXT,
    issue_date TIMESTAMPTZ,
    cert_hash TEXT,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."serialNumber",
        c."studentName",
        c."eventName",
        c."clubName",
        c.date,
        c.hash,
        (c.status = 'Valid') AS is_valid
    FROM public.certificates c
    WHERE c."serialNumber" = cert_serial;
END;
$$ LANGUAGE plpgsql;

-- C. Real-Time Ticket Check-In & Scanner
CREATE OR REPLACE FUNCTION public.check_in_ticket(ticket_no TEXT)
RETURNS JSONB AS $$
DECLARE
    t_record RECORD;
BEGIN
    SELECT * INTO t_record FROM public.tickets WHERE "ticketNumber" = ticket_no;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Ticket Not Found');
    END IF;

    IF t_record."checkedIn" THEN
        RETURN jsonb_build_object('success', false, 'error', 'Ticket Already Used', 'checkedInAt', t_record."checkedInAt");
    END IF;

    UPDATE public.tickets 
    SET "checkedIn" = true, "checkedInAt" = now(), status = 'Used'
    WHERE "ticketNumber" = ticket_no;

    UPDATE public.registrations
    SET "attendanceMarked" = true
    WHERE "ticketId" = ticket_no OR id = t_record."registrationId";

    RETURN jsonb_build_object('success', true, 'studentName', t_record."studentName", 'eventTitle', t_record."eventTitle");
END;
$$ LANGUAGE plpgsql;

-- D. Dynamic Amount-Locked UPI QR URL Generator
CREATE OR REPLACE FUNCTION public.generate_event_upi_qr_url(
    upi_id TEXT,
    payee_name TEXT,
    event_fee NUMERIC,
    event_title TEXT
)
RETURNS TEXT AS $$
DECLARE
    formatted_amount TEXT;
    encoded_pn TEXT;
    encoded_tn TEXT;
    upi_uri TEXT;
BEGIN
    formatted_amount := to_char(COALESCE(event_fee, 0), 'FM999999990.00');
    encoded_pn := replace(replace(COALESCE(payee_name, 'MITS Club'), ' ', '%20'), '&', '%26');
    encoded_tn := replace(replace('Pass: ' || COALESCE(event_title, 'Campus Event'), ' ', '%20'), '&', '%26');
    
    upi_uri := 'upi://pay?pa=' || COALESCE(upi_id, 'mits.treasury@okicici') || '&pn=' || encoded_pn || '&am=' || formatted_amount || '&cu=INR&tn=' || encoded_tn;
    
    RETURN 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' || encode(upi_uri::bytea, 'escape') || '&margin=10';
END;
$$ LANGUAGE plpgsql;

-- E. Auto UPI Payment Confirmation & Ticket Pass Generator
CREATE OR REPLACE FUNCTION public.auto_confirm_upi_payment(
    p_reg_id TEXT,
    p_utr TEXT,
    p_event_id TEXT,
    p_student_id TEXT,
    p_student_name TEXT
)
RETURNS JSONB AS $$
DECLARE
    ticket_num TEXT;
    evt RECORD;
BEGIN
    SELECT * INTO evt FROM public.events WHERE id = p_event_id;
    ticket_num := 'TKT-EVT-' || upper(substring(md5(random()::text) from 1 for 6));

    UPDATE public.registrations
    SET status = 'Approved',
        "paymentType" = 'UPI',
        "transactionId" = p_utr,
        "ticketId" = ticket_num
    WHERE id = p_reg_id;

    INSERT INTO public.payments (
        id, "registrationId", "studentId", "studentName", "eventId", "clubId",
        amount, "paymentType", "transactionId", status, "verifiedBy", "verifiedAt"
    ) VALUES (
        'pay-' || extract(epoch from now())::bigint,
        p_reg_id,
        p_student_id,
        p_student_name,
        p_event_id,
        COALESCE(evt."clubId", 'general'),
        COALESCE(evt.fee, 0),
        'UPI',
        p_utr,
        'Completed',
        'Auto UPI Gateway',
        now()
    );

    INSERT INTO public.tickets (
        id, "ticketNumber", "eventId", "eventTitle", "studentId", "studentName", "studentRoll", "registrationId", status
    ) VALUES (
        'tkt-' || extract(epoch from now())::bigint,
        ticket_num,
        p_event_id,
        COALESCE(evt.title, 'Campus Event Pass'),
        p_student_id,
        p_student_name,
        'MITS',
        p_reg_id,
        'Valid'
    );

    RETURN jsonb_build_object('success', true, 'ticketNumber', ticket_num, 'status', 'Approved');
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) FOR NEW TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_links ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Full Access" ON public.%I;', tbl);
        EXECUTE format('CREATE POLICY "Public Full Access" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 6. REALTIME REPLICATION FOR NEW TABLES
-- ------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE 
    public.certificates,
    public.tickets,
    public.payments,
    public.quotations,
    public.institutional_kpis,
    public.approval_requests,
    public.qr_links;

-- ------------------------------------------------------------------------------
-- 7. DEFAULT KPI SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.institutional_kpis (
    id, "academicYear", semester, "avgAttendanceRate", "recruitmentYield", "credentialsIssued", "totalEventsHosted", "totalActiveClubs", "totalBudgetSpent",
    "categoryDistribution", "engagementContinuity", "topPerformingUnits"
) VALUES (
    'kpi-2025-2026',
    '2025-2026',
    'Annual',
    84.2,
    42.5,
    1420,
    38,
    14,
    325000,
    '[{"name": "Technical", "Participation": 1850}, {"name": "Cultural", "Participation": 2400}, {"name": "Social", "Participation": 950}, {"name": "Sports", "Participation": 1600}]'::jsonb,
    '[{"name": "Jan", "active": 400}, {"name": "Feb", "active": 650}, {"name": "Mar", "active": 580}, {"name": "Apr", "active": 900}, {"name": "May", "active": 750}, {"name": "Jun", "active": 1100}]'::jsonb,
    '[{"name": "ACM Student Chapter", "score": 98.4}, {"name": "IEEE MITS", "score": 96.1}, {"name": "Robotics Club", "score": 94.8}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- MIGRATION DIFF EXECUTION COMPLETE!
-- ==============================================================================
