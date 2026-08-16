import React, { useMemo } from 'react';
import { Club, User, Event, Registration, Applicant, Role } from '../../types';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Users, 
  PieChart as PieIcon, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck 
} from 'lucide-react';

interface AnalyticsHeaderProps {
  isDarkMode: boolean;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ isDarkMode }) => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="space-y-1">
      <h1 className="text-4xl font-black tracking-tight">Institutional Intelligence</h1>
      <p className="text-[var(--text-secondary)] font-medium text-lg">Real-time aggregate telemetry of the MITS student organization ecosystem.</p>
    </div>
    <div className={`px-6 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest flex items-center gap-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-500'}`}><ShieldCheck size={16} className="text-blue-500" /> System Integrity Valid</div>
  </header>
);

interface KPIGridProps {
  isDarkMode: boolean;
  totalStudents: number;
  activeClubs: number;
  totalClubs: number;
  totalRevenue: number;
  applicantCount: number;
}

const KPIGrid: React.FC<KPIGridProps> = ({ isDarkMode, totalStudents, activeClubs, totalClubs, totalRevenue, applicantCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Users size={24} /></div><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Students</span></div>
      <div className="flex items-end gap-3"><h3 className="text-4xl font-black tracking-tighter">{totalStudents}</h3><span className="text-xs font-bold text-emerald-500 flex items-center mb-1"><ArrowUpRight size={12} /> +12%</span></div>
    </div>
    <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><PieIcon size={24} /></div><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Clubs</span></div>
      <div className="flex items-end gap-3"><h3 className="text-4xl font-black tracking-tighter">{activeClubs}</h3><span className="text-xs font-bold text-[var(--text-secondary)] mb-1">/ {totalClubs} Total</span></div>
    </div>
    <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Wallet size={24} /></div><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Est. Revenue</span></div>
      <div className="flex items-end gap-3"><h3 className="text-4xl font-black tracking-tighter">₹{totalRevenue.toLocaleString()}</h3><span className="text-xs font-bold text-emerald-500 flex items-center mb-1"><ArrowUpRight size={12} /> +8%</span></div>
    </div>
    <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><TrendingUp size={24} /></div><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Applicants</span></div>
      <div className="flex items-end gap-3"><h3 className="text-4xl font-black tracking-tighter">{applicantCount}</h3><span className="text-xs font-bold text-rose-500 flex items-center mb-1"><ArrowDownRight size={12} /> -2%</span></div>
    </div>
  </div>
);

interface RecruitmentFunnelProps {
  isDarkMode: boolean;
  recruitmentStats: any[];
}

const RecruitmentFunnel: React.FC<RecruitmentFunnelProps> = ({ isDarkMode, recruitmentStats }) => (
  <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
    <h3 className="text-lg font-black tracking-tight mb-8">Recruitment Funnel</h3>
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={recruitmentStats}>
          <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
          <XAxis dataKey="name" stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none' }} itemStyle={{ color: isDarkMode ? '#fff' : '#0f172a', fontWeight: 'bold' }} />
          <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorCount)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

interface EcosystemDistributionProps {
  isDarkMode: boolean;
  clubCategoryStats: any[];
  COLORS: string[];
}

const EcosystemDistribution: React.FC<EcosystemDistributionProps> = ({ isDarkMode, clubCategoryStats, COLORS }) => (
  <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
    <h3 className="text-lg font-black tracking-tight mb-8">Ecosystem Distribution</h3>
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={clubCategoryStats} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
            {clubCategoryStats.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

interface EventParticipationProps {
  isDarkMode: boolean;
  eventParticipationData: any[];
}

const EventParticipation: React.FC<EventParticipationProps> = ({ isDarkMode, eventParticipationData }) => (
  <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
    <h3 className="text-lg font-black tracking-tight mb-8">Pulse Participation (Top 5 Events)</h3>
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={eventParticipationData} layout="vertical" margin={{ left: 30, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} horizontal={false} />
          <XAxis type="number" stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
          <YAxis dataKey="name" type="category" width={150} stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none' }} cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }} />
          <Bar dataKey="Attendees" fill="#10b981" radius={[0, 4, 4, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

interface Props { clubs: Club[]; users: User[]; events: Event[]; registrations: Registration[]; applicants: Applicant[]; isDarkMode: boolean; }

const GlobalAnalytics: React.FC<Props> = ({ clubs, users, events, registrations, applicants, isDarkMode }) => {
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const totalStudents = users.filter(u => u.globalRole === Role.STUDENT).length;
  const activeClubs = clubs.filter(c => !c.isFrozen).length;
  const totalRevenue = useMemo(() => registrations.filter(r => r.status === 'Approved').reduce((acc, reg) => { const event = events.find(e => e.id === reg.eventId); return acc + (event?.fee || 0); }, 0), [registrations, events]);
  const recruitmentStats = useMemo(() => ['Applied', 'Screening', 'Interview', 'Selected'].map(stage => ({ name: stage, count: applicants.filter(a => a.stage === stage).length })), [applicants]);
  const clubCategoryStats = useMemo(() => { const categories = clubs.reduce((acc, club) => { acc[club.category] = (acc[club.category] || 0) + 1; return acc; }, {} as Record<string, number>); return Object.entries(categories).map(([name, value]) => ({ name, value })); }, [clubs]);
  const eventParticipationData = useMemo(() => { const eventCounts = registrations.reduce((acc, reg) => { acc[reg.eventId] = (acc[reg.eventId] || 0) + 1; return acc; }, {} as Record<string, number>); return Object.entries(eventCounts).map(([eventId, count]) => { const event = events.find(e => e.id === eventId); return { name: event ? `${event.title.substring(0, 15)}...` : 'Unknown', Attendees: Number(count) }; }).sort((a, b) => b.Attendees - a.Attendees).slice(0, 5); }, [registrations, events]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <AnalyticsHeader isDarkMode={isDarkMode} />
      <KPIGrid isDarkMode={isDarkMode} totalStudents={totalStudents} activeClubs={activeClubs} totalClubs={clubs.length} totalRevenue={totalRevenue} applicantCount={applicants.length} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecruitmentFunnel isDarkMode={isDarkMode} recruitmentStats={recruitmentStats} />
        <EcosystemDistribution isDarkMode={isDarkMode} clubCategoryStats={clubCategoryStats} COLORS={COLORS} />
      </div>
      <EventParticipation isDarkMode={isDarkMode} eventParticipationData={eventParticipationData} />
    </div>
  );
};

export default GlobalAnalytics;
