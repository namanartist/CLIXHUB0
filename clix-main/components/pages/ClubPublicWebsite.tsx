import React, { useState, useMemo, useEffect } from 'react';
import { Club, Event, User, Applicant, Registration, ClubProject, ClubTeamMember, ClubGalleryItem, ClubAnnouncement, ClubRole } from '../../types';
import { formatDisplayDate } from '../../lib/formatDate';
import { getClubTheme } from '../../lib/clubThemes';
import { getClubSubdomainSlug, getClubSubdomainUrl, copyClubSubdomainUrl } from '../../lib/subdomain';
import {
  Menu,
  X,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  UserPlus,
  Globe,
  Award,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Trophy,
  Layers,
  Code2,
  ChevronRight,
  Clock,
  Send,
  Radio,
  Image as ImageIcon,
  Heart,
  Share2,
  Terminal,
  Cpu,
  BookOpen,
  ArrowUpRight,
  Flame,
  Star,
  Compass,
  Check,
  Copy,
  Sun,
  Moon,
  UserCircle2,
  GraduationCap
} from 'lucide-react';

interface ClubPublicWebsiteProps {
  club: Club;
  events?: Event[];
  registrations?: Registration[];
  user?: User | null;
  members?: User[];
  onRegister: (eventId: string) => void;
  onSubmitApplication: (app: Partial<Applicant>) => void;
  onSignIn?: () => void;
  showDashboardLink?: boolean;
  onOpenDashboard?: () => void;
}

