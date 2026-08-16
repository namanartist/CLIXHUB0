import React from 'react';
import { Club, Registration } from '../../types';
import {
  Users,
  TrendingUp,
  Calendar,
  Trophy,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Clock,
  Star,
  Zap,
  ChevronRight,
  BarChart3
} from 'lucide-react';

// ── Header ──────────────────────────────────────────────────────────────────
const ClubHomeHeader: React.FC<{ club: Club }> = ({ club }) => (
  <div className="relative rounded-2xl overflow-hidden p-8 md:p-10 uni-glass-strong border border-[var(--glass-morphism-border)]">
    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <span className="uni-badge mb-3">Club dashboard</span>
        <h1 className="uni-text-display font-black tracking-tight mb-2">
          {club.name}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-md">
          {club.tagline || 'Manage events, members, and club activities.'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Category</p>
          <p className="text-[var(--text-main)] font-bold">{club.category || 'General'}</p>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white uni-btn-primary">
          {club.name?.[0] || '?'}
        </div>
      </div>
    </div>
  </div>
);

// ── Stats Row ────────────────────────────────────────────────────────────────
const ClubStats: React.FC<{ totalRegs: number; approvedRegs: number }> = ({ totalRegs, approvedRegs }) => {
  const stats = [
    { label: 'Total Registrations', value: totalRegs, icon: Users, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Confirmed Members', value: approvedRegs, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Pending Approvals', value: totalRegs - approvedRegs, icon: Clock, color: '#d97706', bg: '#fffbeb' },
    { label: 'Club Score', value: '92', icon: Star, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div className="uni-grid-responsive sm-2 lg-4">
      {stats.map((stat, i) => (
        <div key={i} className="uni-pill-card !p-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-0.5 truncate">{stat.label}</p>
            <p className="uni-text-stat">{stat.value}</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--primary-soft)] text-primary">
            <stat.icon size={18} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Recent Activity ──────────────────────────────────────────────────────────
const RecentActivity: React.FC<{ registrations: Registration[] }> = ({ registrations }) => {
  const recent = registrations.slice(0, 6);
  return (
    <div className="uni-pill-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--primary-soft)] text-primary">
            <Activity size={16} />
          </div>
          <h3 className="font-bold text-sm text-[var(--text-main)]">Recent registrations</h3>
        </div>
        <button type="button" className="text-xs font-semibold flex items-center gap-1 text-primary">
          View all <ChevronRight size={12} />
        </button>
      </div>
      <div className="space-y-3">
        {recent.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="mx-auto mb-2" style={{ color: '#cbd5e1' }} />
            <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>No registrations yet</p>
          </div>
        ) : recent.map((reg, i) => (
          <div key={reg.id} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: `hsl(${(i * 60) % 360}, 70%, 55%)` }}
            >
              {reg.studentName?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: '#1a2233' }}>{reg.studentName}</p>
              <p className="text-[10px]" style={{ color: '#94a3b8' }}>{reg.studentRoll}</p>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: reg.status === 'Approved' ? '#f0fdf4' : '#fffbeb',
                color: reg.status === 'Approved' ? '#16a34a' : '#d97706'
              }}
            >
              {reg.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Quick Actions Panel ──────────────────────────────────────────────────────
const QuickActions: React.FC = () => {
  const actions = [
    { label: 'Create Event', icon: Calendar, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Add Member', icon: Users, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'View Analytics', icon: BarChart3, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Certificates', icon: Trophy, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f5f3ff' }}>
          <Zap size={16} style={{ color: '#7c3aed' }} />
        </div>
        <h3 className="font-bold text-sm" style={{ color: '#1a2233' }}>Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl text-center transition-all hover:shadow-md hover:-translate-y-0.5 group"
            style={{ background: action.bg, border: `1px solid ${action.bg}` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fff' }}>
              <action.icon size={16} style={{ color: action.color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#475569' }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Performance Card ─────────────────────────────────────────────────────────
const PerformanceCard: React.FC<{ totalRegs: number; approvedRegs: number }> = ({ totalRegs, approvedRegs }) => {
  const approvalRate = totalRegs > 0 ? Math.round((approvedRegs / totalRegs) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (approvalRate / 100) * circumference;

  return (
    <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#eff6ff' }}>
          <TrendingUp size={16} style={{ color: '#2563eb' }} />
        </div>
        <h3 className="font-bold text-sm" style={{ color: '#1a2233' }}>Approval Rate</h3>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="7" />
            <circle
              cx="40" cy="40" r="36" fill="none"
              stroke="#2563eb" strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black" style={{ color: '#1a2233' }}>{approvalRate}%</span>
          </div>
        </div>
        <div className="w-full space-y-2">
          {[
            { label: 'Approved', val: approvedRegs, color: '#2563eb' },
            { label: 'Pending', val: totalRegs - approvedRegs, color: '#d97706' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs" style={{ color: '#64748b' }}>{item.label}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: '#1a2233' }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Club Content Editor Panel ────────────────────────────────────────────────
const ClubContentEditor: React.FC<{ club: Club; onSaveClub?: (updated: Club) => void }> = ({ club, onSaveClub }) => {
  const [tagline, setTagline] = React.useState(club.tagline || '');
  const [description, setDescription] = React.useState(club.description || '');
  const [customSections, setCustomSections] = React.useState(club.customSections || []);
  const [newTitle, setNewTitle] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [isSaved, setIsSaved] = React.useState(false);

  const handleAddSection = () => {
    if (!newTitle.trim()) return;
    const newSec = { id: `sec-${Date.now()}`, title: newTitle, content: newContent, iconName: 'Layers' };
    setCustomSections([...customSections, newSec]);
    setNewTitle('');
    setNewContent('');
  };

  const handleRemoveSection = (id: string) => {
    setCustomSections(customSections.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    const updated = { ...club, tagline, description, customSections };
    if (onSaveClub) {
      await onSaveClub(updated);
    } else {
      await db.updateClub(updated);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="uni-pill-card p-6 md:p-8 space-y-6 border border-[var(--border-color)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-[var(--text-main)]">Edit Club Content & Sections</h3>
            <p className="text-xs text-[var(--text-secondary)]">Manage your club tagline, mission, and custom website sections directly from the Club Dashboard.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
        >
          {isSaved ? 'Saved & Published!' : 'Save Content'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Club Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-main)] outline-none focus:border-primary"
            placeholder="e.g. Innovate • Build • Excel"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Mission & Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-main)] outline-none focus:border-primary"
            placeholder="Official club mission statement..."
          />
        </div>
      </div>

      {/* Custom Sections Listing */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Active Custom Sections ({customSections.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customSections.map(sec => (
            <div key={sec.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-sm text-[var(--text-main)]">{sec.title}</p>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{sec.content}</p>
              </div>
              <button onClick={() => handleRemoveSection(sec.id)} className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                <ChevronRight size={16} className="rotate-45" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Section */}
        <div className="p-4 rounded-2xl border border-dashed border-[var(--border-color)] bg-white/5 space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Add Custom Section</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Section Title (e.g. Annual Projects)"
              className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-medium text-[var(--text-main)] outline-none"
            />
            <input
              type="text"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="Section Content description..."
              className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-medium text-[var(--text-main)] outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSection}
            className="px-5 py-2.5 bg-[var(--primary-soft)] border border-[var(--border-color)] text-primary rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all"
          >
            + Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
interface Props { club: Club; registrations: Registration[]; onSaveClub?: (updated: Club) => void; }

const ClubHome: React.FC<Props> = ({ club, registrations, onSaveClub }) => {
  const approvedRegs = registrations.filter(r => r.status === 'Approved').length;

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <ClubHomeHeader club={club} />
      <ClubStats totalRegs={registrations.length} approvedRegs={approvedRegs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity — takes 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity registrations={registrations} />
          <ClubContentEditor club={club} onSaveClub={onSaveClub} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PerformanceCard totalRegs={registrations.length} approvedRegs={approvedRegs} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default ClubHome;
