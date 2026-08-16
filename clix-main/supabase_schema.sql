-- ==============================================================================
-- CLIX HUB (CCMS) - 100% COMPLETE UPDATED MASTER SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================
-- INCLUDES:
--   1. All Core System Tables (Users, Clubs, Venues, Events, Registrations)
--   2. Certificates & Multi-Tier Batch Approval Governance (Dean & Faculty)
--   3. Event Passes & Check-in Verification System (Tickets & QR)
--   4. Financial Ledger, Quotations & Auto UPI QR Payment System
--   5. Genesis Proposals & Automated Unit Initiation Engine
--   6. Institutional KPIs & Real-time Analytics Reporting
--   7. Generic Multi-Step Approval Engine
--   8. End-to-End Encrypted (E2EE) Chat & Polls System
--   9. Realtime Webhook Replication & Permissive RLS Policies
--  10. Stored Procedures (Unit Provisioning, Certificate Verification, Ticket Check-in, UPI Auto-Confirmation)
--  11. System Default Seed Data
-- ==============================================================================
-- Run this complete script in Supabase Dashboard (SQL Editor -> New Query -> Run)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. USERS TABLE (STUDENTS, FACULTY, DEANS, SUPER ADMINS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    "globalRole" TEXT DEFAULT 'Student' CHECK ("globalRole" IN ('Student', 'Faculty', 'Dean', 'Super Admin')),
    "clubMemberships" JSONB DEFAULT '[]'::jsonb,
    "photoUrl" TEXT,
    "signatureUrl" TEXT,
    linkedin TEXT,
    github TEXT,
    "phoneNumber" TEXT,
    "enrollmentNumber" TEXT,
    "rollNumber" TEXT,
    address TEXT,
    branch TEXT,
    department TEXT,
    designation TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "profileLocked" BOOLEAN DEFAULT false,
    skills JSONB DEFAULT '[]'::jsonb,
    "lastSeen" TIMESTAMPTZ,
    "isOnline" BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. CLUBS & ORGANIZATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Technical' CHECK (category IN ('Technical', 'Cultural', 'Social', 'Sports', 'Literary', 'Academic', 'General')),
    "themeColor" TEXT DEFAULT '#2563eb',
    subdomain TEXT UNIQUE,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    tagline TEXT,
    description TEXT,
    "facultyCoordinatorId" TEXT,
    "facultyCoordinatorNames" JSONB DEFAULT '[]'::jsonb,
    leadership JSONB DEFAULT '{}'::jsonb,
    "isFrozen" BOOLEAN DEFAULT false,
    "recruitmentActive" BOOLEAN DEFAULT false,
    achievements JSONB DEFAULT '[]'::jsonb,
    "customSections" JSONB DEFAULT '[]'::jsonb,
    "defaultUpiQrUrl" TEXT,
    "qrHistory" JSONB DEFAULT '[]'::jsonb,
    quotations JSONB DEFAULT '[]'::jsonb,
    "paymentGatewayConfig" JSONB DEFAULT '{"provider": "ManualUPI", "isActive": true}'::jsonb,
    "certificateConfig" JSONB DEFAULT '{"templateId": "modern", "showMITSLogo": true, "showClubLogo": true}'::jsonb,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_clubs_updated_at
BEFORE UPDATE ON public.clubs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. VENUES & AUDITORIUMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    capacity INTEGER DEFAULT 100,
    amenities JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'Maintenance', 'Reserved')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 6. CAMPUS EVENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'Free' CHECK (type IN ('Free', 'Paid')),
    fee NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled')),
    date TIMESTAMPTZ,
    "startDateTime" TIMESTAMPTZ,
    "endDateTime" TIMESTAMPTZ,
    location TEXT,
    "venueId" TEXT,
    venue TEXT,
    "maxRegistrations" INTEGER,
    perks TEXT,
    "venueDetails" TEXT,
    "venueAllocationRequestedTo" TEXT DEFAULT 'None',
    "eventCoordinatorId" TEXT,
    "eventCoordinatorName" TEXT,
    "facultyCoordinatorId" TEXT,
    "facultyCoordinatorName" TEXT,
    "upiQrUrl" TEXT,
    "bannerUrl" TEXT,
    "posterUrl" TEXT,
    "isFinalized" BOOLEAN DEFAULT false,
    "createdBy" TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 7. EVENT REGISTRATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "studentBranch" TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    "paymentType" TEXT DEFAULT 'Free' CHECK ("paymentType" IN ('Free', 'UPI', 'Gateway')),
    "paymentGatewayProvider" TEXT,
    "paymentProofUrl" TEXT,
    "transactionId" TEXT,
    "ticketId" TEXT,
    "attendanceMarked" BOOLEAN DEFAULT false,
    "certificateId" TEXT,
    "paymentDetails" TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 8. INDIVIDUAL ISSUED CERTIFICATES TABLE (STANDALONE VERIFICATION)
