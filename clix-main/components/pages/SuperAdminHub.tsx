import React, { useState } from 'react';
import { Club, User, Role, Notification, Venue } from '../../types';
import { db } from '../../db';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Plus,
  BarChart3,
  Activity,
  Zap,
  CheckCircle2,
  X,
  Clock,
  Users,
  GraduationCap,
  Search,
  Check,
  ArrowRight,
  MoreVertical,
  Signal,
  Layers,
  Fingerprint,
  UserPlus,
  Lock,
  MoreHorizontal,
  Layout,
  Settings,
  Flame,
  Eye,
  Command,
  MessageSquare
} from 'lucide-react';

const AdminHeader: React.FC<any> = ({ setIsModalOpen, currentUser }) => {
  const navigate = useNavigate();
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative mb-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] border border-[var(--border-color)]">
          <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
            {currentUser?.globalRole === Role.DEAN ? 'Dean Approval Portal' : 'System Administrator'}
          </span>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] leading-none font-display">
            Admin <span className="text-[var(--primary)] font-black">Dashboard</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-xl font-medium">
            Manage institutional organizations, faculty delegations, and system-wide audits.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => navigate('/dashboard/chat')}
          className="px-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-primary/50 rounded-2xl font-black text-xs uppercase tracking-widest hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <MessageSquare size={18} className="text-primary" /> Campus Chat
        </button>
        <button
          onClick={() => (window as any).openDataImporter?.()}
          className="px-6 py-4 bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
        >
          <Zap size={18} className="text-amber-400" /> Import Data
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> New Organization
        </button>
      </div>
    </header>
  );
};

const AdminAnalytics: React.FC<any> = ({ clubsCount, pendingProposalsCount, facultyCount }) => {
  const stats = [
    { label: 'Active Organizations', value: clubsCount, icon: Layout, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary-soft)]' },
    { label: 'Pending Approvals', value: pendingProposalsCount, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Registered Faculty', value: facultyCount, icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'System Uptime', value: '99.9%', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="uni-pill-card p-6 border border-[var(--border-color)] flex items-center justify-between group transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
            <stat.icon size={90} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-[var(--text-main)] font-display">{stat.value}</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform relative z-10`}>
            <stat.icon size={22} />
          </div>
        </div>
      ))}
    </div>
  );
};

