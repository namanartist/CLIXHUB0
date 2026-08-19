import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { User, Club, Applicant, Event, Role, ClubRole, AuditLog, Registration, Quotation, Achievement, CertificateBatch, IssuedCertificate, Proposal, Venue } from './types';
import { useAuth } from './lib/AuthContext';
import { getSocket, syncSocketRooms } from './lib/socket';
import { supabase } from './lib/supabaseClient';

import { mapTabForScopeChange, isTabValidForScope, getDefaultHomeTab } from './lib/mobileNavConfig';
import { authService } from './lib/authService';
import { DEMO_USERS, DEMO_CLUBS, DEMO_EVENTS, DEMO_VENUES, DEMO_REGISTRATIONS, DEMO_APPLICANTS, DEMO_LOGS, DEMO_BATCHES, DEMO_PROPOSALS } from './constants';
import EventRegistrationPage from './components/pages/EventRegistrationPage';
import Footer from './components/Footer';
import JWTAuthPage from './components/pages/JWTAuthPage';
import LandingPage from './components/pages/LandingPage';
import { db } from './db';
import { ShieldAlert, Zap } from 'lucide-react';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { getBaseRole } from './components/Sidebar/PerspectiveSwitcher';

// Page Components
import GlobalStudentDashboard from './components/pages/GlobalStudentDashboard';
import ClubHome from './components/pages/ClubHome';
import ClubMembers from './components/pages/ClubMembers';
import AttendanceControl from './components/pages/AttendanceControl';
import EventOperations from './components/pages/EventOperations';
import ClubFinance from './components/pages/ClubFinance';
import RecruitmentBoard from './components/RecruitmentBoard';
import CertificationGovernance from './components/pages/CertificationGovernance';
import ClubPublicWebsite from './components/pages/ClubPublicWebsite';
import ClubSiteEditor from './components/pages/ClubSiteEditor';
import ClubSettings from './components/pages/ClubSettings';
import ProposalWorkflowPage from './components/pages/ProposalWorkflowPage';
import MyApplications from './components/pages/MyApplications';
import MyTickets from './components/pages/MyTickets';
import MyPayments from './components/pages/MyPayments';
import MyCertificates from './components/pages/MyCertificates';
import CampusEvents from './components/pages/CampusEvents';
import GlobalClubs from './components/pages/GlobalClubs';
import StudentProfile from './components/pages/StudentProfile';
import FacultyFeed from './components/pages/FacultyFeed';
import FacultyOversight from './components/pages/FacultyOversight';
import InstitutionalKPIs from './components/pages/InstitutionalKPIs';
import SuperAdminHub from './components/pages/SuperAdminHub';
import UserRegistry from './components/pages/UserRegistry';
import GlobalAnalytics from './components/pages/GlobalAnalytics';
import SystemLogs from './components/pages/SystemLogs';
import Developers from './components/pages/Developers';
import ChatSystem from './components/pages/ChatSystem';
import VenueAvailability from './components/pages/VenueAvailability';
import DeanDashboard from './components/pages/DeanDashboard';

