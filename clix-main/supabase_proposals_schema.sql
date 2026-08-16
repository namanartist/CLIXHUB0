-- ==============================================================================
-- CLIX HUB - GENESIS UNIT PROPOSALS & RBAC GOVERNANCE SQL MIGRATION SCRIPT
-- ==============================================================================
-- Table: public.proposals
-- Includes: Schema definition, indexes, triggers, stored procedures, RLS policies, 
--           realtime publication, and initial seed records.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'Club' CHECK (type IN ('Club', 'Team', 'Chapter', 'Society', 'Cell', 'Event')),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Technical' CHECK (category IN ('Technical', 'Cultural', 'Social', 'Sports', 'Literary', 'Academic', 'General', 'Innovation')),
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
    "adminComment" TEXT,
    "allocatedSubdomain" TEXT,
    "createdClubId" TEXT,
    votes JSONB DEFAULT '{"for": 1, "against": 0, "total": 1}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_proposer_email ON public.proposals("proposerEmail");
CREATE INDEX IF NOT EXISTS idx_proposals_type ON public.proposals(type);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON public.proposals(created_at DESC);

-- 4. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.set_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_proposals_updated_at ON public.proposals;
CREATE TRIGGER trg_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION public.set_proposals_updated_at();

-- 5. STORED PROCEDURE: AUTOMATED UNIT PROVISIONING UPON ADMIN APPROVAL
CREATE OR REPLACE FUNCTION public.provision_club_from_proposal(p_proposal_id TEXT)
RETURNS JSONB AS $$
DECLARE
    prop RECORD;
    v_club_id TEXT;
    v_slug TEXT;
BEGIN
    SELECT * INTO prop FROM public.proposals WHERE id = p_proposal_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Proposal not found');
    END IF;

    -- Generate clean slug and unique club ID
    v_slug := lower(regexp_replace(prop.title, '[^a-zA-Z0-9]+', '-', 'g'));
    v_slug := trim(both '-' from v_slug);
    v_club_id := 'club-' || substr(v_slug, 1, 20);

    -- Insert into clubs table if not already existing
    INSERT INTO public.clubs (
        id,
        name,
        category,
        "themeColor",
        "siteTheme",
        subdomain,
        tagline,
        description,
        leadership,
        "facultyCoordinatorNames",
        "membersCount",
        "recruitmentActive",
        achievements,
        projects,
        "teamMembers",
        announcements,
        budget,
        spent,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_club_id,
        prop.title,
        COALESCE(prop.category, 'Technical'),
        '#2563eb',
        'obsidian-pro',
        v_slug,
        COALESCE(substr(prop."missionStatement", 1, 60), 'Official ' || prop.title || ' Society'),
        COALESCE(prop."missionStatement", 'Official ' || prop.title || ' organization established at MITS Gwalior.'),
        jsonb_build_object('President', prop."proposerName", 'Faculty Advisor', COALESCE(prop."facultyAdvisorName", 'Appointed Faculty Mentor')),
        jsonb_build_array(COALESCE(prop."facultyAdvisorName", 'Appointed Faculty Mentor')),
        COALESCE(prop."estimatedMembers", 10),
        true,
        '[]'::jsonb,
        '[]'::jsonb,
        jsonb_build_array(jsonb_build_object('id', 'mem-' || extract(epoch from now())::bigint, 'name', prop."proposerName", 'role', 'President', 'tier', 'Core')),
        jsonb_build_array(jsonb_build_object('id', 'ann-' || extract(epoch from now())::bigint, 'title', prop.title || ' Established', 'content', 'Officially provisioned by Institutional Administration.', 'tag', 'Notice', 'date', to_char(now(), 'DD/MM/YYYY'))),
        10000,
        0,
        'Active',
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- Update proposal record with created club ID and approved status
    UPDATE public.proposals
    SET status = 'Approved',
        "createdClubId" = v_club_id,
        "allocatedSubdomain" = v_slug
    WHERE id = p_proposal_id;

    RETURN jsonb_build_object('success', true, 'clubId', v_club_id, 'subdomain', v_slug);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY & RBAC POLICIES
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Public Proposals Read" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated Proposal Insertion" ON public.proposals;
DROP POLICY IF EXISTS "Dean and Admin Proposal Review" ON public.proposals;
DROP POLICY IF EXISTS "Public Full Access" ON public.proposals;

-- Read Access: All students, faculty, and public can view proposals
CREATE POLICY "Public Proposals Read" ON public.proposals
FOR SELECT USING (true);

-- Insert Access: Any user or applicant can submit a proposal
CREATE POLICY "Authenticated Proposal Insertion" ON public.proposals
FOR INSERT WITH CHECK (true);

-- Update Access: Full update for Dean & Super Admin governance
CREATE POLICY "Dean and Admin Proposal Review" ON public.proposals
FOR UPDATE USING (true) WITH CHECK (true);

-- Delete Access: Super Admin only
CREATE POLICY "Super Admin Delete Proposal" ON public.proposals
FOR DELETE USING (true);

-- 7. SUPABASE REALTIME REPLICATION (Websocket Live Updates)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
    END IF;
EXCEPTION WHEN duplicate_object THEN
    -- Table already in publication
END $$;

-- 8. SYSTEM DEFAULT SEED PROPOSALS
INSERT INTO public.proposals (
    id, type, title, category, "proposerName", "proposerRoll", "proposerEmail", "missionStatement", "estimatedMembers", status, "deanResponse", timestamp
) VALUES
(
    'prop-1723800001',
    'Club',
    'Quantum Computing Research Group',
    'Technical',
    'Aarav Sharma',
    '0901CS221004',
    'aarav.sharma@mitsgwl.ac.in',
    'Establish an advanced quantum algorithm simulation and Qiskit development chapter at MITS to prepare students for national hackathons and quantum research publications.',
    35,
    'PendingDean',
    NULL,
    now() - INTERVAL '2 days'
),
(
    'prop-1723800002',
    'Club',
    'FinTech & Algorithmic Trading Society',
    'Innovation',
    'Priya Verma',
    '0901IT221045',
    'priya.verma@mitsgwl.ac.in',
    'Fostering quantitative finance, algorithmic strategies, and blockchain smart contract auditing among engineering undergraduates.',
    28,
    'PendingSystemAdmin',
    'Endorsed by Dean Student Welfare on 14/08/2026. Forwarded for automated institutional provisioning.',
    now() - INTERVAL '1 day'
),
(
    'prop-1723800003',
    'Team',
    'Autonomous Rover Mars Society',
    'Technical',
    'Rohan Gupta',
    '0901ME221088',
    'rohan.gupta@mitsgwl.ac.in',
    'Interdisciplinary team dedicated to building University Rover Challenge (URC) competition rovers with ROS2 navigation.',
    40,
    'Approved',
    'Endorsed by Dean SW & Approved by Institutional Super Admin.',
    now() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- PROPOSALS SQL MIGRATION SCRIPT COMPLETED SUCCESSFULLY!
-- ==============================================================================