const ProposalPipeline: React.FC<any> = ({ proposals, onApproveProposal }) => {
  const pendingProposals = proposals.filter((p: any) => p.status === 'PendingDean' || p.status === 'PendingSystemAdmin');
  return (
    <div className="uni-pill-card border border-[var(--border-color)] p-6 space-y-6 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
        <Signal size={200} />
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Proposal Pipeline</h3>
            <p className="text-[9px] text-[var(--text-secondary)]">Awaiting genesis creation</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
          {pendingProposals.length} In Audit
        </div>
      </div>
      <div className="space-y-4 relative z-10">
        {pendingProposals.map((prop: any) => (
          <div key={prop.id} className="p-5 bg-[var(--primary-soft)] border border-[var(--border-color)] rounded-2xl group/item hover:border-[var(--primary)]/30 transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)]">{prop.category}</span>
                <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${prop.status === 'PendingDean' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                  }`}>
                  {prop.status === 'PendingDean' ? 'Awaiting Dean' : 'Pending Admin'}
                </span>
              </div>
              <div className="text-[9px] font-bold text-[var(--text-secondary)]">
                {new Date(prop.timestamp).toLocaleDateString()}
              </div>
            </div>
            <h4 className="text-sm font-black text-[var(--text-main)] leading-snug mb-2">{prop.title}</h4>
            {prop.deanResponse && (
              <p className="mb-4 text-[10px] text-[var(--text-secondary)] italic border-l-2 border-emerald-500 pl-3 leading-relaxed">
                Dean Note: {prop.deanResponse}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                onClick={() => onApproveProposal?.(prop.id)}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all"
              >
                <Check size={12} /> {prop.status === 'PendingDean' ? 'Acknowledge' : 'Create Unit Now'}
              </button>
              <button className="px-3 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {pendingProposals.length === 0 && (
          <div className="py-12 text-center opacity-30 uppercase font-black text-[9px] tracking-widest">
            No Pending Proposals
          </div>
        )}
      </div>
    </div>
  );
};

const VenueManagementPanel: React.FC<any> = ({ venues, setIsVenueModalOpen }) => (
  <div className="uni-pill-card border border-[var(--border-color)] p-6 shadow-2xl overflow-hidden relative">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-bold text-[var(--text-main)]">Venue Inventory</h3>
        <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">Campus venue allocation matrix</p>
      </div>
      <button onClick={() => setIsVenueModalOpen(true)} className="px-4 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/90 transition-all">Add Venue</button>
    </div>
    <div className="grid gap-4">
      {venues.length === 0 ? (
        <div className="text-sm text-[var(--text-secondary)]">No managed venues yet. Add one to enable event allocation.</div>
      ) : venues.map((venue: Venue) => (
        <div key={venue.id} className="rounded-3xl border border-[var(--border-color)] p-4 bg-[var(--bg-main)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-[var(--text-main)]">{venue.name}</h4>
              <p className="text-[11px] text-[var(--text-secondary)]">{venue.location || 'Campus'} • {venue.capacity || 'N/A'} seats</p>
            </div>
            <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.35em] rounded-full ${venue.status === 'Available' ? 'bg-emerald-500/10 text-emerald-300' : venue.status === 'Booked' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>{venue.status || 'Available'}</span>
          </div>
          <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">{venue.description || 'No description available.'}</p>
          {venue.amenities?.length ? (
            <div className="mt-4 text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.3em] font-bold">Amenities</div>
          ) : null}
          {venue.amenities?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {venue.amenities.map((item, idx) => (
                <span key={idx} className="rounded-full bg-[var(--bg-main)] px-3 py-1 text-[10px] text-[var(--text-secondary)] border border-[var(--border-color)]">{item}</span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

const CreateVenueModal: React.FC<any> = ({ isOpen, onClose, newVenueData, setNewVenueData, handleCreateVenue }) => (
  isOpen ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-3xl w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-main)]">Add New Venue</h3>
            <p className="text-sm text-[var(--text-secondary)]">Create a managed venue for future event allocations and availability tracking.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-3 bg-[var(--bg-main)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleCreateVenue} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
              <span className="font-bold">Venue Name</span>
              <input value={newVenueData.name || ''} onChange={e => setNewVenueData({ ...newVenueData, name: e.target.value })} required className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-4 text-sm outline-none focus:border-primary" />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
              <span className="font-bold">Location</span>
              <input value={newVenueData.location || ''} onChange={e => setNewVenueData({ ...newVenueData, location: e.target.value })} className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-4 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
              <span className="font-bold">Capacity</span>
              <input type="number" min="0" value={newVenueData.capacity || ''} onChange={e => setNewVenueData({ ...newVenueData, capacity: Number(e.target.value) || 0 })} className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-4 text-sm outline-none focus:border-primary" />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
              <span className="font-bold">Status</span>
              <select value={newVenueData.status || 'Available'} onChange={e => setNewVenueData({ ...newVenueData, status: e.target.value as Venue['status'] })} className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-4 text-sm outline-none focus:border-primary">
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </label>
          </div>
          <label className="space-y-2 text-sm text-[var(--text-secondary)]">
            <span className="font-bold">Amenities</span>
            <input value={Array.isArray(newVenueData.amenities) ? newVenueData.amenities.join(', ') : newVenueData.amenities || ''} onChange={e => setNewVenueData({ ...newVenueData, amenities: e.target.value.split(',').map(item => item.trim()) })} placeholder="Projector, WiFi, Sound System" className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-4 text-sm outline-none focus:border-primary" />
          </label>
          <label className="space-y-2 text-sm text-[var(--text-secondary)]">
            <span className="font-bold">Description</span>
            <textarea value={newVenueData.description || ''} onChange={e => setNewVenueData({ ...newVenueData, description: e.target.value })} rows={4} className="w-full rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-4 text-sm outline-none focus:border-primary" />
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-3xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all">Cancel</button>
            <button type="submit" className="px-6 py-3 rounded-3xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">Save Venue</button>
          </div>
        </form>
      </div>
    </div>
  ) : null
);

const ClubMatrix: React.FC<any> = ({ clubs, allUsers, onEnterClub, onFreeze, setSelectedClub, setIsAppointModalOpen, setIsFacultyAssignModalOpen }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
          <Layout size={16} />
        </div>
        <h3 className="text-xl font-bold text-[var(--text-main)]">Organizations</h3>
      </div>
      <button className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
        View Archive
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {clubs.map(club => (
        <div key={club.id} className="uni-pill-card border border-[var(--border-color)] p-6 group relative overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
            <Zap size={100} className="text-[var(--primary)]" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md"
                style={{ backgroundColor: club.themeColor }}
              >
                {club.name[0]}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onFreeze(club.id)}
                  className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-amber-500 hover:border-amber-500/30 active:scale-95 transition-all"
                  title="Toggle Freeze State"
                >
                  <Lock size={16} />
                </button>
                <button
                  onClick={() => onEnterClub(club.id)}
                  className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] active:scale-95 transition-all"
                  title="Enter Control Mainframe"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-[var(--primary-soft)] text-[var(--primary)]">
                  {club.category}
                </span>
                <span className="text-[8px] font-mono text-[var(--text-secondary)] truncate">
                  {club.subdomain}
                </span>
              </div>
              <h4 className="text-base font-black text-[var(--text-main)] tracking-tight leading-snug line-clamp-1">
                {club.name}
              </h4>
            </div>
            <div className="pt-4 border-t border-[var(--border-color)] grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedClub(club); setIsAppointModalOpen(true); }}
                className="flex items-center gap-2 group/btn text-left min-w-0"
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] group-hover/btn:bg-[var(--primary)] group-hover/btn:text-white group-hover/btn:border-[var(--primary)] transition-all shrink-0">
                  <Users size={14} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-wider">President</p>
                  <p className="text-[10px] font-bold text-[var(--text-main)] truncate">
                    {(() => {
                      if (club.leadership?.presidentId) {
                        const u = allUsers.find((usr: any) => usr.id === club.leadership.presidentId);
                        if (u) return u.name;
                      }
                      if (club.leadership?.['President']) return club.leadership['President'];
                      if (club.leadership?.['president']) return club.leadership['president'];
                      const presUser = allUsers.find((usr: any) => usr.clubMemberships?.some((m: any) => m.clubId === club.id && m.role === 'President'));
                      if (presUser) return presUser.name;
                      return 'Unassigned';
                    })()}
                  </p>
                </div>
              </button>
              <button
                onClick={() => { setSelectedClub(club); setIsFacultyAssignModalOpen(true); }}
                className="flex items-center gap-2 group/btn text-left min-w-0"
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] group-hover/btn:bg-emerald-500 group-hover/btn:text-white group-hover/btn:border-emerald-500 transition-all shrink-0">
                  <GraduationCap size={14} />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Faculty</p>
                  <p className="text-[10px] font-bold text-[var(--text-main)] truncate">
                    {club.facultyCoordinatorId ? allUsers.find(u => u.id === club.facultyCoordinatorId)?.name : 'Unassigned'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CreateClubModal: React.FC<any> = ({ setIsModalOpen, newClubData, setNewClubData, handleCreateClub }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
    <div className="relative max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Create Organization</h3>
        <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-secondary)]">
          <X size={18} />
        </button>
      </div>
      <form onSubmit={handleCreateClub} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Organization Name</label>
          <input required value={newClubData.name} onChange={e => setNewClubData({ ...newClubData, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--primary)] text-sm font-medium text-[var(--text-main)] transition-colors" placeholder="e.g. CodeCell MITS" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Category</label>
            <select value={newClubData.category} onChange={e => setNewClubData({ ...newClubData, category: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--primary)] text-sm font-medium text-[var(--text-main)]">
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Social">Social</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Theme Color</label>
            <input type="color" value={newClubData.themeColor} onChange={e => setNewClubData({ ...newClubData, themeColor: e.target.value })} className="w-full h-11 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] p-1 cursor-pointer" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Tagline</label>
          <input value={newClubData.tagline} onChange={e => setNewClubData({ ...newClubData, tagline: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--primary)] text-sm font-medium text-[var(--text-main)] transition-colors" placeholder="Brief tagline of the club" />
        </div>
        <button type="submit" className="w-full py-3.5 mt-2 bg-[var(--primary)] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:opacity-90 active:scale-95 transition-all">
          Create Organization
        </button>
      </form>
    </div>
  </div>
);

const AppointPresidentModal: React.FC<any> = ({ setIsAppointModalOpen, appointSearch, setAppointSearch, filteredStudents, onAppointPresident, selectedClub }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="absolute inset-0" onClick={() => setIsAppointModalOpen(false)} />
    <div className="relative max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Appoint President</h3>
          <p className="text-[8px] font-black uppercase tracking-widest text-[var(--primary)] mt-1">{selectedClub?.name}</p>
        </div>
        <button onClick={() => setIsAppointModalOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-secondary)]">
          <X size={18} />
        </button>
      </div>
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-all" size={16} />
          <input value={appointSearch} onChange={e => setAppointSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-[var(--primary)] text-xs font-bold text-[var(--text-main)]" placeholder="Search student by name or roll..." />
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {filteredStudents.map((s: any) => (
            <div
              key={s.id}
              onClick={async () => {
                await onAppointPresident(selectedClub!.id, s.id);
                alert(`${s.name} appointed as President of ${selectedClub?.name}!`);
                setIsAppointModalOpen(false);
              }}
              className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex items-center justify-between group hover:border-[var(--primary)]/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center font-black text-sm text-[var(--primary)] shrink-0">{s.name[0]}</div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[var(--text-main)] uppercase truncate">{s.name}</p>
                  <p className="text-[9px] font-bold text-[var(--text-secondary)] truncate uppercase">{s.enrollmentNumber}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] opacity-0 group-hover:opacity-100 flex items-center justify-center text-[var(--primary)] transition-all shrink-0">
                <Check size={16} />
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && <div className="text-center py-6 text-xs text-[var(--text-secondary)]">No students found</div>}
        </div>
      </div>
    </div>
  </div>
);

const AssignFacultyModal: React.FC<any> = ({ setIsFacultyAssignModalOpen, facultyAssignSearch, setFacultyAssignSearch, filteredFacultyForAssign, onAssignFaculty, selectedClub }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="absolute inset-0" onClick={() => setIsFacultyAssignModalOpen(false)} />
    <div className="relative max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Assign Coordinator</h3>
          <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1">{selectedClub?.name}</p>
        </div>
        <button onClick={() => setIsFacultyAssignModalOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-secondary)]">
          <X size={18} />
        </button>
      </div>
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-emerald-500 transition-all" size={16} />
          <input value={facultyAssignSearch} onChange={e => setFacultyAssignSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-emerald-500 text-xs font-bold text-[var(--text-main)]" placeholder="Search faculty by name or email..." />
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {filteredFacultyForAssign.map((f: any) => (
            <div key={f.id} onClick={() => { onAssignFaculty(selectedClub!.id, f); setIsFacultyAssignModalOpen(false); }} className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex items-center justify-between group hover:border-emerald-500/40 transition-all cursor-pointer">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center font-black text-sm text-emerald-500 shrink-0">{f.name[0]}</div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[var(--text-main)] uppercase truncate">{f.name}</p>
                  <p className="text-[9px] font-bold text-[var(--text-secondary)] truncate">{f.email}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] opacity-0 group-hover:opacity-100 flex items-center justify-center text-emerald-500 transition-all shrink-0">
                <Check size={16} />
              </div>
            </div>
          ))}
          {filteredFacultyForAssign.length === 0 && <div className="text-center py-6 text-xs text-[var(--text-secondary)]">No faculty members found</div>}
        </div>
      </div>
    </div>
  </div>
);

const FacultyRegistryModal: React.FC<any> = ({ setIsFacultyModalOpen, newFaculty, setNewFaculty, handleCreateFaculty, facultyMembers, onUpdateUser }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="absolute inset-0" onClick={() => setIsFacultyModalOpen(false)} />
    <div className="relative max-w-4xl w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
      <div className="md:w-1/2 space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-[var(--text-main)] leading-none font-display">Induct Authority Node</h3>
          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-emerald-500">Injecting Node into Faculty Matrix</p>
        </div>
        <form onSubmit={handleCreateFaculty} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Full Designation Name</label>
            <input required placeholder="e.g. Dr. Satish Kumar" value={newFaculty.name} onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-emerald-500 text-xs font-bold text-[var(--text-main)]" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Secure Uplink (Email)</label>
            <input type="email" required placeholder="satish@mitsgwl.ac.in" value={newFaculty.email} onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-emerald-500 text-xs font-bold text-[var(--text-main)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setNewFaculty(prev => ({ ...prev, role: Role.FACULTY }))} className={`rounded-xl border py-3 text-[10px] font-black uppercase tracking-wider transition-all ${newFaculty.role === Role.FACULTY ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}`}>
              Faculty Role
            </button>
            <button type="button" onClick={() => setNewFaculty(prev => ({ ...prev, role: Role.DEAN }))} className={`rounded-xl border py-3 text-[10px] font-black uppercase tracking-wider transition-all ${newFaculty.role === Role.DEAN ? 'bg-emerald-600 text-white border-emerald-600' : 'border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}`}>
              Dean Role
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Department Node</label>
            <input placeholder="Computer Science" value={newFaculty.department} onChange={e => setNewFaculty({ ...newFaculty, department: e.target.value })} className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-emerald-500 text-xs font-bold text-[var(--text-main)]" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">Upload Signature</label>
            <input type="file" accept="image/*" onChange={e => setNewFaculty(prev => ({ ...prev, signatureFile: e.target.files && e.target.files[0] ? e.target.files[0] : null }))} className="w-full text-xs text-[var(--text-secondary)] bg-[var(--bg-main)] border border-[var(--border-color)] p-2 rounded-xl" />
          </div>
          <button type="submit" className="w-full py-4.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.25em] shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
            <UserPlus size={16} /> Establish Authority Node
          </button>
        </form>
      </div>
      <div className="md:w-1/2 flex flex-col min-h-0 h-[450px] md:h-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-color)]">
          <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-wide">Authority Registry</h4>
          <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {facultyMembers.length} Active
          </span>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
          {facultyMembers.map((f: any) => {
            const isDean = f.globalRole === Role.DEAN;
            return (
              <div key={f.id} className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm italic shrink-0 ${isDean ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                    {f.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[var(--text-main)] uppercase truncate leading-tight">{f.name}</p>
                    <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-wider truncate leading-tight mt-0.5">
                      {f.branch || 'Department'} · {isDean ? 'Dean of Student Welfare' : 'Faculty'}
                    </p>
                  </div>
                </div>
                {onUpdateUser && (
                  <button
                    onClick={() => {
                      const nextRole = isDean ? Role.FACULTY : Role.DEAN;
                      onUpdateUser({ ...f, globalRole: nextRole });
                      alert(`${f.name} successfully updated to ${nextRole === Role.DEAN ? 'Dean' : 'Faculty'} role.`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border shrink-0 flex items-center gap-1 ${isDean
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                      : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                      }`}
                  >
                    {isDean ? 'Revoke Dean' : 'Make Dean'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

interface Props {
  clubs: Club[];
  venues: Venue[];
  allUsers: User[];
  currentUser: User;
  onFreeze: (id: string) => void;
  onEnterClub: (id: string) => void;
  onAddClub: (club: Club) => void;
  onAddVenue?: (venue: Venue) => void;
  onAppointPresident: (clubId: string, studentId: string) => void;
  onAssignFaculty: (clubId: string, faculty: User) => void;
  onAddUser?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  isDarkMode: boolean;
  proposals?: any[];
  onApproveProposal?: (id: string) => void;
}

const SuperAdminHub: React.FC<Props> = ({
  clubs,
  venues,
  allUsers,
  currentUser,
  onFreeze,
  onEnterClub,
  onAddClub,
  onAddVenue,
  onAppointPresident,
  onAssignFaculty,
  onAddUser,
  onUpdateUser,
  isDarkMode,
  proposals = [],
  onApproveProposal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointModalOpen, setIsAppointModalOpen] = useState(false);
  const [isFacultyAssignModalOpen, setIsFacultyAssignModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [appointSearch, setAppointSearch] = useState('');
  const [facultyAssignSearch, setFacultyAssignSearch] = useState('');
  const [newClubData, setNewClubData] = useState({ name: '', category: 'Technical' as Club['category'], themeColor: '#2563eb', tagline: '' });
  const [newVenueData, setNewVenueData] = useState<Partial<Venue>>({ name: '', location: '', capacity: 0, amenities: [], status: 'Available', description: '' });
  const [newFaculty, setNewFaculty] = useState({ name: '', email: '', department: '', role: Role.FACULTY as Role.FACULTY | Role.DEAN, signatureFile: null as File | null });

  const students = (allUsers || []).filter(u => u && (u.globalRole === Role.STUDENT || String(u.globalRole) === 'Student' || (u.globalRole !== Role.FACULTY && u.globalRole !== Role.DEAN && u.globalRole !== Role.SUPER_ADMIN)));
  const facultyMembers = (allUsers || []).filter(u => u && (u.globalRole === Role.FACULTY || u.globalRole === Role.DEAN));
  const filteredStudents = students.filter(s => s && ((s.name || '').toLowerCase().includes(appointSearch.toLowerCase()) || (s.enrollmentNumber || '').toLowerCase().includes(appointSearch.toLowerCase())));
  const filteredFacultyForAssign = facultyMembers.filter(f => f && ((f.name || '').toLowerCase().includes(facultyAssignSearch.toLowerCase()) || (f.email || '').toLowerCase().includes(facultyAssignSearch.toLowerCase())));

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    const club: Club = {
      id: `club-${Date.now()}`,
      name: newClubData.name,
      category: newClubData.category,
      themeColor: newClubData.themeColor,
      subdomain: `${newClubData.name.toLowerCase().replace(/\s+/g, '')}.mitsgwl.ac.in`,
      leadership: {},
      facultyCoordinatorId: '',
      tagline: newClubData.tagline,
      recruitmentActive: false
    };
    onAddClub(club);
    setIsModalOpen(false);
    setNewClubData({ name: '', category: 'Technical', themeColor: '#2563eb', tagline: '' });
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddVenue) return;
    const venue: Venue = {
      id: `venue-${Date.now()}`,
      name: newVenueData.name || `Venue ${Date.now()}`,
      location: newVenueData.location,
      capacity: Number(newVenueData.capacity) || 0,
      amenities: Array.isArray(newVenueData.amenities) ? newVenueData.amenities : typeof newVenueData.amenities === 'string' ? (newVenueData.amenities as string).split(',').map(item => item.trim()).filter(Boolean) : [],
      status: newVenueData.status || 'Available',
      description: newVenueData.description || ''
    };
    onAddVenue(venue);
    setNewVenueData({ name: '', location: '', capacity: 0, amenities: [], status: 'Available', description: '' });
    setIsVenueModalOpen(false);
  };

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddUser) return;
    const generatedPassword = db.generateRandomPassword();
    const id = `${newFaculty.role.toLowerCase()}-${Date.now()}`;
    let signatureUrl: string | undefined = undefined;
    try {
      if (newFaculty.signatureFile) {
        signatureUrl = await db.uploadAsset(newFaculty.signatureFile, `signatures/${id}-${Date.now()}`);
      }
    } catch (err) {
      console.error('Signature upload failed', err);
    }
    const newUser: User = {
      id,
      name: newFaculty.name,
      email: newFaculty.email,
      globalRole: newFaculty.role,
      clubMemberships: [],
      branch: newFaculty.department,
      password: generatedPassword,
      signatureUrl
    };
    onAddUser(newUser);
    setNewFaculty({ name: '', email: '', department: '', role: Role.FACULTY, signatureFile: null });
    alert(`Authority Node Established. Credentials:\nLogin: ${newUser.email}\nPassword: ${generatedPassword}`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <AdminHeader setIsModalOpen={setIsModalOpen} currentUser={currentUser} />
      <AdminAnalytics
        clubsCount={clubs.length}
        pendingProposalsCount={proposals.filter(p => p.status === 'PendingDean' || p.status === 'PendingSystemAdmin').length}
        facultyCount={facultyMembers.length}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <ProposalPipeline proposals={proposals} onApproveProposal={onApproveProposal} />
          <VenueManagementPanel venues={venues} setIsVenueModalOpen={setIsVenueModalOpen} />
          <button
            onClick={() => setIsFacultyModalOpen(true)}
            className="w-full uni-pill-card border border-[var(--border-color)] p-6 flex items-center justify-between group hover:border-emerald-500/40 transition-all shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-[var(--text-main)] tracking-tight">Faculty Directory</h4>
                <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Manage Coordinator Delegations</p>
              </div>
            </div>
            <BarChart3 className="text-[var(--text-secondary)] group-hover:text-emerald-500 transition-colors" size={18} />
          </button>
        </div>
        <div className="lg:col-span-8">
          <ClubMatrix
            clubs={clubs}
            allUsers={allUsers}
            onEnterClub={onEnterClub}
            onFreeze={onFreeze}
            setSelectedClub={setSelectedClub}
            setIsAppointModalOpen={setIsAppointModalOpen}
            setIsFacultyAssignModalOpen={setIsFacultyAssignModalOpen}
          />
        </div>
      </div>
      {isModalOpen && <CreateClubModal setIsModalOpen={setIsModalOpen} newClubData={newClubData} setNewClubData={setNewClubData} handleCreateClub={handleCreateClub} />}
      {isVenueModalOpen && <CreateVenueModal isOpen={isVenueModalOpen} onClose={() => setIsVenueModalOpen(false)} newVenueData={newVenueData} setNewVenueData={setNewVenueData} handleCreateVenue={handleCreateVenue} />}
      {isAppointModalOpen && <AppointPresidentModal setIsAppointModalOpen={setIsAppointModalOpen} appointSearch={appointSearch} setAppointSearch={setAppointSearch} filteredStudents={filteredStudents} onAppointPresident={onAppointPresident} selectedClub={selectedClub} />}
      {isFacultyAssignModalOpen && <AssignFacultyModal setIsFacultyAssignModalOpen={setIsFacultyAssignModalOpen} facultyAssignSearch={facultyAssignSearch} setFacultyAssignSearch={setFacultyAssignSearch} filteredFacultyForAssign={filteredFacultyForAssign} onAssignFaculty={onAssignFaculty} selectedClub={selectedClub} />}
      {isFacultyModalOpen && <FacultyRegistryModal setIsFacultyModalOpen={setIsFacultyModalOpen} newFaculty={newFaculty} setNewFaculty={setNewFaculty} handleCreateFaculty={handleCreateFaculty} facultyMembers={facultyMembers} onUpdateUser={onUpdateUser} />}
    </div>
  );
};

export default SuperAdminHub;