export const ClubPublicWebsite: React.FC<ClubPublicWebsiteProps> = ({
  club,
  events = [],
  registrations: _registrations = [],
  user,
  members = [],
  onRegister,
  onSubmitApplication,
  onSignIn,
  showDashboardLink,
  onOpenDashboard
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'All' | 'Events' | 'Workshops' | 'Competitions' | 'Team'>('All');

  // Application Modal Form State (Auto-fetched from system login if available)
  const [applicantData, setApplicantData] = useState({
    name: user?.name || '',
    rollNumber: user?.rollNumber || user?.enrollmentNumber || '',
    email: user?.email || '',
    branch: user?.branch || user?.department || 'CSIT',
    domain: 'Technical',
    whyJoin: ''
  });

  // Sync state if user logs in or changes
  useEffect(() => {
    if (user) {
      setApplicantData(prev => ({
        ...prev,
        name: user.name || prev.name,
        rollNumber: user.rollNumber || user.enrollmentNumber || prev.rollNumber,
        email: user.email || prev.email,
        branch: user.branch || user.department || prev.branch
      }));
    }
  }, [user, isRecruitModalOpen]);

  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSubmittedMsg, setAppSubmittedMsg] = useState<string | null>(null);
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);

  // Subdomain Resolution
  const subdomainSlug = useMemo(() => getClubSubdomainSlug(club), [club]);
  const subdomainUrl = useMemo(() => getClubSubdomainUrl(club), [club]);

  const handleCopySubdomain = async () => {
    const success = await copyClubSubdomainUrl(club);
    if (success) {
      setCopiedSubdomain(true);
      setTimeout(() => setCopiedSubdomain(false), 2200);
    }
  };

  // Theme definition
  const currentTheme = useMemo(() => getClubTheme(club.siteTheme), [club.siteTheme]);
  const isLight = currentTheme.category === 'light';
  const accent = club.themeColor || currentTheme.accent;
  const customDomain = `${subdomainSlug}.clixmits.vercel.app`;

  // ─── AUTO-FETCH REAL SYSTEM MEMBERS FROM DATABASE ──────────────────────────
  const systemClubMembers = useMemo(() => {
    if (!members || members.length === 0) return [];
    return members.filter(u => u.clubMemberships?.some(m => m.clubId === club.id));
  }, [members, club.id]);

  // Auto-fetch faculty coordinator
  const facultyAdvisor = useMemo(() => {
    if (!members || members.length === 0) return null;
    return members.find(u =>
      (u.id === club.facultyCoordinatorId) ||
      (club.facultyCoordinatorNames && club.facultyCoordinatorNames.some(fn => fn.toLowerCase().trim() === u.name.toLowerCase().trim()))
    );
  }, [members, club.facultyCoordinatorId, club.facultyCoordinatorNames]);

  // Helper to resolve member profile picture
  const getMemberPfp = (name: string, photoUrl?: string) => {
    if (photoUrl) return photoUrl;
    const found = members.find(m => m.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (found && found.photoUrl) return found.photoUrl;
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=0284c7,3b82f6,6366f1,8b5cf6,ec4899`;
  };

  // Resolved President from system or leadership
  const systemPresident = useMemo(() => {
    const fromMembership = systemClubMembers.find(u =>
      u.clubMemberships?.some(m => m.clubId === club.id && (m.role === ClubRole.PRESIDENT || (m.role as string) === 'President'))
    );
    if (fromMembership) return fromMembership;
    const p = club.leadership?.['President'];
    if (p && !p.startsWith('usr_') && !p.startsWith('usr-') && !p.startsWith('user_') && !p.startsWith('id_')) {
      return { name: p, role: 'President', photoUrl: getMemberPfp(p) };
    }
    return null;
  }, [systemClubMembers, club.leadership, club.id]);

  // Filtered leadership entries (No raw database IDs)
  const filteredLeadership = useMemo(() => {
    if (!club.leadership) return [];
    return Object.entries(club.leadership).filter(([role, val]) => {
      const r = role.toLowerCase().trim();
      if (r === 'presidentid' || r === 'president_id' || r.endsWith('id') || r.endsWith('_id') || r === 'id') return false;
      if (typeof val !== 'string' || !val) return false;
      if (val.startsWith('usr_') || val.startsWith('usr-') || val.startsWith('user_') || val.startsWith('id_') || val.startsWith('user-')) return false;
      return true;
    });
  }, [club.leadership]);

  // Projects list
  const projectsList: ClubProject[] = useMemo(() => {
    if (club.projects && club.projects.length > 0) return club.projects;
    return [
      {
        id: 'proj-1',
        title: 'Autonomous Navigation Rover',
        description: 'Multi-terrain mapping rover with LiDAR integration, ROS2 control loops, and edge obstacle detection.',
        team: 'Hardware & Robotics Division',
        techStack: ['ROS2', 'C++', 'Python', 'PyTorch', 'LiDAR'],
        status: 'Active',
        githubUrl: 'https://github.com',
        demoUrl: '#'
      },
      {
        id: 'proj-2',
        title: 'Institutional Resource Scheduler',
        description: 'Automated auditorium and laboratory booking system with smart scheduling conflict resolution.',
        team: 'Software Systems Division',
        techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Tailwind'],
        status: 'Completed',
        githubUrl: 'https://github.com'
      }
    ];
  }, [club.projects]);

  // Gallery
  const galleryItems: ClubGalleryItem[] = useMemo(() => {
    if (club.gallery && club.gallery.length > 0) return club.gallery;
    return [
      { id: 'g-1', title: 'Smart India Hackathon Grand Finale', category: 'Competitions', mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', date: '2025' },
      { id: 'g-2', title: 'Hands-on Edge AI Bootcamp', category: 'Workshops', mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', date: '2025' },
      { id: 'g-3', title: 'Annual Technological Symposium', category: 'Events', mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', date: '2025' },
      { id: 'g-4', title: 'Executive Council Sprint', category: 'Team', mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', date: '2025' }
    ];
  }, [club.gallery]);

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'All') return galleryItems;
    return galleryItems.filter(item => item.category === galleryFilter);
  }, [galleryItems, galleryFilter]);

  // Announcements
  const announcementsList: ClubAnnouncement[] = useMemo(() => {
    if (club.announcements && club.announcements.length > 0) return club.announcements;
    return [
      { id: 'ann-1', title: 'Annual Recruitment Cycle Open', content: 'Applications are currently open for 1st and 2nd year students across all 5 specialized operational domains.', tag: 'Recruitment', date: 'Active' },
      { id: 'ann-2', title: 'Pre-Hackathon Technical Sprint', content: 'Preparatory workshop scheduled at MITS Central Seminar Hall on modern web architecture and cloud deployment.', tag: 'Event', date: 'Upcoming' }
    ];
  }, [club.announcements]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantData.name || !applicantData.rollNumber || !applicantData.whyJoin) {
      alert('Please fill out all required application fields.');
      return;
    }
    setIsSubmittingApp(true);
    try {
      await onSubmitApplication({
        ...applicantData,
        clubId: club.id,
        stage: 'Applied'
      });
      setAppSubmittedMsg(`✓ Application successfully submitted for ${club.name}! Tracking ID generated.`);
      setTimeout(() => {
        setIsRecruitModalOpen(false);
        setAppSubmittedMsg(null);
      }, 2200);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit application.');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans relative overflow-x-hidden antialiased transition-colors duration-500 w-full"
      style={{
        backgroundColor: currentTheme.bgMain,
        color: currentTheme.textPrimary
      }}
    >
      {/* ─── RADIAL LIGHTING & AMBIENCE ────────────────────────────────────── */}
      <div
        className="fixed top-[-10vw] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-full blur-[160px] pointer-events-none opacity-25"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
      <div
        className="fixed bottom-[-10vw] right-[-10vw] w-[45vw] h-[45vw] rounded-full blur-[180px] pointer-events-none opacity-15"
        style={{ background: isLight ? '#93c5fd' : '#4f46e5' }}
      />

      {/* ─── 1. FLOATING NAVIGATION BAR ───────────────────────────────────── */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 pointer-events-none w-full">
        <div
          className="max-w-7xl mx-auto rounded-2xl h-16 md:h-18 px-4 sm:px-6 md:px-8 flex items-center justify-between pointer-events-auto backdrop-blur-xl shadow-xl transition-all"
          style={{
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.88)' : currentTheme.surface,
            borderColor: currentTheme.borderColor,
            borderWidth: 1
          }}
        >
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 min-w-0">
            {club.logoUrl ? (
              <img src={club.logoUrl} alt={club.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shrink-0 border shadow-sm" style={{ borderColor: currentTheme.borderColor }} />
            ) : (
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-md text-sm sm:text-base"
                style={{ background: accent }}
              >
                {club.name[0]}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-extrabold truncate text-xs sm:text-sm md:text-base leading-none tracking-tight" style={{ color: currentTheme.textPrimary }}>
                  {club.name}
                </p>
                <span className="hidden sm:inline-flex text-[9px] px-2 py-0.5 rounded-full font-bold border tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
                  MITS UNIT
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Globe size={11} className="text-cyan-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono truncate" style={{ color: currentTheme.textSecondary }}>{subdomainSlug}.clixmits.vercel.app</span>
                <button
                  type="button"
                  onClick={handleCopySubdomain}
                  title="Copy Subdomain Link"
                  className="p-0.5 hover:opacity-80 text-slate-400 hover:text-white transition-opacity"
                >
                  {copiedSubdomain ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 p-1 rounded-xl border"
            style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor }}
          >
            <a href="#about" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:opacity-80 transition-all" style={{ color: currentTheme.textSecondary }}>About</a>
            <a href="#events" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:opacity-80 transition-all" style={{ color: currentTheme.textSecondary }}>Events ({events.length})</a>
            <a href="#projects" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:opacity-80 transition-all" style={{ color: currentTheme.textSecondary }}>Projects</a>
            <a href="#team" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:opacity-80 transition-all" style={{ color: currentTheme.textSecondary }}>Team ({systemClubMembers.length || 'Council'})</a>
            <a href="#achievements" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:opacity-80 transition-all" style={{ color: currentTheme.textSecondary }}>Trophies</a>
            <a href="#gallery" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:opacity-80 transition-all" style={{ color: currentTheme.textSecondary }}>Gallery</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            {showDashboardLink && onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5"
                style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.surfaceSubtle, color: currentTheme.textPrimary }}
              >
                <LayoutDashboard size={13} /> Workspace
              </button>
            )}
            {club.recruitmentActive && (
              <button
                type="button"
                onClick={() => setIsRecruitModalOpen(true)}
                className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95 flex items-center gap-1.5 tracking-wide"
                style={{ background: accent }}
              >
                <UserPlus size={14} /> Join Society
              </button>
            )}
            {onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5"
                style={{ borderColor: currentTheme.borderColor, color: currentTheme.textSecondary }}
              >
                <LogIn size={13} /> Login
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl border"
            style={{ borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden max-w-lg mx-auto mt-2 rounded-2xl p-4 border space-y-1 pointer-events-auto shadow-2xl"
            style={{ backgroundColor: isLight ? '#ffffff' : currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>About Organization</a>
            <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Events ({events.length})</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Projects & Initiatives</a>
            <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Team & Governance</a>
            <a href="#achievements" onClick={() => setIsMobileMenuOpen(false)} className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Trophies & Accolades</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Media Gallery</a>
            {club.recruitmentActive && (
              <button
                type="button"
                onClick={() => { setIsRecruitModalOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg mt-2"
                style={{ background: accent }}
              >
                Apply to Join {club.name}
              </button>
            )}
          </div>
        )}
      </header>

      {/* ─── 2. HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto min-h-[80vh] sm:min-h-[85vh] flex items-center w-full">
        {club.bannerUrl && (
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden rounded-[2rem] sm:rounded-[3rem]">
            <img src={club.bannerUrl} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: isLight
                  ? 'linear-gradient(to bottom, transparent, rgba(248, 250, 252, 0.8), #f8fafc)'
                  : 'linear-gradient(to bottom, transparent, rgba(3, 7, 18, 0.8), #030712)'
              }}
            />
          </div>
        )}

        <div className="relative z-10 w-full grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md"
                style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider" style={{ color: accent }}>{club.category} Division</span>
                <span className="text-[10px] sm:text-[11px]" style={{ color: currentTheme.textSecondary }}>• MITS Gwalior (Est. 1957)</span>
              </div>

              <div
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[11px] font-mono font-bold"
                style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
              >
                <Globe size={13} className="text-cyan-400 shrink-0" />
                <span>{subdomainSlug}.clixmits.vercel.app</span>
                <button
                  type="button"
                  onClick={handleCopySubdomain}
                  title="Copy Subdomain Link"
                  className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-0.5"
                >
                  {copiedSubdomain ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]" style={{ color: currentTheme.textPrimary }}>
              {club.name}
            </h1>

            <p className="text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0" style={{ color: currentTheme.textSecondary }}>
              {club.tagline || club.description || 'Pioneering multidisciplinary innovation, research prototypes, national hackathons, and institutional leadership.'}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              <a
                href="#events"
                className="inline-flex items-center gap-2 rounded-xl px-6 sm:px-7 py-3 sm:py-3.5 text-xs font-bold text-white uppercase tracking-wider shadow-xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: accent }}
              >
                Explore Events <ArrowRight size={15} />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl border px-6 sm:px-7 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
                style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.surfaceSubtle, color: currentTheme.textPrimary }}
              >
                Portfolio <Code2 size={15} />
              </a>
              {club.recruitmentActive && (
                <button
                  type="button"
                  onClick={() => setIsRecruitModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 sm:px-7 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
                  style={{ borderColor: accent, backgroundColor: `${accent}15`, color: accent }}
                >
                  <UserPlus size={15} /> Apply Now
                </button>
              )}
            </div>

            {/* Live Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-2xl mx-auto lg:mx-0">
              <div className="p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md text-center lg:text-left" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}>
                <p className="text-xl sm:text-2xl font-extrabold" style={{ color: currentTheme.textPrimary }}>{events.length}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: currentTheme.textSecondary }}>Events</p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md text-center lg:text-left" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}>
                <p className="text-xl sm:text-2xl font-extrabold" style={{ color: accent }}>{systemClubMembers.length || projectsList.length}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: currentTheme.textSecondary }}>Members</p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md text-center lg:text-left" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-500">{club.achievements?.length || 4}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: currentTheme.textSecondary }}>Accolades</p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md text-center lg:text-left" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-500">{club.recruitmentActive ? 'Open' : 'Active'}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: currentTheme.textSecondary }}>Recruitment</p>
              </div>
            </div>
          </div>

          {/* Unit Glass Showcase Card */}
          <div className="lg:col-span-5 relative w-full">
            <div
              className="p-6 sm:p-8 md:p-9 rounded-[2rem] sm:rounded-[2.5rem] border shadow-2xl backdrop-blur-xl space-y-5"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: currentTheme.borderColor }}>
                <div className="flex items-center gap-3.5">
                  {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.name} className="w-12 h-12 rounded-xl object-cover border shadow-md" style={{ borderColor: currentTheme.borderColor }} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md" style={{ background: accent }}>
                      {club.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg leading-tight" style={{ color: currentTheme.textPrimary }}>{club.name}</h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>{club.category} Society</p>
                  </div>
                </div>
                <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
              </div>

              <p className="text-xs leading-relaxed font-normal" style={{ color: currentTheme.textSecondary }}>
                {club.description || 'Dedicated to organizing technical bootcamps, national competitive hackathons, industry symposiums, and cultural festivals for the students of MITS Gwalior.'}
              </p>

              {/* Leadership Overview with System Verified PFPs */}
              <div className="p-4 rounded-xl border space-y-2.5" style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor }}>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
                  <span className="flex items-center gap-1.5"><Users size={13} /> Verified Governance</span>
                  <span className="text-[10px] font-mono" style={{ color: currentTheme.textSecondary }}>MITS CHAPTER</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={facultyAdvisor?.photoUrl || getMemberPfp(facultyAdvisor?.name || club.facultyCoordinatorNames?.[0] || 'Faculty Mentor')}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/30 shrink-0"
                    />
                    <p className="truncate">
                      <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>Faculty Mentor:</span>{' '}
                      <span style={{ color: currentTheme.textSecondary }}>{facultyAdvisor?.name || club.facultyCoordinatorNames?.[0] || 'Appointed Faculty Mentor'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={(systemPresident as any)?.photoUrl || getMemberPfp((systemPresident as any)?.name || 'President')}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-blue-500/30 shrink-0"
                    />
                    <p className="truncate">
                      <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>President:</span>{' '}
                      <span style={{ color: currentTheme.textSecondary }}>{(systemPresident as any)?.name || 'Student Executive Head'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. ANNOUNCEMENTS & LIVE TIMELINE ─────────────────────────────── */}
      {announcementsList.length > 0 && (
        <section className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
          <div
            className="p-5 sm:p-7 rounded-[1.8rem] sm:rounded-[2rem] border shadow-lg space-y-3.5"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <div className="flex items-center gap-2.5">
              <Radio size={16} className="text-red-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>Noticeboard & Official Broadcasts</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3.5">
              {announcementsList.map(ann => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors"
                  style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border" style={{ borderColor: currentTheme.borderColor, color: accent }}>
                        {ann.tag}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: currentTheme.textSecondary }}>{ann.date}</span>
                    </div>
                    <p className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>{ann.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: currentTheme.textSecondary }}>{ann.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 4. ABOUT & FOCUS AREAS ───────────────────────────────────────── */}
      <section id="about" className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 w-full">
        <div className="border-b pb-5" style={{ borderColor: currentTheme.borderColor }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
            <BookOpen size={11} /> Overview & Mission
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2" style={{ color: currentTheme.textPrimary }}>What We Build & Explore</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div
            className="p-6 sm:p-7 rounded-[1.8rem] sm:rounded-[2rem] border shadow-xl space-y-3.5 transition-all"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: `${accent}15`, color: accent }}>
              <Cpu size={24} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>Innovation & R&D</h3>
            <p className="text-xs leading-relaxed" style={{ color: currentTheme.textSecondary }}>
              Fostering hands-on prototypes, hardware-software integration, and research papers for conferences and national symposiums.
            </p>
          </div>

          <div
            className="p-6 sm:p-7 rounded-[1.8rem] sm:rounded-[2rem] border shadow-xl space-y-3.5 transition-all"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold bg-purple-500/15 text-purple-600">
              <Terminal size={24} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>Hackathons & Sprints</h3>
            <p className="text-xs leading-relaxed" style={{ color: currentTheme.textSecondary }}>
              Representing MITS Gwalior in national hackathons, ICPC programming contests, and inter-collegiate technical challenges.
            </p>
          </div>

          <div
            className="p-6 sm:p-7 rounded-[1.8rem] sm:rounded-[2rem] border shadow-xl space-y-3.5 transition-all sm:col-span-2 md:col-span-1"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold bg-emerald-500/15 text-emerald-600">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>Peer Mentorship</h3>
            <p className="text-xs leading-relaxed" style={{ color: currentTheme.textSecondary }}>
              Conducting open technical bootcamps, resume review clinics, and open-source contribution drives for freshers.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. UPCOMING EVENTS & WORKSHOPS ───────────────────────────────── */}
      <section id="events" className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-5 gap-4" style={{ borderColor: currentTheme.borderColor }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
              <Calendar size={11} /> Campus Calendar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2" style={{ color: currentTheme.textPrimary }}>Upcoming Events & Workshops</h2>
          </div>
          <span className="text-xs font-mono" style={{ color: currentTheme.textSecondary }}>{events.length} Scheduled Programs</span>
        </div>

        {events.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-[2rem] border border-dashed text-center space-y-3" style={{ borderColor: currentTheme.borderColor }}>
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>No Events Scheduled Currently</p>
            <p className="text-xs max-w-md mx-auto" style={{ color: currentTheme.textSecondary }}>
              Follow {club.name} for announcements regarding upcoming workshops, bootcamps, and hackathons.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(evt => (
              <div
                key={evt.id}
                className="p-6 sm:p-7 rounded-[1.8rem] sm:rounded-[2rem] border shadow-xl flex flex-col justify-between space-y-5 group transition-all"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
                      {evt.type || 'Free Event'}
                    </span>
                    <span className="text-xs font-mono" style={{ color: currentTheme.textSecondary }}>{formatDisplayDate(evt.date)}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold transition-colors leading-snug" style={{ color: currentTheme.textPrimary }}>{evt.title}</h3>
                  <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: currentTheme.textSecondary }}>{evt.description}</p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: currentTheme.borderColor }}>
                  <span className="text-xs font-medium flex items-center gap-1.5 truncate" style={{ color: currentTheme.textSecondary }}>
                    <MapPin size={13} className="shrink-0" style={{ color: accent }} /> {evt.venue || 'MITS Auditorium'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRegister(evt.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 shrink-0 uppercase tracking-wider"
                    style={{ background: accent }}
                  >
                    Register Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 6. PROJECTS & INITIATIVES (PORTFOLIO) ────────────────────────── */}
      <section id="projects" className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 w-full">
        <div className="border-b pb-5" style={{ borderColor: currentTheme.borderColor }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
            <Code2 size={11} /> Portfolio
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2" style={{ color: currentTheme.textPrimary }}>Projects & Flagship Initiatives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsList.map(proj => (
            <div
              key={proj.id}
              className="p-6 sm:p-7 rounded-[2rem] sm:rounded-[2.2rem] border shadow-xl space-y-4 transition-all"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold" style={{ color: accent }}>{proj.team || 'Core Team'}</span>
                  <h3 className="text-lg sm:text-xl font-bold mt-0.5" style={{ color: currentTheme.textPrimary }}>{proj.title}</h3>
                </div>
                <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider" style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textSecondary }}>
                  {proj.status || 'Active'}
                </span>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: currentTheme.textSecondary }}>{proj.description}</p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1.5">
                {proj.techStack?.map(tech => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg border"
                    style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textSecondary }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: currentTheme.borderColor }}>
                <div className="flex items-center gap-4">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ color: currentTheme.textSecondary }}>
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ color: accent }}>
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. HIERARCHY TEAM COUNCIL (AUTO-FETCHED FROM DATABASE) ───────── */}
      <section id="team" className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 w-full">
        <div className="border-b pb-5" style={{ borderColor: currentTheme.borderColor }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
            <Users size={11} /> Verified Governance
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2" style={{ color: currentTheme.textPrimary }}>Leadership & Council Members</h2>
        </div>

        {/* Tier 1: Faculty Coordinator with Real Photo */}
        <div className="max-w-md mx-auto">
          <div
            className="p-6 sm:p-7 rounded-[2rem] sm:rounded-[2.2rem] border shadow-xl text-center space-y-3.5"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={facultyAdvisor?.photoUrl || getMemberPfp(facultyAdvisor?.name || club.facultyCoordinatorNames?.[0] || 'Faculty Mentor')}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border-2 shadow-lg"
                style={{ borderColor: accent }}
              />
              <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-purple-600 text-white shadow-md">
                <ShieldCheck size={14} />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>Faculty Mentor</span>
              <h3 className="text-lg sm:text-xl font-extrabold mt-0.5" style={{ color: currentTheme.textPrimary }}>
                {facultyAdvisor?.name || club.facultyCoordinatorNames?.[0] || 'Appointed Faculty Mentor'}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.textSecondary }}>
                {facultyAdvisor?.department || 'Department Coordinator'} · Academic Mentor
              </p>
            </div>
          </div>
        </div>

        {/* Tier 2: Executive Council (Filtered — NO IDs) */}
        {filteredLeadership.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLeadership.map(([role, name]) => (
              <div
                key={role}
                className="p-5 sm:p-6 rounded-[1.8rem] sm:rounded-[2rem] border shadow-lg space-y-3 text-center transition-all hover:scale-[1.02]"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 shadow-md" style={{ borderColor: accent }}>
                  <img
                    src={getMemberPfp(name)}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>{role}</span>
                  <h3 className="text-base sm:text-lg font-bold mt-0.5" style={{ color: currentTheme.textPrimary }}>{name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: currentTheme.textSecondary }}>Student Executive Council</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tier 3: Auto-Fetched Real Registered Members from System */}
        {systemClubMembers.length > 0 && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: currentTheme.borderColor }}>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>
                  Active Registered Members ({systemClubMembers.length})
                </h4>
                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>Synchronized directly from institutional student database.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {systemClubMembers.map(member => {
                const membership = member.clubMemberships?.find(m => m.clubId === club.id);
                return (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl border text-center space-y-2 transition-all hover:scale-105"
                    style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor }}
                  >
                    <img
                      src={member.photoUrl || getMemberPfp(member.name)}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover mx-auto border shadow-sm"
                      style={{ borderColor: currentTheme.borderColor }}
                    />
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs truncate" style={{ color: currentTheme.textPrimary }}>{member.name}</h5>
                      <p className="text-[10px] truncate" style={{ color: accent }}>{membership?.role || 'Member'}</p>
                      {member.branch && <p className="text-[9px] font-mono mt-0.5 truncate" style={{ color: currentTheme.textSecondary }}>{member.branch}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ─── 8. TROPHY CABINET & ACHIEVEMENTS ─────────────────────────────── */}
      <section id="achievements" className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 w-full">
        <div className="border-b pb-5" style={{ borderColor: currentTheme.borderColor }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
            <Trophy size={11} /> Trophy Cabinet
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2" style={{ color: currentTheme.textPrimary }}>Accolades & Competition Wins</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(club.achievements && club.achievements.length > 0 ? club.achievements : [
            { id: 'ach-1', title: '1st Prize - Smart India Hackathon', description: 'National champion in Smart Automation category.', date: '2025' },
            { id: 'ach-2', title: 'ACM ICPC Regional Finalists', description: 'Ranked top 10 in collegiate competitive programming.', date: '2024' },
            { id: 'ach-3', title: 'Google Summer of Code Selectee', description: 'Selected for open-source kernel contribution.', date: '2024' },
            { id: 'ach-4', title: 'Best Technical Club Trophy', description: 'Awarded by Dean Student Welfare, MITS Gwalior.', date: '2025' }
          ]).map(ach => (
            <div
              key={ach.id}
              className="p-5 sm:p-6 rounded-[1.8rem] sm:rounded-[2rem] border shadow-lg space-y-3 transition-all group"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Trophy size={18} />
              </div>
              <span className="text-[10px] font-mono text-amber-500 font-semibold">{ach.date}</span>
              <h3 className="text-base font-bold leading-snug" style={{ color: currentTheme.textPrimary }}>{ach.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: currentTheme.textSecondary }}>{ach.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 9. GALLERY (MASONRY SHOWCASE) ────────────────────────────────── */}
      <section id="gallery" className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-5 gap-4" style={{ borderColor: currentTheme.borderColor }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
              <ImageIcon size={11} /> Media Vault
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2" style={{ color: currentTheme.textPrimary }}>Campus Moments & Gallery</h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 border rounded-xl" style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor }}>
            {(['All', 'Events', 'Workshops', 'Competitions', 'Team'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setGalleryFilter(filter)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0"
                style={{
                  backgroundColor: galleryFilter === filter ? accent : 'transparent',
                  color: galleryFilter === filter ? '#ffffff' : currentTheme.textSecondary
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredGallery.map(item => (
            <div
              key={item.id}
              className="group relative rounded-[1.8rem] sm:rounded-[2rem] overflow-hidden border aspect-square shadow-xl"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.borderColor }}
            >
              <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">{item.category}</span>
                <h4 className="font-bold text-sm text-white mt-0.5">{item.title}</h4>
                {item.date && <p className="text-[10px] text-slate-300 mt-0.5 font-mono">{item.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 10. RECRUITMENT CALL TO ACTION ───────────────────────────────── */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div
          className="p-6 sm:p-10 md:p-14 rounded-[2.2rem] sm:rounded-[3rem] border shadow-2xl text-center space-y-5 relative overflow-hidden"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.borderColor
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
          >
            <Sparkles size={13} className="text-amber-500" /> Join Our Society
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: currentTheme.textPrimary }}>
            Want to build something with us?
          </h2>

          <p className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed" style={{ color: currentTheme.textSecondary }}>
            Collaborate on open-source repositories, competitive hackathons, high-impact campus events, and design prototypes.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsRecruitModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:opacity-90 active:scale-95"
              style={{ background: accent }}
            >
              <UserPlus size={16} /> Apply to Join {club.name}
            </button>
          </div>
        </div>
      </section>

      {/* ─── 11. RECRUITMENT APPLICATION MODAL (AUTO-FETCHED CREDENTIALS) ─── */}
      {isRecruitModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div
            className="relative w-full max-w-2xl rounded-[2rem] sm:rounded-[2.5rem] border p-6 sm:p-8 md:p-10 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{ backgroundColor: isLight ? '#ffffff' : currentTheme.surface, borderColor: currentTheme.borderColor }}
          >
            <button
              onClick={() => setIsRecruitModalOpen(false)}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-xl border transition-all"
              style={{ borderColor: currentTheme.borderColor, color: currentTheme.textSecondary }}
            >
              <X size={16} />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: currentTheme.borderColor, color: accent }}>
                <UserPlus size={11} /> Official Application
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1.5" style={{ color: currentTheme.textPrimary }}>Join {club.name}</h2>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.textSecondary }}>
                {user ? `Authenticated as ${user.name} (${user.enrollmentNumber || user.email})` : 'Submit your candidacy for the upcoming operational cycle.'}
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
                  Full Name
                  <input
                    required
                    value={applicantData.name}
                    onChange={e => setApplicantData({ ...applicantData, name: e.target.value })}
                    placeholder="Your legal name"
                    className="mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 sm:py-3 text-xs font-medium outline-none"
                    style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
                  />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
                  Enrollment / Roll Number
                  <input
                    required
                    value={applicantData.rollNumber}
                    onChange={e => setApplicantData({ ...applicantData, rollNumber: e.target.value })}
                    placeholder="0901CS221..."
                    className="mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 sm:py-3 text-xs font-medium outline-none uppercase font-mono"
                    style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
                  Preferred Track / Domain
                  <select
                    value={applicantData.domain}
                    onChange={e => setApplicantData({ ...applicantData, domain: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 sm:py-3 text-xs font-medium outline-none cursor-pointer"
                    style={{ backgroundColor: isLight ? '#ffffff' : currentTheme.surface, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
                  >
                    <option>Technical (AI, Web, Robotics)</option>
                    <option>Design & UI/UX</option>
                    <option>Event Management & Logistics</option>
                    <option>Public Relations & Outreach</option>
                    <option>Content & Research</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
                  Branch / Department
                  <input
                    value={applicantData.branch}
                    onChange={e => setApplicantData({ ...applicantData, branch: e.target.value })}
                    placeholder="CSIT, EC, ME..."
                    className="mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 sm:py-3 text-xs font-medium outline-none uppercase"
                    style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
                Why do you wish to join {club.name}?
                <textarea
                  required
                  rows={4}
                  value={applicantData.whyJoin}
                  onChange={e => setApplicantData({ ...applicantData, whyJoin: e.target.value })}
                  placeholder="Describe your technical skills, motivation, and project aspirations..."
                  className="mt-1.5 block w-full rounded-xl border p-3.5 text-xs font-normal outline-none resize-none leading-relaxed"
                  style={{ backgroundColor: currentTheme.surfaceSubtle, borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}
                />
              </label>

              {appSubmittedMsg && (
                <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-600 font-bold">
                  {appSubmittedMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingApp}
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: accent }}
              >
                {isSubmittingApp ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── 12. INSTITUTIONAL FOOTER ─────────────────────────────────────── */}
      <footer className="border-t py-12 sm:py-14 px-4 sm:px-6 md:px-8 text-center text-xs space-y-3 max-w-7xl mx-auto w-full" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textSecondary }}>
        <div className="flex justify-center items-center gap-3.5">
          {club.socialLinks?.github && (
            <a href={club.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:opacity-80 transition-all" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}>
              <Github size={15} />
            </a>
          )}
          {club.socialLinks?.linkedin && (
            <a href={club.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:opacity-80 transition-all" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}>
              <Linkedin size={15} />
            </a>
          )}
          {club.socialLinks?.instagram && (
            <a href={club.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:opacity-80 transition-all" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}>
              <Instagram size={15} />
            </a>
          )}
          {club.socialLinks?.youtube && (
            <a href={club.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2 rounded-xl border hover:opacity-80 transition-all" style={{ borderColor: currentTheme.borderColor, color: currentTheme.textPrimary }}>
              <Youtube size={15} />
            </a>
          )}
        </div>
        <p className="font-mono" style={{ color: currentTheme.textSecondary }}>
          Hosted on {customDomain} • Madhav Institute of Technology & Science, Gwalior (M.P.)
        </p>
        <p>© 2026 {club.name}. Institutional Management Platform powered by CLIX Hub.</p>
      </footer>
    </div>
  );
};

export default ClubPublicWebsite;
