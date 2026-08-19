import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Globe,
  ShieldCheck,
  FileText,
  Activity,
  CreditCard,
  ScanLine,
  Ticket,
  Settings as SettingsIcon,
  Layout,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  UserCog,
  ChevronDown,
  Hexagon,
  BarChart3,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { ClubRole, Role, User, Club } from '../../types';
import { getDefaultHomeTab } from '../../lib/mobileNavConfig';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarNavProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onContextChange: (id: string) => void;
  userRole: Role;
  clubRole: ClubRole | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  onClose: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  user, clubs, activeContext, onContextChange, userRole, clubRole, activeTab, setActiveTab, isDarkMode, onClose
}) => {
  const userRoleStr = String(userRole || '').toLowerCase();
  const userEmail = (user?.email || '').toLowerCase();
  const isSuperAdmin = userRole === Role.SUPER_ADMIN || userRoleStr === 'super admin' || userRoleStr === 'super_admin' || userEmail === 'admin@mitsgwl.ac.in';
  const isDean = userRole === Role.DEAN || userRoleStr === 'dean' || userEmail === 'dean.sw@mitsgwl.ac.in' || userEmail.includes('dean');
  const isFaculty = !isDean && !isSuperAdmin && (userRole === Role.FACULTY || userRoleStr === 'faculty' || userEmail.includes('faculty') || !!user?.designation);
  const isStudent = !isSuperAdmin && !isDean && !isFaculty;

  const [expandedClub, setExpandedClub] = useState<string | null>(
    activeContext !== 'Global' ? activeContext : null
  );

  // ── Global nav items, scoped per role ────────────────────────────────────
  const globalItems: SidebarItem[] = (() => {
    if (isSuperAdmin) return [
      { id: 'admin-dashboard', label: 'Admin Hub', icon: ShieldCheck },
      { id: 'chat', label: 'Messages', icon: MessageSquare },
      { id: 'user-registry', label: 'User Registry', icon: Users },
      { id: 'clubs', label: 'Club Assets', icon: Globe },
      { id: 'venue-availability', label: 'Venue Availability', icon: Building2 },
      { id: 'analytics', label: 'Analytics', icon: Activity },
      { id: 'global-audit', label: 'Audit Logs', icon: FileText },
    ];

    if (isDean) return [
      { id: 'dashboard', label: 'Dean Dashboard', icon: LayoutDashboard },
      { id: 'chat', label: 'Messages', icon: MessageSquare },
      { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
      { id: 'reports', label: 'KPI Reports', icon: BarChart3 },
    ];

    if (isFaculty) return [
      { id: 'faculty-dashboard', label: 'Faculty Feed', icon: LayoutDashboard },
      { id: 'chat', label: 'Messages', icon: MessageSquare },
      { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
      { id: 'reports', label: 'KPI Reports', icon: BarChart3 },
    ];

    // Student
    return [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'chat', label: 'Messages', icon: MessageSquare },
      { id: 'clubs', label: 'Club Directory', icon: Globe },
      { id: 'events', label: 'Campus Events', icon: Calendar },
      { id: 'recruitment', label: 'My Applications', icon: Briefcase },
      { id: 'my-certificates', label: 'My Certificates', icon: Award },
      { id: 'tickets', label: 'My Tickets', icon: Ticket },
      { id: 'payments', label: 'My Payments', icon: CreditCard },
    ];
  })();

  // ── Which clubs appear in sidebar ────────────────────────────────────────
  const sidebarClubs = (isSuperAdmin || isFaculty || isDean)
    ? clubs
    : clubs.filter(c => user.clubMemberships.some(m => m.clubId === c.id));

  // ── Club sub-menu items, scoped per role ─────────────────────────────────
  const getClubItems = (clubId: string): SidebarItem[] => {
    const base: SidebarItem[] = [
      { id: 'club-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'chat', label: 'Club Chat', icon: MessageSquare },
      { id: 'attendance', label: 'Attendance', icon: ScanLine },
      { id: 'website', label: 'Public Page', icon: Globe },
    ];

    const memberRole = user.clubMemberships.find(m => m.clubId === clubId)?.role;
    const isClubAdmin = memberRole && memberRole !== ClubRole.MEMBER;
    const isGlobalStaff = isSuperAdmin || isFaculty || isDean;

    if (isClubAdmin || isGlobalStaff) {
      base.push(
        { id: 'members', label: 'Members', icon: Users },
        { id: 'club-events', label: 'Events', icon: Calendar }
      );

      // Faculty is strictly blocked from finances
      if (!isFaculty) {
        base.push({ id: 'club-finance', label: 'Finance', icon: CreditCard });
      }

      base.push(
        { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'site-editor', label: 'Site Editor', icon: Layout }
      );
    }

    // Only President or Super Admin can access Settings
    if (memberRole === ClubRole.PRESIDENT || isSuperAdmin) {
      base.push({ id: 'club-settings', label: 'Settings', icon: SettingsIcon });
    }

    return base;
  };

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleGlobalTabClick = (tabId: string) => {
    if (activeContext !== 'Global') onContextChange('Global');
    setActiveTab(tabId);
    setExpandedClub(null);
    onClose();
  };

  const handleClubClick = (clubId: string) => {
    if (expandedClub === clubId && activeContext === clubId) {
      setExpandedClub(null);
    } else {
      setExpandedClub(clubId);
      if (activeContext !== clubId) {
        onContextChange(clubId);
        setActiveTab('club-dashboard');
      }
    }
  };

  const handleClubTabClick = (clubId: string, tabId: string) => {
    if (activeContext !== clubId) onContextChange(clubId);
    setActiveTab(tabId);
    onClose();
  };

  // ── Section label per role ────────────────────────────────────────────────
  const globalSectionLabel = isSuperAdmin
    ? 'System Control'
    : isDean
      ? 'Dean Portal'
      : isFaculty
        ? 'Faculty Portal'
        : 'My Dashboard';

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-2 custom-scrollbar">
      {activeContext === 'Global' ? (
        /* ── Global Section ── */
        <div className="space-y-1">
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50 mb-3 mt-1">
            {globalSectionLabel}
          </p>

          {globalItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeContext === 'Global' && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleGlobalTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-primary/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--primary-soft)]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`}
                  />
                  <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* ── Club-specific Perspective Section ── */
        <div className="space-y-1 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="px-4 mb-4 mt-1 flex items-center justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50 truncate max-w-[180px]">
              {clubs.find(c => c.id === activeContext)?.name || 'Club Domain'}
            </p>
            <button
              onClick={() => handleGlobalTabClick(getDefaultHomeTab('Global', userRole))}
              className="text-[9px] font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1 cursor-pointer transition-all"
            >
              ← Global
            </button>
          </div>

          {getClubItems(activeContext).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClubTabClick(activeContext, item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-primary/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--primary-soft)]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`}
                  />
                  <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
