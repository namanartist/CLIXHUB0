import React, { useState } from 'react';
import { User, ClubRole, Applicant } from '../../types';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  Settings, 
  Trash2, 
  X, 
  Check, 
  MoreHorizontal, 
  Mail, 
  Award, 
  Layers, 
  Fingerprint,
  Activity,
  Zap,
  Star
} from 'lucide-react';

interface MembersHeaderProps {
  clubName: string;
  isDarkMode: boolean;
  memberCount: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isAdmin: boolean;
  setIsAddModalOpen: (val: boolean) => void;
}

const MembersHeader: React.FC<MembersHeaderProps> = ({
  clubName, isDarkMode, memberCount, searchTerm, setSearchTerm, isAdmin, setIsAddModalOpen
}) => (
  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
          <Users size={18} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Personnel Directory</span>
      </div>
      <h2 className={`text-3xl md:text-5xl font-black tracking-tighter font-display leading-none ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
        Team Council <span className="text-blue-600">({memberCount})</span>
      </h2>
      <p className="text-sm font-medium text-[var(--text-secondary)] max-w-md">
        Managing high-clearance operative roles and roster for {clubName}.
      </p>
    </div>
    
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
      <div className={`flex items-center px-6 py-4 rounded-3xl w-full sm:w-80 transition-all glass-elevated border border-[var(--border-color)] shadow-2xl`}>
        <Search size={18} className="text-[var(--text-secondary)]" />
        <input 
          type="text" 
          placeholder="Locate Personnel..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-4 bg-transparent outline-none text-sm font-bold w-full placeholder-slate-600 text-[var(--text-main)]"
        />
      </div>
      {isAdmin && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all"
        >
          <UserPlus size={18} /> Induct Operative
        </button>
      )}
    </div>
  </div>
);

const MembersGrid: React.FC<any> = ({ filteredMembers, clubId, isDarkMode, isAdmin, setEditingMember, setIsEditModalOpen, setSelectedMember }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
    {filteredMembers.map((member: User) => {
      const membership = member.clubMemberships.find(m => m.clubId === clubId);
      const role = membership?.role || 'Member';
      return (
        <div key={member.id} className="group relative uni-pill-card border border-[var(--border-color)] rounded-[3.5rem] p-10 flex flex-col items-center text-center hover:border-blue-500/30 transition-all shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all"><Fingerprint size={120} className="text-blue-500" /></div>
          <div className="relative mb-8">
            <div className={`w-32 h-32 rounded-[2.5rem] p-1.5 transition-all bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110 shadow-2xl`}>
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-[var(--bg-main)] flex items-center justify-center">
                {member.photoUrl ? <img src={member.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl font-black text-[var(--text-main)]">{member.name[0]}</span>}
              </div>
              {isAdmin && (
                <button onClick={() => { setEditingMember(member); setIsEditModalOpen(true); }} className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white text-blue-600 shadow-xl flex items-center justify-center hover:scale-110 transition-transform"><Settings size={18}/></button>
              )}
            </div>
          </div>
          <div className="space-y-1 mb-6">
            <h3 className="text-xl font-black font-display tracking-tight text-[var(--text-main)]">{member.name}</h3>
            <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em]">{role}</p>
              <p className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{member.enrollmentNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full justify-center px-4 mb-8 border-t border-[var(--border-color)] pt-6">
            <div className="text-center"><p className="text-lg font-black font-display text-[var(--text-main)] italic">12</p><p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Ops</p></div>
            <div className="w-px h-6 bg-slate-700/50" />
            <div className="text-center"><p className="text-lg font-black font-display text-[var(--text-main)] italic">98%</p><p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Perf</p></div>
          </div>
          <button onClick={() => setSelectedMember(member)} className="w-full py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/20">Access Dossier</button>
        </div>
      );
    })}
  </div>
);

const AddMemberModal: React.FC<any> = ({ setIsAddModalOpen, clubName, personnelSearch, setPersonnelSearch, personnelPool, handleAddMember }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAddModalOpen(false)} />
    <div className="relative max-w-xl w-full uni-pill-card rounded-[4rem] border border-[var(--border-color)] shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-12 overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="absolute top-0 right-0 p-12 opacity-5"><UserPlus size={200} /></div>
      <div className="relative z-10 space-y-10">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
             <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500"><UserPlus size={24} /></div>
             <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic">Personnel Induction</h3>
             <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Integrating operative into {clubName} council.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(false)} className="p-4 rounded-2xl hover:bg-rose-600 transition-all text-[var(--text-secondary)] hover:text-white"><X size={20}/></button>
        </div>
        <div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18}/><input type="text" value={personnelSearch} onChange={(e) => setPersonnelSearch(e.target.value)} placeholder="Search Institution Roster..." className="w-full pl-16 pr-8 py-5 bg-[var(--bg-main)] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-[var(--text-main)] transition-all"/></div>
        <div className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Detected Operatives</h4>
           <div className="space-y-3">
              {personnelPool.length > 0 ? personnelPool.map((user: User) => (
                 <div key={user.id} className="p-6 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl flex items-center justify-between group hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center font-black text-blue-500">{user.name[0]}</div>
                       <div><p className="text-sm font-black text-[var(--text-main)]">{user.name}</p><p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{user.enrollmentNumber}</p></div>
                    </div>
                    <button onClick={() => handleAddMember(user)} className="p-4 rounded-2xl bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-all"><Check size={18}/></button>
                 </div>
              )) : <div className="p-12 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-2 border-dashed border-[var(--border-color)] rounded-3xl">Search for personnel across campus clusters</div>}
           </div>
        </div>
      </div>
    </div>
  </div>
);

const EditMemberModal: React.FC<any> = ({ setIsEditModalOpen, setEditingMember, editingMember, clubId, handleUpdateRole, handleUpdateDomain, handleRemoveMember }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-3xl" onClick={() => { setIsEditModalOpen(false); setEditingMember(null); }} />
    <div className="relative max-w-xl w-full uni-pill-card rounded-[4rem] border border-[var(--border-color)] p-12 overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl">
      <div className="flex justify-between items-start mb-10"><h3 className="text-3xl font-black text-[var(--text-main)] italic tracking-tighter uppercase">Clearance Governance</h3><button onClick={() => { setIsEditModalOpen(false); setEditingMember(null); }} className="p-4 rounded-2xl bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:bg-rose-500 hover:text-white transition-all"><X size={20}/></button></div>
      <div className="space-y-10">
        <div className="p-8 rounded-3xl bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-center gap-6"><div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black">{editingMember.name[0]}</div><div><p className="text-xl font-black text-[var(--text-main)]">{editingMember.name}</p><p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{editingMember.enrollmentNumber}</p></div></div>
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Protocol Role</label>
          <div className="grid grid-cols-2 gap-3">
             {[ClubRole.PRESIDENT, ClubRole.VICE_PRESIDENT, ClubRole.SECRETARY, ClubRole.JOINT_SECRETARY, ClubRole.TREASURER, ClubRole.MEMBER].map(r => (
                <button key={r} onClick={() => handleUpdateRole(editingMember, r)} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${editingMember.clubMemberships.find(m => m.clubId === clubId)?.role === r ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{r}</button>
             ))}
          </div>
        </div>
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Deployment Domain</label>
          <div className="grid grid-cols-2 gap-3">
             {['Technical', 'Management', 'Design', 'Cultural', 'Social Media', 'Content'].map(d => (
                <button key={d} onClick={() => handleUpdateDomain(editingMember, d)} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${editingMember.clubMemberships.find(m => m.clubId === clubId)?.domain === d ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{d}</button>
             ))}
          </div>
        </div>
        <button onClick={() => handleRemoveMember(editingMember)} className="w-full py-5 rounded-2xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20">Terminate Protocol Node</button>
      </div>
    </div>
  </div>
);

const MemberDossierModal: React.FC<any> = ({ setSelectedMember, selectedMember, clubId }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
    <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-3xl" onClick={() => setSelectedMember(null)} />
    <div className="relative max-w-3xl w-full rounded-[4rem] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 uni-pill-card">
      <button onClick={() => setSelectedMember(null)} className="absolute top-10 right-10 p-4 rounded-3xl bg-[var(--primary-soft)] text-white hover:bg-rose-500 transition-all z-20"><X size={20}/></button>
      <div className="h-48 bg-gradient-to-r from-blue-900 to-[#0B1437] relative">
          <div className="absolute -bottom-20 left-12"><div className="w-40 h-40 rounded-[3rem] border-[8px] border-[#111C44] bg-blue-600 overflow-hidden shadow-2xl flex items-center justify-center">{selectedMember.photoUrl ? <img src={selectedMember.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-5xl font-black text-[var(--text-main)]">{selectedMember.name[0]}</span>}</div></div>
          <div className="absolute bottom-6 right-12 flex items-center gap-3 text-right"><div><p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Clearance Level</p><p className="text-xl font-black text-[var(--text-main)] uppercase italic">{selectedMember.clubMemberships.find(m => m.clubId === clubId)?.role || 'INDETERMINATE'}</p></div><Fingerprint size={32} className="text-blue-500" /></div>
      </div>
      <div className="px-12 pt-28 pb-14 space-y-12">
          <div className="flex justify-between items-start">
              <div><h3 className="text-5xl font-black text-[var(--text-main)] tracking-tighter uppercase italic">{selectedMember.name}</h3><p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mt-2">{selectedMember.enrollmentNumber} • {selectedMember.branch}</p></div>
              <a href={`mailto:${selectedMember.email}`} className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl hover:scale-110 transition-all"><Mail size={20} /></a>
          </div>
          <div className="grid grid-cols-2 gap-16">
              <div className="space-y-6"><div className="flex items-center gap-4 text-[var(--text-main)]/50 uppercase text-[10px] font-black"><Award size={20} /> Endorsed Skillsets</div><div className="flex flex-wrap gap-3">{selectedMember.skills?.map(s => <span key={s} className="px-4 py-1.5 bg-[var(--primary-soft)] rounded-xl text-[10px] font-black text-[var(--text-secondary)] uppercase">{s}</span>)}</div></div>
              <div className="space-y-6"><div className="flex items-center gap-4 text-[var(--text-main)]/50 uppercase text-[10px] font-black"><Layers size={20} /> Active Assignments</div><div className="space-y-4">{selectedMember.clubMemberships.map(m => <div key={m.clubId} className="flex items-center gap-4"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><div><p className="text-[10px] font-black text-[var(--text-main)] uppercase">{m.role}</p><p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{m.clubId}</p></div></div>)}</div></div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-center gap-5"><div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20"><ShieldCheck size={28} /></div><div><p className="text-xs font-black text-[var(--text-main)] uppercase">Institutional Logistics</p><p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Status: Verified Active</p></div></div>
      </div>
    </div>
  </div>
);

interface Props { clubId: string; clubName: string; isDarkMode: boolean; clubRole: ClubRole | null; allUsers: User[]; onUpdateUser: (user: User) => void; applicants: Applicant[]; }

const ClubMembers: React.FC<Props> = ({ clubId, clubName, isDarkMode, clubRole, allUsers, onUpdateUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  const clubMembers = allUsers.filter(u => u.clubMemberships.some(m => m.clubId === clubId));
  const filteredMembers = clubMembers.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.enrollmentNumber || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const isAdmin = clubRole === ClubRole.PRESIDENT || clubRole === ClubRole.VICE_PRESIDENT;

  const handleAddMember = (user: User) => { onUpdateUser({ ...user, clubMemberships: [...user.clubMemberships, { clubId, role: ClubRole.MEMBER }] }); setIsAddModalOpen(false); setPersonnelSearch(''); };
  const handleUpdateRole = (member: User, newRole: ClubRole, newDomain?: string) => { onUpdateUser({ ...member, clubMemberships: member.clubMemberships.map(m => m.clubId === clubId ? { ...m, role: newRole, domain: newDomain || m.domain } : m) }); setIsEditModalOpen(false); setEditingMember(null); };
  const handleUpdateDomain = (member: User, newDomain: string) => { onUpdateUser({ ...member, clubMemberships: member.clubMemberships.map(m => m.clubId === clubId ? { ...m, domain: newDomain } : m) }); };
  const handleRemoveMember = (member: User) => { if (confirm(`Sever connection with operative ${member.name}?`)) { onUpdateUser({ ...member, clubMemberships: member.clubMemberships.filter(m => m.clubId !== clubId) }); } };

  const personnelPool = allUsers.filter(u => !u.clubMemberships.some(m => m.clubId === clubId) && (u.name.toLowerCase().includes(personnelSearch.toLowerCase()) || (u.enrollmentNumber || '').toLowerCase().includes(personnelSearch.toLowerCase()))).slice(0, 5);

  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-10 md:space-y-14 relative z-10">
      <MembersHeader clubName={clubName} isDarkMode={isDarkMode} memberCount={filteredMembers.length} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isAdmin={isAdmin} setIsAddModalOpen={setIsAddModalOpen} />
      <MembersGrid filteredMembers={filteredMembers} clubId={clubId} isDarkMode={isDarkMode} isAdmin={isAdmin} setEditingMember={setEditingMember} setIsEditModalOpen={setIsEditModalOpen} setSelectedMember={setSelectedMember} />
      {isAddModalOpen && <AddMemberModal setIsAddModalOpen={setIsAddModalOpen} clubName={clubName} personnelSearch={personnelSearch} setPersonnelSearch={setPersonnelSearch} personnelPool={personnelPool} handleAddMember={handleAddMember} />}
      {isEditModalOpen && editingMember && <EditMemberModal setIsEditModalOpen={setIsEditModalOpen} setEditingMember={setEditingMember} editingMember={editingMember} clubId={clubId} handleUpdateRole={handleUpdateRole} handleUpdateDomain={handleUpdateDomain} handleRemoveMember={handleRemoveMember} />}
      {selectedMember && <MemberDossierModal setSelectedMember={setSelectedMember} selectedMember={selectedMember} clubId={clubId} />}
    </div>
  );
};

export default ClubMembers;