-- ------------------------------------------------------------------------------
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

CREATE OR REPLACE TRIGGER trg_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 9. CERTIFICATE BATCHES TABLE (APPROVAL CHAINS & GOVERNANCE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.batches (
    id TEXT PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "templateId" TEXT DEFAULT 'modern',
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'PendingFaculty', 'PendingDean', 'Approved', 'Rejected')),
    "createdBy" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    certificates JSONB DEFAULT '[]'::jsonb,
    "approvalChain" JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_batches_updated_at
BEFORE UPDATE ON public.batches
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 10. CERTIFICATE TEMPLATES CONFIGURATION TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 11. EVENT TICKETS & ENTRY PASSES TABLE
-- ------------------------------------------------------------------------------
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

CREATE OR REPLACE TRIGGER trg_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 12. PAYMENTS & FINANCIAL LEDGER TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 13. PROCUREMENT & QUOTATIONS TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 14. RECRUITMENT APPLICANTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applicants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    branch TEXT,
    domain TEXT,
    stage TEXT DEFAULT 'Applied' CHECK (stage IN ('Applied', 'Screening', 'Interview', 'Offer', 'Selected', 'Rejected')),
    "whyJoin" TEXT,
    "resumeUrl" TEXT,
    notes TEXT,
    "recruitmentCycle" TEXT,
    "clubId" TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_applicants_updated_at