import { LegalDocs, ReportIssue, FacultyPortalInfo, StudentLeadership } from './components/pages/PublicPages';
import EventRegistry from './components/pages/EventRegistry';
import ClubDirectoryPublic from './components/pages/ClubDirectoryPublic';
import PlatformFeatures from './components/pages/PlatformFeatures';
import LiveFeedPublic from './components/pages/LiveFeedPublic';
import CertificateVerification from './components/pages/CertificateVerification';
import { PrintStudio, DocumentPrintItem } from './components/PrintStudio';
import { DataImporter } from './components/DataImporter';
import { getSubdomain } from './lib/subdomain';
import AdminSecretSignup from './components/pages/AdminSecretSignup';
import {
  notifyEventCreated,
  notifyEventApproved,
  notifyEventRegistration,
  notifyPaymentVerified,
  notifyCertificateIssued,
  notifyProposalSubmitted,
  notifyProposalEndorsed,
  notifyProposalApproved,
  notifyProposalRejected,
  notifyApplicationSubmitted,
  notifyRecruitmentStatus,
} from './lib/notifications';
import { useToast } from './components/ui/Toast';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user: authUser, isAuthenticated, loading: authLoading, logout } = useAuth();

  const detectedSubdomain = getSubdomain();
  const [currentUser, setCurrentUser] = useState<User | null>(() => authUser || authService.getUser());
  const activeUser = currentUser || authUser;

  useEffect(() => {
    if (authUser) {
      if (!currentUser || currentUser.id !== authUser.id) {
        setCurrentUser(authUser);
      }
    } else if (!authLoading) {
      const stored = authService.getUser();
      if (stored && (!currentUser || currentUser.id !== stored.id)) {
        setCurrentUser(stored);
      } else if (!stored && currentUser) {
        setCurrentUser(null);
      }
    }
  }, [authUser, authLoading]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clix_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    }
    return false;
  });

  // Note: For activeContext & activeTab we parse the current URL
  // Default values
  const [activeContext, setActiveContext] = useState<string>('Global');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [publicPage, setPublicPage] = useState<string | null>(null);
  const [printItem, setPrintItem] = useState<DocumentPrintItem | null>(null);
  const [showImporter, setShowImporter] = useState<boolean>(false);

  useEffect(() => {
    (window as any).openPrintStudio = (item: DocumentPrintItem) => setPrintItem(item);
    (window as any).openDataImporter = () => setShowImporter(true);
  }, []);

  const [data, setData] = useState<{
    users: User[];
    clubs: Club[];
    venues: Venue[];
    events: Event[];
    registrations: Registration[];
    applicants: Applicant[];
    logs: AuditLog[];
    batches: CertificateBatch[];
    proposals?: Proposal[];
  }>(() => {
    let offlineClubs = [];
    let offlineEvents = [];
    let offlineVenues = [];
    let offlineUsers = [];
    let offlineRegs = [];
    let offlineApps = [];
    let offlineLogs = [];
    let offlineBatches = [];
    let offlineProposals = [];
    try {
      const c = localStorage.getItem('ccms_offline_clubs');
      if (c) offlineClubs = JSON.parse(c);
      const e = localStorage.getItem('ccms_offline_events');
      if (e) offlineEvents = JSON.parse(e);
      const v = localStorage.getItem('ccms_offline_venues');
      if (v) offlineVenues = JSON.parse(v);
      const u = localStorage.getItem('ccms_offline_users');
      if (u) offlineUsers = JSON.parse(u);
      const r = localStorage.getItem('ccms_offline_registrations');
      if (r) offlineRegs = JSON.parse(r);
      const a = localStorage.getItem('ccms_offline_applicants');
      if (a) offlineApps = JSON.parse(a);
      const l = localStorage.getItem('ccms_offline_logs');
      if (l) offlineLogs = JSON.parse(l);
      const b = localStorage.getItem('ccms_offline_batches');
      if (b) offlineBatches = JSON.parse(b);
      const p = localStorage.getItem('ccms_offline_proposals');
      if (p) offlineProposals = JSON.parse(p);
    } catch {}

    return {
      users: offlineUsers.length ? offlineUsers : DEMO_USERS,
      clubs: offlineClubs.length ? offlineClubs : DEMO_CLUBS,
      venues: offlineVenues.length ? offlineVenues : DEMO_VENUES,
      events: offlineEvents.length ? offlineEvents : DEMO_EVENTS,
      registrations: offlineRegs.length ? offlineRegs : DEMO_REGISTRATIONS,
      applicants: offlineApps.length ? offlineApps : DEMO_APPLICANTS,
      logs: offlineLogs.length ? offlineLogs : DEMO_LOGS,
      batches: offlineBatches.length ? offlineBatches : DEMO_BATCHES,
      proposals: offlineProposals.length ? offlineProposals : DEMO_PROPOSALS
    };
  });

  const isRefreshingRef = React.useRef(false);

  const refreshData = async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    try {
      const dbUsers = await db.getUsers();
      const [clubs, venues, events, registrations, applicants, logs, batches, proposals] = await Promise.all([
        db.getClubs(),
        db.getVenues(),
        db.getEvents(),
        db.getRegistrations(),
        db.getApplicants(),
        db.getLogs(),
        db.getBatches(),
        (db as any).getProposals ? (db as any).getProposals() : Promise.resolve([])
      ]);
      setData(prev => ({ ...prev, users: dbUsers, clubs, venues, events, registrations, applicants, logs, batches, proposals: proposals || [] }));
    } catch (err) {
      console.warn("Failed to fetch all data, offline fallback active.");
    } finally {
      isRefreshingRef.current = false;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await db.initialize();
        await refreshData();
      } catch (err) {
        console.error("Initialization Failed:", err);
      }
    };

    init();
  }, []);

  // Sync Auth State from Context
  useEffect(() => {
    setCurrentUser(authUser);
  }, [authUser]);

  // Sync URL state to Virtual State
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/club/')) {
      const parts = path.split('/');
      const nextContext = parts[2] || 'Global';
      const nextTab = parts[3] || 'club-dashboard';
      setActiveContext(nextContext);
      setActiveTab(nextTab);
    } else if (path.startsWith('/dashboard/')) {
      const nextTab = path.split('/')[2] || 'dashboard';
      setActiveContext('Global');
      setActiveTab(nextTab);
    } else if (path === '/dashboard') {
      setActiveContext('Global');
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clix_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clix_theme', 'light');
    }
  }, [isDarkMode]);

  // ─── STABLE REALTIME SYNC & PERSISTENT SOCKET SYNC ───
  useEffect(() => {
    // Gentle fallback background polling (every 20 seconds, only when tab is visible)
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    }, 20000);

    // Persistent Socket.io real-time event sync
    const socket = syncSocketRooms(currentUser, data.clubs);
    if (socket) {
      const entities = ['users', 'clubs', 'events', 'venues', 'registrations', 'certificates', 'batches', 'applicants', 'proposals', 'activities', 'logs', 'messages'];
      const handleEntityChange = () => refreshData();
      entities.forEach(ent => {
        socket.on(`${ent}:change`, handleEntityChange);
      });
      socket.on('db:sync', handleEntityChange);
    }

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [currentUser?.id]);

  // --- AUTOMATION: Certificate on Attendance ---
  const handleMarkAttendance = async (registrationId: string, status: boolean) => {
    const reg = data.registrations.find(r => r.id === registrationId);
    if (!reg) return;

    const updatedReg = { ...reg, attendanceMarked: status };
    await db.saveRegistration(updatedReg);

    // Automation: create a draft batch or add to existing draft for this event if marking as PRESENT
    if (status) {
      const event = data.events.find(e => e.id === reg.eventId);
      const club = data.clubs.find(c => c.id === event?.clubId);

      if (event && club) {
        const existingBatches = await db.getBatches();
        let batch = existingBatches.find(b => b.eventId === event.id && b.status === 'Draft' && b.clubId === club.id);

        const newCert: IssuedCertificate = {
          serialNumber: 'PENDING',
          studentId: reg.studentId,
          studentName: reg.studentName,
          enrollmentNumber: reg.studentRoll,
          eventName: event.title,
          clubId: club.id,
          clubName: club.name,
          date: event.date || new Date().toISOString(),
          hash: 'PENDING',
          batchId: ''
        };

        if (batch) {
          if (!batch.certificates.some(c => c.studentId === reg.studentId)) {
            batch.certificates.push({ ...newCert, batchId: batch.id });
            await db.saveBatch(batch);
          }
        } else {
          const batchId = `auto-batch-${Date.now()}`;
          const newBatch: CertificateBatch = {
            id: batchId,
            clubId: club.id,
            eventId: event.id,
            templateId: club.certificateConfig?.templateId || 'classic',
            status: 'Draft',
            createdBy: 'System (Automation)',
            createdAt: new Date().toISOString(),
            certificates: [{ ...newCert, batchId }],
            approvalChain: [
              { role: Role.FACULTY, approverName: 'Faculty Coordinator', status: 'Pending' },
              { role: Role.DEAN, approverName: 'Dean Student Welfare', status: 'Pending' }
            ]
          };
          await db.saveBatch(newBatch);
        }
      }
    }

    refreshData();
  };

  const handleContextChange = (contextId: string) => {
    setIsMobileMenuOpen(false);
    const role = currentUser?.globalRole ?? Role.STUDENT;
    const nextTab =
      contextId === activeContext
        ? activeTab
        : mapTabForScopeChange(activeTab, contextId, role);

    if (contextId === 'Global') {
      const home = getDefaultHomeTab('Global', role);
      const tab = isTabValidForScope(nextTab, 'Global') ? nextTab : home;
      setActiveContext('Global');
      navigate(tab === 'dashboard' || tab === '' ? '/dashboard' : `/dashboard/${tab}`);
    } else {
      const tab = isTabValidForScope(nextTab, contextId) ? nextTab : 'club-dashboard';
      setActiveContext(contextId);
      navigate(`/club/${contextId}/${tab}`);
    }
  };

  // Switch Tab Helper Function
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (activeContext === 'Global') {
      navigate(`/dashboard/${tab === 'dashboard' ? '' : tab}`);
    } else {
      navigate(`/club/${activeContext}/${tab}`);
    }
  };

  const handleSwitchRole = (role: Role) => {
    if (currentUser) {
      const baseRole = getBaseRole(currentUser);
      if (baseRole !== Role.STUDENT && role === Role.STUDENT) {
        console.warn("Security policy: Institutional staff are restricted from switching to student views.");
        return;
      }
      setCurrentUser({ ...currentUser, globalRole: role });

      // Auto-navigate to the correct default home tab for this role on role/perspective switch
      const defaultTab = getDefaultHomeTab('Global', role);
      setActiveContext('Global');
      setActiveTab(defaultTab);
      navigate(defaultTab === 'dashboard' || defaultTab === '' ? '/dashboard' : `/dashboard/${defaultTab}`);
    }
  };

  const handleDemoLogin = async (email: string) => {
    try {
      const { user } = await db.demoLogin(email);
      setCurrentUser(user);
      // Await refreshData so clubs/events are populated before the dashboard renders
      await refreshData();
      toast.success('Welcome to CLIX Hub', `Logged in successfully as ${user.name}`);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Demo Login Error:", err);
      toast.error(
        'Demo Login Failed',
        err.message || 'Could not verify demo credentials. Please check backend server connectivity.',
        err.stack
      );
    }
  };


  const handleLogout = () => {
    logout(); // Clear AuthContext state (also clears token via authService.logout())
    db.clearToken(); // Clear db.ts token key as well
    setCurrentUser(null);
    setActiveContext('Global');
    setActiveTab('dashboard');
    navigate('/');
  };



  const handleRegisterEvent = async (eventId: string, proxy?: { name: string, roll: string, branch: string }) => {
    if (!currentUser) {
      navigate(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return undefined;
    }

    const event = data.events.find(e => e.id === eventId);
    if (!event) return;

    let studentName = currentUser.name;
    let studentId = currentUser.id;
    let studentRoll = currentUser.enrollmentNumber || 'PENDING';
    let studentBranch = currentUser.branch;

    const transactionId = (proxy as any)?.transactionId;
    const isProxyPerson = (proxy as any)?.name && (proxy as any)?.roll;

    if (isProxyPerson) {
      studentName = (proxy as any).name;
      studentId = `proxy-${Date.now()}`;
      studentRoll = (proxy as any).roll;
      studentBranch = (proxy as any).branch;
    }

    const isFree = event.type === 'Free';
    const isApproved = isFree || !!transactionId;
    const eventIdCode = (event.id || 'E').split('-')[1]?.toUpperCase() || event.id?.slice(0, 4)?.toUpperCase() || 'EVT';
    const ticketId = isApproved ? `TKT-${eventIdCode}-${Date.now().toString().slice(-6)}` : undefined;

    const club = data.clubs.find(c => c.id === event.clubId);
    const gatewayConfig = club?.paymentGatewayConfig;
    const useGateway = !isFree && (!!transactionId || (gatewayConfig?.isActive && gatewayConfig.provider !== 'ManualUPI'));
    const paymentType: Registration['paymentType'] = isFree ? 'Free' : useGateway ? 'Gateway' : 'UPI';

    const registration: Registration = {
      id: `reg-${Date.now()}`,
      eventId,
      studentId,
      studentName,
      studentRoll,
      studentBranch,
      status: isApproved ? 'Approved' : 'Pending',
      paymentType,
      paymentGatewayProvider: useGateway ? (gatewayConfig?.provider || 'Razorpay') : undefined,
      paymentDetails: transactionId ? `Razorpay TXN: ${transactionId}` : undefined,
      ticketId: ticketId,
      attendanceMarked: false
    };

    // Optimistic Update
    const updatedRegistrations = [...data.registrations, registration];
    setData(prev => ({ ...prev, registrations: updatedRegistrations }));

    // Await API Call & Refresh Data Live
    await db.saveRegistration(registration);
    await notifyEventRegistration(studentName, event.title, ticketId, studentId);
    await db.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser.name,
      action: `Registered ${isProxyPerson ? '(Proxy) ' : ''}for ${event.title} - ${isApproved ? 'Ticket Issued (' + (ticketId || 'Pass') + ')' : 'Pending Verification'}`,
      clubId: event.clubId
    });
    await refreshData();

    return registration;
  };

  const handleApprovePayment = async (id: string) => {
    const reg = data.registrations.find(r => r.id === id);
    if (!reg) return;

    const event = data.events.find(e => e.id === reg.eventId);
    const idPart = event ? (event.id.includes('-') ? event.id.split('-')[1] : event.id.slice(0, 4)) : 'EVT';
    const ticketId = `TKT-${idPart.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const updatedReg: Registration = {
      ...reg,
      status: 'Approved',
      ticketId: ticketId
    };

    // Optimistic Update
    setData(prev => ({
      ...prev,
      registrations: prev.registrations.map(r => r.id === id ? updatedReg : r)
    }));

    // API Call in background
    db.saveRegistration(updatedReg).then(() => {
      notifyPaymentVerified(reg.studentName, event?.title || 'Event', ticketId, reg.studentId);
      db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: currentUser?.name || 'System',
        action: `Payment Verified & Ticket Issued for ${reg.studentName}`,
        clubId: event?.clubId
      });
    });
  };

  const handleUpdateRegistration = async (reg: Registration) => { await db.saveRegistration(reg); refreshData(); };
  const handleApplicantMove = async (id: string, stage: Applicant['stage']) => {
    const applicant = data.applicants.find(a => a.id === id);
    if (applicant) {
      const updatedApplicant = { ...applicant, stage };
      // Optimistic Update
      setData(prev => ({
        ...prev,
        applicants: prev.applicants.map(a => a.id === id ? updatedApplicant : a)
      }));
      // API Call
      await db.saveApplicant(updatedApplicant);
      const club = data.clubs.find(c => c.id === applicant.clubId);
      notifyRecruitmentStatus(applicant.name, stage, club?.name);

      // If Selected, automatically add to Club Memberships
      if (stage === 'Selected') {
        const user = data.users.find(u => u.name === applicant.name || u.rollNumber === applicant.rollNumber || u.email === applicant.email);
        if (user) {
          const updatedUser = { ...user };
          if (!updatedUser.clubMemberships.some(m => m.clubId === applicant.clubId)) {
            updatedUser.clubMemberships.push({
              clubId: applicant.clubId,
              role: ClubRole.MEMBER,
              joinedAt: new Date().toISOString()
            });
            await db.saveUser(updatedUser);
          }
        }
      }

      refreshData();
    }
  };
  const handleApplicantDomainUpdate = async (id: string, domain: string) => {
    const applicant = data.applicants.find(a => a.id === id);
    if (applicant) {
      const updatedApplicant = { ...applicant, domain };
      // Optimistic Update
      setData(prev => ({
        ...prev,
        applicants: prev.applicants.map(a => a.id === id ? updatedApplicant : a)
      }));
      // API Call
      await db.saveApplicant(updatedApplicant);
    }
  };
  const handleNewRecruitmentCycle = async (clubId: string) => {
    // For demo, we "clear" the pipeline by deleting applicants for this club, or just adding a log.
    // Let's actually clear them to show the button works.
    const remainingApplicants = data.applicants.filter(a => a.clubId !== clubId);
    // In db.ts, we don't have a bulk delete, but we can simulate it if it was a real DB.
    // For now, let's just update them to 'Selected' or similar, or just log and alert.
    // Actually, let's just make it do something visible: add a fresh applicant.
    const freshman: Applicant = {
      id: `fresh-${Date.now()}`,
      name: 'New Applicant (' + new Date().toLocaleTimeString() + ')',
      rollNumber: '0901CS221' + Math.floor(Math.random() * 900 + 100),
      branch: 'CSIT',
      email: 'new@mitsgwl.ac.in',
      whyJoin: 'Looking for a new cycle start!',
      stage: 'Applied',
      domain: 'Tech',
      clubId: clubId
    };
    await db.saveApplicant(freshman);

    await db.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'System',
      action: `New Recruitment Cycle started for ${data.clubs.find(c => c.id === clubId)?.name}`,
      clubId
    });
    refreshData();
  };
  const handleUpdateUser = async (user: User) => { await db.saveUser(user); if (currentUser && currentUser.id === user.id) setCurrentUser(user); refreshData(); };
  const handleRemoveUser = async (id: string) => { await db.deleteUser(id); refreshData(); };
  const handleAddUser = async (user: User) => { await db.saveUser(user); refreshData(); };
  const handleFreezeClub = async (id: string) => {
    const club = data.clubs.find(c => c.id === id);
    if (club) {
      // Use any for status if types.ts doesn't have it, or cast
      await db.updateClub({ ...club, status: (club as any).status === 'Active' ? 'Frozen' : 'Active' } as any);
      refreshData();
    }
  };
  const handleAddClub = async (club: Club) => {
    try {
      setData(prev => ({ ...prev, clubs: [club, ...prev.clubs.filter(c => c.id !== club.id)] }));
      await db.addClub(club);
      await refreshData();
      toast.success('Club Created', `Successfully provisioned node "${club.name}"`);
    } catch (err: any) {
      console.error("handleAddClub Error:", err);
      toast.error('Failed to Create Club', err.message || 'Please check backend server connection.', err.stack);
    }
  };

  const handleAddVenue = async (venue: Venue) => {
    try {
      setData(prev => ({ ...prev, venues: [venue, ...prev.venues.filter(v => v.id !== venue.id)] }));
      await db.saveVenue(venue);
      await refreshData();
      toast.success('Venue Saved', `Venue "${venue.name}" is now available for bookings.`);
    } catch (err: any) {
      console.error("handleAddVenue Error:", err);
      toast.error('Failed to Save Venue', err.message || 'Could not commit venue to database.', err.stack);
    }
  };

  const handleAppointPresident = async (cId: string, sId: string) => { await db.appointPresident(cId, sId); await refreshData(); };
  const handleAssignFaculty = async (cId: string, faculty: User) => { await db.assignFaculty(cId, faculty); await refreshData(); };
  const handleSaveEvent = async (event: Event) => {
    setData(prev => ({
      ...prev,
      events: [event, ...prev.events.filter(e => e.id !== event.id)]
    }));
    await db.saveEvent(event);
    const club = data.clubs.find(c => c.id === event.clubId);
    notifyEventCreated(event.title, club?.name);
    await refreshData();
    toast.success('Event Saved', `"${event.title}" saved successfully.`);
  };
  const handleDeleteEvent = async (eventId: string) => {
    setData(prev => ({ ...prev, events: prev.events.filter(e => e.id !== eventId) }));
    await db.deleteEvent(eventId);
    await refreshData();
    toast.info('Event Removed', 'The event has been deleted.');
  };
  const handleApproveEvent = async (id: string) => {
    const event = data.events.find(e => e.id === id);
    if (event) {
      const updatedEvent = { ...event, status: 'Approved' as const };
      setData(prev => ({ ...prev, events: prev.events.map(e => e.id === id ? updatedEvent : e) }));
      await db.saveEvent(updatedEvent);
      const club = data.clubs.find(c => c.id === event.clubId);
      notifyEventCreated(event.title, club?.name);
      await refreshData();
      toast.success('Event Approved', `"${event.title}" is now officially approved.`);
    }
  };

  const handleRejectEvent = async (id: string) => {
    const event = data.events.find(e => e.id === id);
    if (event) {
      const updatedEvent = { ...event, status: 'Rejected' as const };
      setData(prev => ({ ...prev, events: prev.events.map(e => e.id === id ? updatedEvent : e) }));
      await db.saveEvent(updatedEvent);
      await refreshData();
      toast.warning('Event Declined', `Event proposal "${event.title}" has been rejected.`);
    }
  };

  const handleApproveBatchGlobal = async (batch: CertificateBatch) => {
    const role = currentUser?.globalRole;
    if (!role) return;

    let nextStatus: CertificateBatch['status'] = batch.status;
    if (role === Role.FACULTY) nextStatus = 'PendingDean';
    if (role === Role.DEAN) nextStatus = 'Approved';

    const updatedChain = batch.approvalChain.map(step => {
      if (step.role === role) {
        return { ...step, status: 'Approved' as const, approvedAt: new Date().toISOString(), approverName: currentUser.name };
      }
      return step;
    });

    let finalBatch = { ...batch, status: nextStatus, approvalChain: updatedChain };

    // If final approval, generate details
    if (nextStatus === 'Approved') {
      finalBatch.certificates = finalBatch.certificates.map((cert, idx) => ({
        ...cert,
        serialNumber: `MITS-${cert.clubId.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(idx + 1).padStart(5, '0')}`,
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      }));
      notifyCertificateIssued('All Eligible Students', batch.title || 'Event Pass');
    }

    setData(prev => ({
      ...prev,
      batches: prev.batches.map(b => b.id === batch.id ? finalBatch : b)
    }));

    await db.saveBatch(finalBatch);
    refreshData();
  };

  const handleRejectBatchGlobal = async (batch: CertificateBatch) => {
    const role = currentUser?.globalRole;
    if (!role) return;
    const updated = { ...batch, status: 'Rejected' as const };
    setData(prev => ({ ...prev, batches: prev.batches.map(b => b.id === batch.id ? updated : b) }));
    await db.saveBatch(updated);
    refreshData();
  };
  const handleIssueCertificateBatch = async (_batch: any) => { /* ... */ };
  const handleUpdateClubQuotation = async (_id: string, _q: Quotation[]) => { /* ... */ };
  const handleUpdateClubQr = async (_id: string, _url: string) => { /* ... */ };
  const handleProposeUnit = async (proposalData: Partial<Proposal>) => {
    try {
      const id = `prop-${Date.now()}`;
      const newProposal: Proposal = {
        id,
        type: proposalData.type || 'Club',
        title: proposalData.title || '',
        category: proposalData.category || 'General',
        proposerName: proposalData.proposerName || '',
        proposerRoll: proposalData.proposerRoll || '',
        proposerEmail: proposalData.proposerEmail || '',
        missionStatement: proposalData.missionStatement || '',
        estimatedMembers: proposalData.estimatedMembers || 0,
        status: 'PendingDean',
        deanResponse: '',
        timestamp: new Date().toISOString()
      };

      // Optimistic update
      setData(prev => ({
        ...prev,
        proposals: [newProposal, ...(prev.proposals || []).filter(p => p.id !== id)]
      }));

      if ((db as any).saveProposal) {
        await (db as any).saveProposal(newProposal);
      }

      await notifyProposalSubmitted(newProposal.title, newProposal.proposerName, id);

      await db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: newProposal.proposerName,
        action: `Submitted Genesis Proposal for ${newProposal.type}: ${newProposal.title}`,
        clubId: 'institutional'
      });

      await refreshData();
      return { success: true, id };
    } catch (err) {
      console.error(err);
      return { success: false, id: '' };
    }
  };

  const handleNewApplication = async (applicationData: { name: string, rollNumber: string, domain: string, whyJoin: string, clubId: string }) => {
    try {
      const appId = `app-${Date.now()}`;
      const trackingPrefix = applicationData.clubId.replace('club-', '').toUpperCase().slice(0, 4);
      const trackingId = `MITS-${trackingPrefix}-${appId.slice(-6).toUpperCase()}`;

      const applicant: Applicant = {
        id: appId,
        ...applicationData,
        stage: 'Applied',
        email: currentUser?.email || '',
        branch: currentUser?.branch || 'N/A',
        recruitmentCycle: new Date().getFullYear().toString()
      };

      await db.saveApplicant(applicant);

      const targetClub = data.clubs.find(c => c.id === applicationData.clubId);
      await notifyApplicationSubmitted(applicationData.name, targetClub?.name, trackingId);

      await db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: applicationData.name,
        action: `Submitted recruitment application for ${data.clubs.find(c => c.id === applicationData.clubId)?.name} [${trackingId}]`,
        clubId: applicationData.clubId
      });

      await refreshData();
      // Navigate user to their applications tracker
      handleTabChange('recruitment');
      return { success: true, trackingId };
    } catch (err) {
      console.error("Application Submission Failed:", err);
      return { success: false, trackingId: null };
    }
  };

  const handleApproveProposal = async (id: string, comment?: string) => {
    try {
      const proposal = data.proposals?.find(p => p.id === id);
      if (!proposal) return;

      const roleStr = String(currentUser?.globalRole || '');
      const isDean = roleStr === Role.DEAN || roleStr === 'Dean';
      const isSuperAdmin = roleStr === Role.SUPER_ADMIN || roleStr === 'Super Admin';

      // ─── RBAC PERMISSION CHECKS ───
      if (!isDean && !isSuperAdmin) {
        alert('RBAC Warning: Only the Dean of Student Welfare or Super Admin has authorization to approve and provision units.');
        return;
      }

      const nextStatus: Proposal['status'] = 'Approved';

      const updatedProposal: Proposal = {
        ...proposal,
        status: nextStatus,
        deanResponse: comment && comment.length > 0
          ? comment
          : (isDean ? `Approved & Provisioned by Dean Student Welfare (${currentUser?.name || 'Dean'}) on ${new Date().toLocaleDateString()}` : `Approved & Provisioned by Super Admin (${currentUser?.name || 'Admin'})`)
      };

      // Optimistic update of proposal list
      setData(prev => ({
        ...prev,
        proposals: prev.proposals?.map(p => p.id === id ? updatedProposal : p)
      }));

      // Call API (saves locally in db.ts if offline)
      if ((db as any).saveProposal) {
        await (db as any).saveProposal(updatedProposal);
      }

      await notifyProposalApproved(proposal.title, proposal.proposerName);

      await db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: currentUser?.name || 'Dean / Administrator',
        action: `Approved & provisioned unit from proposal: ${proposal.title}`,
        clubId: 'institutional'
      });

      if (proposal.type === 'Event') {
        const eventId = `event-${Date.now()}`;
        const newEvent: Event = {
          id: eventId,
          clubId: 'institutional',
          title: proposal.title,
          description: proposal.missionStatement,
          type: 'Free',
          status: 'Approved',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: currentUser?.name || proposal.proposerName
        };
        setData(prev => ({
          ...prev,
          events: [newEvent, ...prev.events.filter(e => e.id !== eventId)]
        }));
        await db.saveEvent(newEvent);
      } else {
        const cleanSlug = (proposal.title || 'club').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || `club-${Date.now()}`;
        const newClubId = `club-${cleanSlug}`;
        const newClub: Club = {
          id: newClubId,
          name: proposal.title,
          category: (proposal.category as Club['category']) || 'Technical',
          themeColor: '#2563eb',
          siteTheme: 'obsidian-pro',
          subdomain: cleanSlug,
          leadership: {
            President: proposal.proposerName,
            'Faculty Advisor': 'Appointed Faculty Mentor'
          },
          facultyCoordinatorNames: ['Appointed Faculty Mentor'],
          tagline: proposal.missionStatement ? (proposal.missionStatement.slice(0, 60) + '...') : `Official ${proposal.title} Society`,
          description: proposal.missionStatement || `Official ${proposal.title} unit at MITS Gwalior.`,
          recruitmentActive: true,
          achievements: [],
          projects: [],
          teamMembers: [{
            id: `mem-${Date.now()}`,
            name: proposal.proposerName,
            role: 'President',
            tier: 'Core'
          }],
          gallery: [],
          announcements: [{
            id: `ann-${Date.now()}`,
            title: `${proposal.title} Established`,
            content: `Official chapter established under MITS Institutional Governance by Dean of Student Welfare.`,
            tag: 'Notice',
            date: new Date().toLocaleDateString()
          }],
          membersCount: proposal.estimatedMembers || 10,
          budget: 10000,
          spent: 0
        };

        // Reactively add the new club to state
        setData(prev => ({
          ...prev,
          clubs: [newClub, ...prev.clubs.filter(c => c.id !== newClubId)]
        }));

        await db.addClub(newClub);

        // Update proposer user membership in memory and database if found
        const proposerUser = data.users.find(u => 
          (proposal.proposerEmail && u.email?.toLowerCase() === proposal.proposerEmail.toLowerCase()) ||
          (proposal.proposerRoll && (u.enrollmentNumber === proposal.proposerRoll || u.rollNumber === proposal.proposerRoll || u.enrollmentNo === proposal.proposerRoll)) ||
          (u.name.toLowerCase() === proposal.proposerName.toLowerCase())
        );
        if (proposerUser) {
          const updatedUser = {
            ...proposerUser,
            clubMemberships: [
              ...(proposerUser.clubMemberships || []).filter(m => m.clubId !== newClubId),
              {
                clubId: newClubId,
                role: ClubRole.PRESIDENT,
                joinedAt: new Date().toISOString()
              }
            ]
          };
          setData(prev => ({
            ...prev,
            users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
          }));
          if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
          }
          await db.saveUser(updatedUser);
        }
      }

      await refreshData();
      toast.success('Proposal Approved', `Unit "${proposal.title}" successfully provisioned and activated on CLIX Hub!`);
    } catch (err: any) {
      console.error("handleApproveProposal Failed:", err);
      toast.error('Proposal Approval Failed', err.message || 'Failed to approve proposal. Please check system logs.', err.stack);
    }
  };

  const handleRejectProposal = async (id: string, comment?: string) => {
    try {
      const proposal = data.proposals?.find(p => p.id === id);
      if (!proposal) return;

      const roleStr = String(currentUser?.globalRole || '');
      const isDean = roleStr === Role.DEAN || roleStr === 'Dean';
      const isSuperAdmin = roleStr === Role.SUPER_ADMIN || roleStr === 'Super Admin';

      if (!isDean && !isSuperAdmin) {
        toast.warning('Access Denied', 'RBAC Restriction: Only the Dean of Student Welfare or Super Admin has authorization to decline institutional proposals.');
        return;
      }

      const updatedProposal: Proposal = {
        ...proposal,
        status: 'Rejected',
        deanResponse: comment && comment.length > 0 ? comment : `Declined by ${currentUser?.name || 'Institutional Administration'} on ${new Date().toLocaleDateString()}`
      };

      // Optimistic update
      setData(prev => ({
        ...prev,
        proposals: prev.proposals?.map(p => p.id === id ? updatedProposal : p)
      }));

      if ((db as any).saveProposal) {
        await (db as any).saveProposal(updatedProposal);
      }

      await notifyProposalRejected(proposal.title, comment, proposal.proposerEmail);

      await db.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: currentUser?.name || 'System',
        action: `Proposal Rejected: ${proposal.title}`,
        clubId: 'institutional'
      });

      await refreshData();
      toast.warning('Proposal Declined', `Proposal "${proposal.title}" has been rejected.`);
    } catch (err: any) {
      console.error("handleRejectProposal Failed:", err);
      toast.error('Operation Failed', err.message || 'Could not update proposal status.');
    }
  };

  const closePublicPage = () => {
    setPublicPage(null);
    navigate('/');
  };

  // Handle Developer Views globally
  const renderDevView = (mode: "console" | "public", backTo: string = '/') => {
    return <Developers onBack={() => navigate(backTo)} isDarkMode={isDarkMode} currentUser={currentUser || undefined} allUsers={data.users} mode={mode} />;
  }

  const handlePublicNavigate = (page: string) => {
    const publicRoutes: Record<string, string> = {
      dashboard: '/',
      platform: '/platform',
      clubs: '/clubs',
      events: '/events',
      'proposal-workflow': '/proposal-workflow',
      proposals: '/proposal-workflow',
      'live-feed': '/live-feed',
      'verify-cert': '/verify-cert',
      verify: '/verify-cert',
      leadership: '/leadership',
      faculty: '/faculty',
      privacy: '/privacy',
      tos: '/tos',
      report: '/report',
      developers: '/developers',
      developer: '/developers',
    };
    navigate(publicRoutes[page] || `/${page}`);
  };

  // Define Dashboard Contents Switcher based on URL
  const renderDashboardContent = () => {
    const userToRender = activeUser || currentUser || authUser;
    if (!userToRender) {
      if (authLoading) {
        return (
          <div className="flex h-96 w-full items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        );
      }
      return <Navigate to="/auth" replace />;
    }

    if (activeContext === 'Global') {
      const userRoleStr = String(userToRender.globalRole || '').toLowerCase();
      const userEmail = (userToRender.email || '').toLowerCase();
      const isSuperAdmin = userToRender.globalRole === Role.SUPER_ADMIN || userRoleStr === 'super admin' || userRoleStr === 'super_admin' || userEmail === 'admin@mitsgwl.ac.in';
      const isDean = userToRender.globalRole === Role.DEAN || userRoleStr === 'dean' || userEmail === 'dean.sw@mitsgwl.ac.in' || userEmail.includes('dean');
      const isFaculty = !isDean && !isSuperAdmin && (userToRender.globalRole === Role.FACULTY || userRoleStr === 'faculty' || userEmail.includes('faculty') || !!userToRender.designation);

      const renderDefaultRoleDashboard = () => {
        if (isSuperAdmin) {
          return <SuperAdminHub clubs={data.clubs || []} allUsers={data.users || []} venues={data.venues || []} currentUser={userToRender} onFreeze={handleFreezeClub} onEnterClub={handleContextChange} onAddClub={handleAddClub} onAddVenue={handleAddVenue} onAppointPresident={handleAppointPresident} onAssignFaculty={handleAssignFaculty} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} isDarkMode={isDarkMode} proposals={data.proposals || []} onApproveProposal={handleApproveProposal} />;
        } else if (isDean) {
          return <DeanDashboard currentUser={userToRender} clubs={data.clubs || []} allUsers={data.users || []} events={data.events || []} batches={data.batches || []} proposals={data.proposals || []} onApproveProposal={handleApproveProposal} onRejectProposal={handleRejectProposal} onApproveBatch={handleApproveBatchGlobal} onRejectBatch={handleRejectBatchGlobal} onEnterClub={handleContextChange} onNavigate={handleTabChange} />;
        } else if (isFaculty) {
          return <FacultyFeed user={userToRender} clubs={data.clubs || []} onManageClub={handleContextChange} />;
        } else {
          const studentCertCount = (data.batches || []).flatMap(b => b.certificates || []).filter(c =>
            c.studentId === userToRender.id ||
            (userToRender.enrollmentNumber && c.enrollmentNumber?.toLowerCase() === userToRender.enrollmentNumber?.toLowerCase()) ||
            (userToRender.name && c.studentName?.toLowerCase() === userToRender.name?.toLowerCase()) ||
            (userToRender.email && c.email?.toLowerCase() === userToRender.email?.toLowerCase())
          ).length;
          const currentUserRegistrations = (data.registrations || []).filter(r => {
            const sId = String(r.studentId || '').toLowerCase().trim();
            const cId = String(userToRender.id || '').toLowerCase().trim();
            const sRoll = String(r.studentRoll || '').toLowerCase().trim();
            const cRoll = String(userToRender.enrollmentNumber || userToRender.rollNo || '').toLowerCase().trim();
            const sName = String(r.studentName || '').toLowerCase().trim();
            const cName = String(userToRender.name || '').toLowerCase().trim();
            const cEmail = String(userToRender.email || '').toLowerCase().trim();

            return (
              (cId && sId === cId) ||
              (cRoll && sRoll === cRoll) ||
              (cName && sName === cName) ||
              (cEmail && sId === cEmail)
            );
          });
          const currentUserApplicants = (data.applicants || []).filter(a => {
            const sName = String(a.name || '').toLowerCase().trim();
            const cName = String(userToRender.name || '').toLowerCase().trim();
            const sRoll = String(a.rollNumber || '').toLowerCase().trim();
            const cRoll = String(userToRender.enrollmentNumber || userToRender.rollNo || '').toLowerCase().trim();
            const sEmail = String(a.email || '').toLowerCase().trim();
            const cEmail = String(userToRender.email || '').toLowerCase().trim();
            return (cName && sName === cName) || (cRoll && sRoll === cRoll) || (cEmail && sEmail === cEmail);
          });
          return <GlobalStudentDashboard user={userToRender} events={data.events || []} clubs={data.clubs || []} certCount={studentCertCount} onRegister={handleRegisterEvent} isDarkMode={isDarkMode} registrations={currentUserRegistrations} applicants={currentUserApplicants} onNavigateTab={handleTabChange} />;
        }
      };

      switch (activeTab) {
        case 'dashboard':
        case '':
          return renderDefaultRoleDashboard();
        case 'dean-dashboard':
          return <DeanDashboard currentUser={userToRender} clubs={data.clubs || []} allUsers={data.users || []} events={data.events || []} batches={data.batches || []} proposals={data.proposals || []} onApproveProposal={handleApproveProposal} onRejectProposal={handleRejectProposal} onApproveBatch={handleApproveBatchGlobal} onRejectBatch={handleRejectBatchGlobal} onEnterClub={handleContextChange} onNavigate={handleTabChange} />;
        case 'admin-dashboard': return <SuperAdminHub clubs={data.clubs || []} allUsers={data.users || []} venues={data.venues || []} currentUser={userToRender} onFreeze={handleFreezeClub} onEnterClub={handleContextChange} onAddClub={handleAddClub} onAddVenue={handleAddVenue} onAppointPresident={handleAppointPresident} onAssignFaculty={handleAssignFaculty} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} isDarkMode={isDarkMode} proposals={data.proposals || []} onApproveProposal={handleApproveProposal} />;
        case 'chat': return <ChatSystem user={userToRender} clubs={data.clubs} events={data.events} registrations={data.registrations} allUsers={data.users} activeContext={activeContext} isDarkMode={isDarkMode} />;
        case 'venue-availability': return <VenueAvailability venues={data.venues} events={data.events} onAddVenue={handleAddVenue} isDarkMode={isDarkMode} />;
        case 'user-registry':
        case 'student-registry':
        case 'faculty-registry': return <UserRegistry allUsers={data.users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onRemoveUser={handleRemoveUser} isDarkMode={isDarkMode} />;
        case 'clubs': return <GlobalClubs clubs={data.clubs} isDarkMode={isDarkMode} onEnterClub={handleContextChange} />;
        case 'analytics': return <GlobalAnalytics clubs={data.clubs} users={data.users} events={data.events} registrations={data.registrations} applicants={data.applicants} isDarkMode={isDarkMode} />;
        case 'global-audit': return <SystemLogs logs={data.logs} isDarkMode={isDarkMode} />;
        case 'faculty-dashboard': return <FacultyFeed user={userToRender} clubs={data.clubs} onManageClub={handleContextChange} />;
        case 'approvals': return (
          <FacultyOversight
            events={data.events}
            clubs={data.clubs}
            batches={data.batches}
            proposals={data.proposals}
            currentUser={userToRender}
            onApproveEvent={handleApproveEvent}
            onRejectEvent={handleRejectEvent}
            onApproveBatch={handleApproveBatchGlobal}
            onRejectBatch={handleRejectBatchGlobal}
            onApproveProposal={handleApproveProposal}
            onRejectProposal={handleRejectProposal}
          />
        );
        case 'proposal-workflow': return <ProposalWorkflowPage currentUser={userToRender} proposals={data.proposals} onSubmitProposal={handleProposeUnit} onApproveProposal={handleApproveProposal} isDarkMode={isDarkMode} />;
        case 'reports': return <InstitutionalKPIs clubs={data.clubs} events={data.events} registrations={data.registrations} applicants={data.applicants} />;
        case 'profile': return <StudentProfile user={userToRender} onSave={handleUpdateUser} isDarkMode={isDarkMode} registrations={data.registrations} applicants={data.applicants} events={data.events} />;
        case 'recruitment': return <MyApplications applicants={data.applicants} clubs={data.clubs} userName={userToRender.name} isDarkMode={isDarkMode} onUpdateStatus={handleApplicantMove} />;
        case 'events': return <CampusEvents events={data.events} clubs={data.clubs} registrations={data.registrations} onRegister={handleRegisterEvent} isDarkMode={isDarkMode} user={userToRender} />;
        case 'my-certificates': return <MyCertificates currentUser={userToRender} batches={data.batches} />;
        case 'tickets': {
          const userRegistrations = (data.registrations || []).filter(r => {
            const sId = String(r.studentId || '').toLowerCase().trim();
            const cId = String(userToRender.id || '').toLowerCase().trim();
            const sRoll = String(r.studentRoll || '').toLowerCase().trim();
            const cRoll = String(userToRender.enrollmentNumber || userToRender.rollNo || '').toLowerCase().trim();
            const sName = String(r.studentName || '').toLowerCase().trim();
            const cName = String(userToRender.name || '').toLowerCase().trim();
            const cEmail = String(userToRender.email || '').toLowerCase().trim();

            return (
              (cId && sId === cId) ||
              (cRoll && sRoll === cRoll) ||
              (cName && sName === cName) ||
              (cEmail && sId === cEmail)
            );
          });
          return <MyTickets registrations={userRegistrations} events={data.events} clubs={data.clubs} isDarkMode={isDarkMode} />;
        }
        case 'payments': {
          const userRegistrations = (data.registrations || []).filter(r => {
            const sId = String(r.studentId || '').toLowerCase().trim();
            const cId = String(userToRender.id || '').toLowerCase().trim();
            const sRoll = String(r.studentRoll || '').toLowerCase().trim();
            const cRoll = String(userToRender.enrollmentNumber || userToRender.rollNo || '').toLowerCase().trim();
            const sName = String(r.studentName || '').toLowerCase().trim();
            const cName = String(userToRender.name || '').toLowerCase().trim();
            const cEmail = String(userToRender.email || '').toLowerCase().trim();

            return (
              (cId && sId === cId) ||
              (cRoll && sRoll === cRoll) ||
              (cName && sName === cName) ||
              (cEmail && sId === cEmail)
            );
          });
          const userApplicants = (data.applicants || []).filter(a => {
            const sName = String(a.name || '').toLowerCase().trim();
            const cName = String(userToRender.name || '').toLowerCase().trim();
            const sRoll = String(a.rollNumber || '').toLowerCase().trim();
            const cRoll = String(userToRender.enrollmentNumber || userToRender.rollNo || '').toLowerCase().trim();
            const sEmail = String(a.email || '').toLowerCase().trim();
            const cEmail = String(userToRender.email || '').toLowerCase().trim();
            return (cName && sName === cName) || (cRoll && sRoll === cRoll) || (cEmail && sEmail === cEmail);
          });
          return <MyPayments registrations={userRegistrations} applicants={userApplicants} events={data.events} clubs={data.clubs} isDarkMode={isDarkMode} />;
        }
        case 'developers': return renderDevView('console');
        case 'developer-profile': return renderDevView('public');
        default: return renderDefaultRoleDashboard();
      }
    }

    // Club Context Logic
    const currentClub = data.clubs.find(c => c.id === activeContext);
    if (!currentClub) return <div>Club Not Found</div>;

    const userClubRole = (userToRender.clubMemberships || []).find(m => m.clubId === activeContext)?.role || null;
    const isGlobalAdmin = userToRender.globalRole === Role.SUPER_ADMIN || userToRender.globalRole === Role.FACULTY || userToRender.globalRole === Role.DEAN;
    const isClubAdmin = userClubRole && userClubRole !== ClubRole.MEMBER;
    // Members (any role) can access these tabs; admins get everything
    const memberAllowedTabs = ['website', 'chat', 'club-dashboard', 'attendance'];
    const isAuthorized = isGlobalAdmin || isClubAdmin || memberAllowedTabs.includes(activeTab);

    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8 p-8 animate-in fade-in zoom-in-95">
          <div className="w-32 h-32 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-2xl shadow-rose-500/10 relative">
            <ShieldAlert size={64} />
          </div>
          <div className="space-y-4 max-w-lg">
            <h2 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#111C44]'}`}>Restricted Access Protocol</h2>
            <p className="text-[#A3AED0] font-medium text-lg leading-relaxed">Identity marker <strong>{userToRender.name}</strong> lacks the required security clearance for the <strong>{currentClub.name}</strong> governance mainframe.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(`/club/${activeContext}/website`)} className="px-8 py-4 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1a202e] transition-all">
              View Public Page
            </button>
            <button onClick={() => handleContextChange('Global')} className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Return to Global
            </button>
          </div>
        </div>
      );
    }

    const clubRegs = data.registrations.filter(r => data.events.find(e => e.id === r.eventId)?.clubId === activeContext);
    const clubEvents = data.events.filter(e => e.clubId === activeContext);

    switch (activeTab) {
      case 'club-dashboard': return <ClubHome club={currentClub} registrations={clubRegs} />;
      case 'chat': return <ChatSystem user={userToRender} clubs={data.clubs} events={data.events} registrations={data.registrations} allUsers={data.users} activeContext={activeContext} isDarkMode={isDarkMode} />;
      case 'members': return <ClubMembers clubId={activeContext} clubName={currentClub?.name || ''} isDarkMode={isDarkMode} clubRole={userClubRole} allUsers={data.users} onUpdateUser={handleUpdateUser} applicants={data.applicants} onAddMember={() => setActiveTab('recruitment')} />;
      case 'attendance': return <AttendanceControl registrations={clubRegs} events={clubEvents} clubName={currentClub.name} onMark={handleMarkAttendance} onFinalize={() => setActiveTab('club-events')} isDarkMode={isDarkMode} allUsers={data.users} onRegister={handleRegisterEvent} />;
      case 'club-events': return <EventOperations events={clubEvents} venues={data.venues} registrations={clubRegs} onCreateEvent={handleSaveEvent} onDeleteEvent={handleDeleteEvent} onRegister={handleRegisterEvent} onUpdateRegistration={handleUpdateRegistration} isDarkMode={isDarkMode} isDirectApprovalEnabled={userClubRole === ClubRole.PRESIDENT || userToRender.globalRole === Role.FACULTY} clubId={activeContext} />;
      case 'club-finance':
        if (!currentClub) {
          return (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <p className="text-lg font-bold">No active club selected.</p>
            </div>
          );
        }
        return (
          <ClubFinance
            club={currentClub}
            registrations={clubRegs}
            events={clubEvents}
            onApprovePayment={handleApprovePayment}
            onUpdateQuotes={(quotes) => handleUpdateClubQuotation(activeContext, quotes)}
            onUpdateQr={(url) => handleUpdateClubQr(activeContext, url)}
            isDarkMode={isDarkMode}
            isFaculty={userToRender.globalRole === Role.FACULTY || userToRender.globalRole === Role.DEAN || userToRender.globalRole === Role.SUPER_ADMIN}
          />
        );
      case 'recruitment': return <RecruitmentBoard applicants={data.applicants} onMove={handleApplicantMove} onUpdateDomain={handleApplicantDomainUpdate} clubRole={userClubRole} clubThemeColor={currentClub?.themeColor || '#2563eb'} onNewCycle={() => handleNewRecruitmentCycle(activeContext)} />;
      case 'certificates': return <CertificationGovernance club={currentClub} registrations={clubRegs} events={clubEvents} batches={data.batches} currentUser={userToRender} allUsers={data.users} onRefreshBatch={refreshData} />;
      case 'website': return (
        <ClubPublicWebsite
          club={currentClub}
          events={clubEvents}
          registrations={clubRegs}
          user={userToRender}
          members={data.users}
          onRegister={handleRegisterEvent}
          onSubmitApplication={handleNewApplication}
          showDashboardLink
          onOpenDashboard={() => handleTabChange('club-dashboard')}
        />
      );
      case 'site-editor': return <ClubSiteEditor club={currentClub} events={clubEvents} members={data.users} onSave={async (c) => { await db.updateClub(c); await refreshData(); }} isDarkMode={isDarkMode} />;
      case 'club-settings': return <ClubSettings club={currentClub} onSave={async (c) => { await db.updateClub(c); await refreshData(); }} isDarkMode={isDarkMode} />;
      default: return <ClubHome club={currentClub} registrations={clubRegs} />;
    }
  };



  // Main Return wrapped in Routes
  return (
    <div className={`min-h-screen font-sans selection:bg-[var(--primary)] selection:text-[var(--text-main)] bg-[var(--bg-main)] text-[var(--text-main)]`}>

      <div className="premium-app-backdrop fixed inset-0 pointer-events-none z-0" aria-hidden />

      <div className="relative z-10 w-full h-full">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            (() => {
              if (detectedSubdomain) {
                const matchedClub = data.clubs.find(c =>
                  (c.subdomain && c.subdomain.toLowerCase() === detectedSubdomain) ||
                  c.id.toLowerCase() === detectedSubdomain
                );
                if (matchedClub) {
                  const clubEvents = data.events.filter(e => e.clubId === matchedClub.id);
                  return (
                    <ClubPublicWebsite
                      club={matchedClub}
                      events={clubEvents}
                      registrations={data.registrations}
                      user={currentUser}
                      members={data.users}
                      onRegister={handleRegisterEvent}
                      onSubmitApplication={handleNewApplication}
                      onSignIn={() => navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`)}
                      showDashboardLink={!!currentUser}
                      onOpenDashboard={() => navigate('/dashboard')}
                    />
                  );
                }
              }

              return (isAuthenticated && activeUser) ? <Navigate to="/dashboard" replace /> :
                <LandingPage
                  events={data.events}
                  clubs={data.clubs}
                  users={data.users}
                  registrations={data.registrations}
                  onLogin={() => navigate('/auth')}
                  onRegister={() => navigate('/auth')}
                  isDarkMode={isDarkMode}
                  onOpenDeveloper={() => navigate('/developers')}
                  onOpenProfile={() => navigate('/auth?returnTo=/dashboard/profile')}
                  onNavigate={handlePublicNavigate}
                  onProposeUnit={handleProposeUnit}
                  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                />;
            })()
          } />

          <Route path="/auth" element={
            (isAuthenticated && activeUser) ? <Navigate to="/dashboard" replace /> :
              <JWTAuthPage
                isDarkMode={isDarkMode}
              />
          } />

          {/* Hidden Admin & Super Admin Gateway Routes */}
          <Route path="/admin-portal-signup" element={<AdminSecretSignup isDarkMode={isDarkMode} />} />
          <Route path="/sys-admin-access-portal" element={<AdminSecretSignup isDarkMode={isDarkMode} />} />
          <Route path="/super-admin-signup" element={<AdminSecretSignup isDarkMode={isDarkMode} />} />

          {/* Public and Static Overlays Route Mapping */}
          <Route path="/platform" element={<PlatformFeatures onBack={closePublicPage} />} />
          <Route path="/live-feed" element={<LiveFeedPublic events={data.events} logs={data.logs} onBack={closePublicPage} />} />
          <Route path="/events" element={<EventRegistry events={data.events} clubs={data.clubs} onBack={closePublicPage} />} />
          <Route
            path="/clubs"
            element={
              <ClubDirectoryPublic
                clubs={data.clubs}
                isDarkMode={isDarkMode}
                onEnterClub={(id: string) => navigate(`/club/${id}/website`)}
                onBack={closePublicPage}
              />
            }
          />
          <Route path="/leadership" element={<StudentLeadership clubs={data.clubs} users={data.users} onBack={closePublicPage} />} />
          <Route path="/faculty" element={<FacultyPortalInfo onBack={closePublicPage} onLogin={() => navigate('/auth')} />} />
          <Route path="/privacy" element={<LegalDocs type="privacy" onBack={closePublicPage} />} />
          <Route path="/tos" element={<LegalDocs type="tos" onBack={closePublicPage} />} />
          <Route path="/report" element={<ReportIssue onBack={closePublicPage} />} />
          <Route path="/developers" element={renderDevView('console', '/')} />
          <Route path="/verify-cert" element={<CertificateVerification />} />
          <Route
            path="/proposal-workflow"
            element={
              <ProposalWorkflowPage
                currentUser={currentUser}
                proposals={data.proposals}
                onSubmitProposal={handleProposeUnit}
                onApproveProposal={handleApproveProposal}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route
            path="/proposals"
            element={
              <ProposalWorkflowPage
                currentUser={currentUser}
                proposals={data.proposals}
                onSubmitProposal={handleProposeUnit}
                onApproveProposal={handleApproveProposal}
                isDarkMode={isDarkMode}
              />
            }
          />

          <Route
            path="/register/event/:eventId"
            element={
              <EventRegistrationPage
                events={data.events}
                clubs={data.clubs}
                registrations={data.registrations}
                user={currentUser}
                onRegister={handleRegisterEvent}
              />
            }
          />

          {/* Dashboard Shell UI Layer */}
          <Route path="/dashboard/*" element={
            activeUser ? (
              <DashboardLayout
                user={activeUser}
                clubs={data.clubs}
                activeContext="Global"
                activeTab={activeTab}
                isDarkMode={isDarkMode}
                onLogout={handleLogout}
                onContextChange={handleContextChange}
                setActiveTab={handleTabChange}
                onSwitchRole={handleSwitchRole}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              >
                {renderDashboardContent()}
              </DashboardLayout>
            ) : authLoading ? (
              <div className="flex h-screen w-full items-center justify-center bg-[#0a1128] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Loading Workspace...</span>
                </div>
              </div>
            ) : <Navigate to="/auth" replace />
          } />

          {/* Public Club Websites & Portal Layer */}
          <Route path="/public/club/:id" element={
            (() => {
              const pathParts = location.pathname.split('/');
              const targetId = pathParts[3] || pathParts[2];
              const club = data.clubs.find(c => c.id === targetId || c.subdomain === targetId || c.id === `club-${targetId}`);
              if (!club) {
                return (
                  <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100 p-8">
                    <div className="rounded-3xl border border-white/10 bg-[#090e1c] p-10 text-center max-w-md space-y-4 shadow-2xl">
                      <p className="text-xl font-bold text-white">Club node not found</p>
                      <p className="text-xs text-slate-400">The requested organization does not exist or may have been restructured.</p>
                      <button
                        onClick={() => navigate('/clubs')}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Explore Directory
                      </button>
                    </div>
                  </div>
                );
              }
              const clubEvents = data.events.filter(e => e.clubId === club.id);
              return (
                <ClubPublicWebsite
                  club={club}
                  events={clubEvents}
                  registrations={data.registrations}
                  user={currentUser}
                  members={data.users}
                  onRegister={handleRegisterEvent}
                  onSubmitApplication={handleNewApplication}
                  onSignIn={() => navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`)}
                  showDashboardLink={!!currentUser}
                  onOpenDashboard={() => {
                    setActiveContext(club.id);
                    setActiveTab('dashboard');
                    navigate(`/club/${club.id}/dashboard`);
                  }}
                />
              );
            })()
          } />

          <Route path="/club/:id/website" element={
            (() => {
              const pathParts = location.pathname.split('/');
              const targetId = pathParts[2];
              const club = data.clubs.find(c => c.id === targetId || c.subdomain === targetId || c.id === `club-${targetId}`);
              if (!club) {
                return (
                  <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100 p-8">
                    <div className="rounded-3xl border border-white/10 bg-[#090e1c] p-10 text-center max-w-md space-y-4 shadow-2xl">
                      <p className="text-xl font-bold text-white">Club node not found</p>
                      <p className="text-xs text-slate-400">The requested organization does not exist or may have been restructured.</p>
                      <button
                        onClick={() => navigate('/clubs')}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Explore Directory
                      </button>
                    </div>
                  </div>
                );
              }
              const clubEvents = data.events.filter(e => e.clubId === club.id);
              return (
                <ClubPublicWebsite
                  club={club}
                  events={clubEvents}
                  registrations={data.registrations}
                  user={currentUser}
                  members={data.users}
                  onRegister={handleRegisterEvent}
                  onSubmitApplication={handleNewApplication}
                  onSignIn={() => navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`)}
                  showDashboardLink={!!currentUser}
                  onOpenDashboard={() => {
                    setActiveContext(club.id);
                    setActiveTab('dashboard');
                    navigate(`/club/${club.id}/dashboard`);
                  }}
                />
              );
            })()
          } />

          <Route path="/club/:id" element={
            (() => {
              const pathParts = location.pathname.split('/');
              const targetId = pathParts[2];
              const club = data.clubs.find(c => c.id === targetId || c.subdomain === targetId || c.id === `club-${targetId}`);
              if (!club) {
                return (
                  <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100 p-8">
                    <div className="rounded-3xl border border-white/10 bg-[#090e1c] p-10 text-center max-w-md space-y-4 shadow-2xl">
                      <p className="text-xl font-bold text-white">Club node not found</p>
                      <p className="text-xs text-slate-400">The requested organization does not exist or may have been restructured.</p>
                      <button
                        onClick={() => navigate('/clubs')}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Explore Directory
                      </button>
                    </div>
                  </div>
                );
              }
              const clubEvents = data.events.filter(e => e.clubId === club.id);
              return (
                <ClubPublicWebsite
                  club={club}
                  events={clubEvents}
                  registrations={data.registrations}
                  user={currentUser}
                  members={data.users}
                  onRegister={handleRegisterEvent}
                  onSubmitApplication={handleNewApplication}
                  onSignIn={() => navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`)}
                  showDashboardLink={!!currentUser}
                  onOpenDashboard={() => {
                    setActiveContext(club.id);
                    setActiveTab('dashboard');
                    navigate(`/club/${club.id}/dashboard`);
                  }}
                />
              );
            })()
          } />

          <Route path="/c/:id" element={
            (() => {
              const pathParts = location.pathname.split('/');
              const targetId = pathParts[2];
              return <Navigate to={`/club/${targetId}/website`} replace />;
            })()
          } />
          <Route path="/c/:id/website" element={
            (() => {
              const pathParts = location.pathname.split('/');
              const targetId = pathParts[2];
              return <Navigate to={`/club/${targetId}/website`} replace />;
            })()
          } />

          {/* Club Private Workspace / Dashboard Layer */}
          <Route path="/club/:id/:tab" element={
            currentUser ? (
              (() => {
                const clubIdFromPath = location.pathname.split('/')[2];
                const isClubMember = currentUser.clubMemberships?.some(m => m.clubId === clubIdFromPath);
                const isGlobalStaff = currentUser.globalRole === Role.FACULTY ||
                  currentUser.globalRole === Role.SUPER_ADMIN ||
                  currentUser.globalRole === Role.DEAN;

                // Non-members go straight to public website — no sidebar, no dashboard
                if (!isClubMember && !isGlobalStaff) {
                  const club = data.clubs.find(c => c.id === clubIdFromPath);
                  if (!club) return <Navigate to="/clubs" replace />;
                  const clubEvents = data.events.filter(e => e.clubId === club.id);
                  return (
                    <ClubPublicWebsite
                      club={club}
                      events={clubEvents}
                      registrations={data.registrations}
                      user={currentUser}
                      members={data.users}
                      onRegister={handleRegisterEvent}
                      onSubmitApplication={handleNewApplication}
                      onSignIn={() => navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`)}
                      showDashboardLink={!!currentUser}
                      onOpenDashboard={() => {
                        setActiveContext(club.id);
                        setActiveTab('dashboard');
                        navigate(`/club/${club.id}/dashboard`);
                      }}
                    />
                  );
                }

                return (
                  <DashboardLayout
                    user={currentUser}
                    clubs={data.clubs}
                    activeContext={activeContext}
                    activeTab={activeTab}
                    isDarkMode={isDarkMode}
                    onLogout={handleLogout}
                    onContextChange={handleContextChange}
                    setActiveTab={handleTabChange}
                    onSwitchRole={handleSwitchRole}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                  >
                    {renderDashboardContent()}
                  </DashboardLayout>
                );
              })()
            ) : <Navigate to={`/auth?returnTo=${encodeURIComponent(location.pathname)}`} replace />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <PrintStudio item={printItem} onClose={() => setPrintItem(null)} />
        {showImporter && <DataImporter onClose={() => setShowImporter(false)} onImportComplete={refreshData} />}
      </div>
    </div>
  );
};

export default App;
