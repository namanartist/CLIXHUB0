import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Globe,
  CheckCircle2,
  ScanLine,
  type LucideIcon,
} from 'lucide-react';
import { Role, ClubRole } from '../types';

export interface MobileNavTabDef {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Route tab id for the current scope */
  tabId: string;
  /** Tab ids that should highlight this bottom-nav item */
  matchTabs: string[];
}

export function getDefaultHomeTab(activeContext: string, userRole: Role): string {
  if (activeContext !== 'Global') return 'club-dashboard';
  if (userRole === Role.SUPER_ADMIN) return 'admin-dashboard';
  if (userRole === Role.FACULTY || userRole === Role.DEAN) return 'faculty-dashboard';
  return 'dashboard';
}

export function getMobileNavTabs(
  activeContext: string,
  userRole: Role,
  clubRole: ClubRole | null,
  isGlobalAdmin: boolean
): MobileNavTabDef[] {
  const inClub = activeContext !== 'Global';
  const isClubAdmin = Boolean(clubRole && clubRole !== ClubRole.MEMBER) || isGlobalAdmin;

  if (!inClub) {
    switch (userRole) {
      case Role.SUPER_ADMIN:
        return [
          {
            id: 'home',
            label: 'Home',
            icon: LayoutDashboard,
            tabId: 'admin-dashboard',
            matchTabs: ['admin-dashboard', 'dashboard', ''],
          },
          {
            id: 'chat',
            label: 'Chats',
            icon: MessageSquare,
            tabId: 'chat',
            matchTabs: ['chat'],
          },
          {
            id: 'clubs',
            label: 'Clubs',
            icon: Globe,
            tabId: 'clubs',
            matchTabs: ['clubs', 'analytics', 'student-registry', 'faculty-registry', 'global-audit'],
          },
        ];
      case Role.FACULTY:
      case Role.DEAN:
        return [
          {
            id: 'home',
            label: 'Home',
            icon: LayoutDashboard,
            tabId: 'faculty-dashboard',
            matchTabs: ['faculty-dashboard', 'dashboard'],
          },
          {
            id: 'chat',
            label: 'Chats',
            icon: MessageSquare,
            tabId: 'chat',
            matchTabs: ['chat'],
          },
          {
            id: 'approvals',
            label: 'Review',
            icon: CheckCircle2,
            tabId: 'approvals',
            matchTabs: ['approvals', 'reports'],
          },
        ];
      default:
        return [
          {
            id: 'home',
            label: 'Home',
            icon: LayoutDashboard,
            tabId: 'dashboard',
            matchTabs: ['dashboard', ''],
          },
          {
            id: 'chat',
            label: 'Chats',
            icon: MessageSquare,
            tabId: 'chat',
            matchTabs: ['chat'],
          },
          {
            id: 'events',
            label: 'Events',
            icon: Calendar,
            tabId: 'events',
            matchTabs: ['events', 'tickets', 'recruitment', 'my-certificates', 'payments'],
          },
        ];
    }
  }

  const home: MobileNavTabDef = {
    id: 'home',
    label: 'Home',
    icon: LayoutDashboard,
    tabId: 'club-dashboard',
    matchTabs: ['club-dashboard'],
  };

  const chat: MobileNavTabDef = {
    id: 'chat',
    label: 'Chats',
    icon: MessageSquare,
    tabId: 'chat',
    matchTabs: ['chat'],
  };

  if (isClubAdmin) {
    return [
      home,
      chat,
      {
        id: 'ops',
        label: 'Events',
        icon: Calendar,
        tabId: 'club-events',
        matchTabs: [
          'club-events',
          'attendance',
          'members',
          'recruitment',
          'club-finance',
          'certificates',
          'site-editor',
          'club-settings',
        ],
      },
    ];
  }

  return [
    home,
    chat,
    {
      id: 'attend',
      label: 'Attend',
      icon: ScanLine,
      tabId: 'attendance',
      matchTabs: ['attendance', 'website'],
    },
  ];
}

const CLUB_ONLY_TABS = new Set([
  'club-dashboard',
  'club-events',
  'club-finance',
  'members',
  'attendance',
  'website',
  'certificates',
  'site-editor',
  'club-settings',
]);

const GLOBAL_ONLY_TABS = new Set([
  'dashboard',
  'admin-dashboard',
  'faculty-dashboard',
  'events',
  'clubs', 'venue-availability', 'analytics',
  'student-registry',
  'faculty-registry',
  'global-audit',
  'approvals',
  'proposal-workflow',
  'reports',
  'tickets',
  'my-certificates',
  'payments',
]);

/** When scope changes, pick the closest tab in the new scope (or null to use default home). */
export function mapTabForScopeChange(
  currentTab: string,
  newContext: string,
  userRole: Role
): string {
  const toClub = newContext !== 'Global';

  if (toClub) {
    if (CLUB_ONLY_TABS.has(currentTab)) return currentTab;
    if (currentTab === 'chat') return 'chat';
    if (currentTab === 'events' || currentTab === 'tickets') return 'club-events';
    if (currentTab === 'clubs' || currentTab === 'recruitment') return 'club-dashboard';
    return 'club-dashboard';
  }

  if (GLOBAL_ONLY_TABS.has(currentTab) && !currentTab.startsWith('club-')) {
    return currentTab === '' ? getDefaultHomeTab('Global', userRole) : currentTab;
  }
  if (currentTab === 'chat') return 'chat';
  if (currentTab === 'club-events' || currentTab === 'attendance') {
    return userRole === Role.STUDENT ? 'events' : getDefaultHomeTab('Global', userRole);
  }
  if (currentTab === 'website') return 'clubs';
  return getDefaultHomeTab('Global', userRole);
}

export function isTabValidForScope(tab: string, activeContext: string): boolean {
  if (activeContext === 'Global') {
    return !CLUB_ONLY_TABS.has(tab);
  }
  return !GLOBAL_ONLY_TABS.has(tab) || tab === 'chat';
}