BEFORE UPDATE ON public.applicants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 15. PROPOSALS (INITIATE NEW UNIT & GENESIS REQUESTS) TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proposals (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'Club' CHECK (type IN ('Club', 'Team', 'Chapter', 'Society', 'Cell', 'Event')),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    "proposerName" TEXT NOT NULL,
    "proposerRoll" TEXT,
    "proposerEmail" TEXT,
    "proposerPhone" TEXT,
    "proposerBranch" TEXT,
    "missionStatement" TEXT,
    objectives JSONB DEFAULT '[]'::jsonb,
    "proposedActivities" JSONB DEFAULT '[]'::jsonb,
    "estimatedMembers" INTEGER DEFAULT 10,
    "budgetRequirement" NUMERIC DEFAULT 0,
    "facultyAdvisorName" TEXT,
    "facultyAdvisorEmail" TEXT,
    "facultyAdvisorId" TEXT,
    "foundingMembers" JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'PendingDean' CHECK (status IN ('Draft', 'PendingFacultyAdvisor', 'PendingDean', 'PendingSystemAdmin', 'Approved', 'Rejected')),
    "deanResponse" TEXT,
    "facultyEndorsement" JSONB DEFAULT '{}'::jsonb,
    "adminApproval" JSONB DEFAULT '{}'::jsonb,
    "allocatedSubdomain" TEXT,
    "createdClubId" TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 16. INSTITUTIONAL KPIS & PERFORMANCE REPORTS TABLE
-- ------------------------------------------------------------------------------
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

CREATE OR REPLACE TRIGGER trg_kpis_updated_at
BEFORE UPDATE ON public.institutional_kpis
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 17. GENERIC MULTI-STEP APPROVAL ENGINE TABLE
-- ------------------------------------------------------------------------------
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

CREATE OR REPLACE TRIGGER trg_approvals_updated_at
BEFORE UPDATE ON public.approval_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 18. ACTIVITIES & WORKSHOPS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Workshop' CHECK (category IN ('Workshop', 'Seminar', 'Competition', 'Webinar', 'Meetup', 'Project', 'Other')),
    date TIMESTAMPTZ DEFAULT now(),
    location TEXT,
    outcome TEXT,
    "mediaUrls" JSONB DEFAULT '[]'::jsonb,
    "participantsCount" INTEGER DEFAULT 0,
    "isPublic" BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 19. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    "clubId" TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 20. MESSAGES (E2EE CHAT & DIRECT MESSAGES) TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    content TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    "clubId" TEXT,
    "channelScope" TEXT DEFAULT 'member',
    "recipientId" TEXT,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'audio', 'location', 'poll', 'system')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    "mediaUrl" TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    "pollQuestion" TEXT,
    "pollOptions" JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 21. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    timestamp TIMESTAMPTZ DEFAULT now(),
    read BOOLEAN DEFAULT false,
    "senderName" TEXT,
    "userId" TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 22. INQUIRIES (CONTACT US LEADS) TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT ('inq_' || extract(epoch from now())::bigint || '_' || floor(random()*1000)::int),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    "clubId" TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 23. SESSION ARCHIVES TABLE (YEARLY DATA SNAPSHOTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.session_archives (
    id TEXT PRIMARY KEY,
    "sessionName" TEXT NOT NULL,
    "archivedAt" TIMESTAMPTZ DEFAULT now(),
    "archivedBy" TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 24. DEVELOPERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.developers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    email TEXT,
    image TEXT,
    linkedin TEXT,
    github TEXT,
    "isLead" BOOLEAN DEFAULT false,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 25. MENTORS & ADVISORS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mentors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    image TEXT,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 26. SAVED EVENTS (BOOKMARKS) TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_events (
    id TEXT PRIMARY KEY DEFAULT ('se_' || extract(epoch from now())::bigint || '_' || floor(random()*1000)::int),
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE("userId", "eventId")
);

-- ------------------------------------------------------------------------------
-- 27. DEVELOPER CONFIG TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dev_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    "developedUnderName" TEXT DEFAULT 'MITS Gwalior',
    "developedUnderUrl" TEXT DEFAULT 'https://mitsgwalior.in',
    "developedUnderLogo" TEXT,
    "authorizedEmails" JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 28. UPI QR HISTORY TABLE
-- ------------------------------------------------------------------------------
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
-- 29. HIGH-PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users("globalRole");
CREATE INDEX IF NOT EXISTS idx_clubs_subdomain ON public.clubs(subdomain);
CREATE INDEX IF NOT EXISTS idx_events_clubId ON public.events("clubId");
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_registrations_eventId ON public.registrations("eventId");
CREATE INDEX IF NOT EXISTS idx_registrations_studentId ON public.registrations("studentId");
CREATE INDEX IF NOT EXISTS idx_registrations_ticketId ON public.registrations("ticketId");
CREATE INDEX IF NOT EXISTS idx_certificates_serial ON public.certificates("serialNumber");
CREATE INDEX IF NOT EXISTS idx_certificates_studentId ON public.certificates("studentId");
CREATE INDEX IF NOT EXISTS idx_certificates_hash ON public.certificates(hash);
CREATE INDEX IF NOT EXISTS idx_certificates_batchId ON public.certificates("batchId");
CREATE INDEX IF NOT EXISTS idx_tickets_ticketNumber ON public.tickets("ticketNumber");
CREATE INDEX IF NOT EXISTS idx_tickets_studentId ON public.tickets("studentId");
CREATE INDEX IF NOT EXISTS idx_payments_studentId ON public.payments("studentId");
CREATE INDEX IF NOT EXISTS idx_payments_clubId ON public.payments("clubId");
CREATE INDEX IF NOT EXISTS idx_applicants_clubId ON public.applicants("clubId");
CREATE INDEX IF NOT EXISTS idx_batches_clubId ON public.batches("clubId");
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_clubId ON public.messages("clubId");
CREATE INDEX IF NOT EXISTS idx_messages_recipientId ON public.messages("recipientId");
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON public.notifications("userId");
CREATE INDEX IF NOT EXISTS idx_qr_links_clubId ON public.qr_links("clubId");

-- ------------------------------------------------------------------------------
-- 30. STORED PROCEDURES (PROVISIONING, CERTIFICATES, TICKETS & AUTO UPI)
-- ------------------------------------------------------------------------------

-- 1. Automated Genesis Unit Provisioning upon Proposal Approval
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

    -- Create new Club Unit
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

    -- Update Proposal Status
    UPDATE public.proposals
    SET status = 'Approved',
        "deanResponse" = 'Approved and Provisioned by ' || approver_name,
        "createdClubId" = new_club_id,
        "allocatedSubdomain" = subdomain_str
    WHERE id = proposal_id;

    -- Generate Audit Log
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

-- 2. Verify Certificate Authenticity by Serial Number
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

-- 3. Check In Event Ticket Pass
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

-- 4. Generate Dynamic Amount-Locked UPI QR Code URL
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

-- 5. Auto Confirm UPI Payment and Issue Pass
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

    -- Update registration to Approved
    UPDATE public.registrations
    SET status = 'Approved',
        "paymentType" = 'UPI',
        "transactionId" = p_utr,
        "ticketId" = ticket_num
    WHERE id = p_reg_id;

    -- Record verified payment
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

    -- Issue digital ticket pass
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
-- 31. ROLE-BASED ACCESS CONTROL (RBAC) & ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
-- Institutional Roles: 'Super Admin', 'Dean', 'Faculty', 'Student'
-- Club-level Roles: 'President', 'Vice President', 'Core', 'Member'

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_links ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_current_user_role(p_user_id TEXT)
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT "globalRole" INTO v_role FROM public.users WHERE id = p_user_id;
    RETURN COALESCE(v_role, 'Student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_user_permission(p_user_id TEXT, p_required_roles TEXT[])
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT "globalRole" INTO v_role FROM public.users WHERE id = p_user_id;
    RETURN (v_role = ANY(p_required_roles));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
-- 32. SUPABASE REALTIME REPLICATION (INSTANT WEBSOCKET SYNC)
-- ------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE 
    public.events,
    public.registrations,
    public.certificates,
    public.batches,
    public.tickets,
    public.payments,
    public.quotations,
    public.messages,
    public.notifications,
    public.proposals,
    public.institutional_kpis,
    public.approval_requests,
    public.applicants,
    public.clubs,
    public.activities,
    public.venues,
    public.inquiries,
    public.qr_links;

-- ------------------------------------------------------------------------------
-- 33. SYSTEM DEFAULT SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.dev_config (id, "developedUnderName", "developedUnderUrl", "developedUnderLogo", "authorizedEmails")
VALUES (
    'default',
    'MITS Gwalior',
    'https://mitsgwalior.in',
    '/image.png',
    '["admin@mitsgwl.ac.in", "dean.sw@mitsgwl.ac.in", "namanlahariya2@gmail.com"]'::jsonb
) ON CONFLICT (id) DO UPDATE SET "updated_at" = now();

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

INSERT INTO public.developers (id, name, role, bio, email, linkedin, github, "isLead", education, experience, achievements)
VALUES (
    'dev-lead-1',
    'Naman Lahariya',
    'Lead Architect & Fullstack Engineer',
    'Built CLIX Hub - Centralized Club Management & Institutional Operations System for MITS Gwalior.',
    'namanlahariya2@gmail.com',
    'https://linkedin.com/in/namanlahariya',
    'https://github.com/namanlahariya',
    true,
    '[{"id": "edu-1", "school": "Madhav Institute of Technology & Science (MITS)", "degree": "B.Tech Computer Science & IT", "year": "2022 - 2026"}]'::jsonb,
    '[{"id": "exp-1", "company": "CLIX Hub Architecture", "role": "Lead Fullstack Engineer", "duration": "2024 - Present", "desc": "Architected end-to-end multi-tenant club operating platform."}]'::jsonb,
    '[{"id": "ach-1", "title": "Lead Developer Award", "description": "Built centralized institutional management platform.", "date": "2025"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 100% COMPLETE UPDATED MASTER POSTGRESQL SCHEMA INITIALIZATION FINISHED!
-- ==============================================================================
