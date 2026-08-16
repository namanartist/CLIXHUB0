import React, { useState } from 'react';
import { User, Role } from '../../types';
import { db } from '../../db';
import { Search, UserPlus, Key, ShieldCheck, Trash2, X } from 'lucide-react';

interface FacultyHeaderProps {
  setIsAddModalOpen: (val: boolean) => void;
}

const FacultyHeader: React.FC<FacultyHeaderProps> = ({ setIsAddModalOpen }) => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div><h1 className="text-4xl font-black tracking-tight mb-2">Faculty Registry</h1><p className="text-[var(--text-secondary)] font-medium">Manage institutional faculty coordinators and Dean-level authority.</p></div>
    <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-3"><UserPlus size={18} /> Register Faculty / Dean</button>
  </header>
);

interface FacultyFiltersProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const FacultyFilters: React.FC<FacultyFiltersProps> = ({ isDarkMode, searchTerm, setSearchTerm }) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
    <input type="text" placeholder="Search by Name, Department or Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-12 pr-6 py-4 rounded-3xl border outline-none focus:border-blue-500 transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
  </div>
);

interface FacultyTableProps {
  isDarkMode: boolean;
  filteredFaculty: User[];
  handleGenerateKey: (f: User) => void;
  onRemoveUser?: (id: string) => void;
}

const FacultyTable: React.FC<FacultyTableProps> = ({ isDarkMode, filteredFaculty, handleGenerateKey, onRemoveUser }) => (
  <div className={`rounded-[3rem] border overflow-hidden ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
    <table className="w-full text-left">
      <thead className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          <th className="px-10 py-8">Faculty Identity</th>
          <th className="px-10 py-8">Department</th>
          <th className="px-10 py-8">Credentials</th>
          <th className="px-10 py-8 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {filteredFaculty.map(f => (
          <tr key={f.id} className="hover:bg-emerald-500/5 transition-colors group">
            <td className="px-10 py-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center font-black text-xl">{f.name[0]}</div>
                <div><p className="font-black text-lg tracking-tight">{f.name}</p><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{f.email}</p></div>
              </div>
            </td>
            <td className="px-10 py-8"><span className="px-4 py-1.5 rounded-full bg-[var(--bg-surface)]/50 border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{f.branch || 'General Administration'}</span></td>
            <td className="px-10 py-8"><div className="flex items-center gap-3"><div className="flex items-center gap-2 text-[10px] font-mono opacity-60"><Key size={12} /> {f.password || '•••••••••'}</div><button onClick={() => handleGenerateKey(f)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Key size={14} /></button></div></td>
            <td className="px-10 py-8 text-right"><div className="flex justify-end gap-3 items-center"><span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2"><ShieldCheck size={14} /> Active</span><button onClick={() => onRemoveUser?.(f.id)} className="p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button></div></td>
          </tr>
        ))}
        {filteredFaculty.length === 0 && (<tr><td colSpan={4} className="px-10 py-20 text-center opacity-30 font-black uppercase tracking-widest">No faculty records found</td></tr>)}
      </tbody>
    </table>
  </div>
);

const RegisterFacultyModal: React.FC<any> = ({ isDarkMode, setIsAddModalOpen, newFaculty, setNewFaculty, handleCreateFaculty }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
    <div className={`w-full max-w-xl rounded-[3rem] p-12 border ${isDarkMode ? 'bg-[#0d121d] border-white/10' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black tracking-tight">Register Faculty / Dean</h2><button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl hover:bg-[var(--primary-soft)] transition-all"><X size={24} /></button></div>
      <form onSubmit={handleCreateFaculty} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: Role.FACULTY, label: 'Faculty' },
            { value: Role.DEAN, label: 'Dean' }
          ].map(option => (
            <button key={option.value} type="button" onClick={() => setNewFaculty({ ...newFaculty, role: option.value })} className={`rounded-3xl border px-4 py-4 text-sm font-black uppercase tracking-[0.25em] ${newFaculty.role === option.value ? 'bg-primary text-white border-primary' : 'border-white/10 bg-white/5 text-[var(--text-secondary)] hover:border-white/20'}`}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Full Identity Name</label><input required type="text" value={newFaculty.name} onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} className={`w-full px-6 py-4 rounded-2xl border outline-none focus:border-emerald-500 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="Dr. Satish Kumar" /></div>
        <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Institutional Email</label><input required type="email" value={newFaculty.email} onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })} className={`w-full px-6 py-4 rounded-2xl border outline-none focus:border-emerald-500 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="satish@mitsgwalior.in" /></div>
        <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Departmental Domain</label><select value={newFaculty.department} onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })} className={`w-full px-6 py-4 rounded-2xl border outline-none focus:border-emerald-500 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}><option value="">Select Domain</option>{['CSE', 'IT', 'ECE', 'ME', 'CE', 'Architecture', 'AI&DS', 'IoT'].map(d => (<option key={d} value={d}>{d}</option>))}</select></div>
        <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all active:scale-95 mt-6">Initialize Node Credentials</button>
      </form>
    </div>
  </div>
);

interface Props { allUsers: User[]; onAddUser: (user: User) => void; onUpdateUser: (user: User) => void; onRemoveUser?: (id: string) => void; isDarkMode: boolean; }

const FacultyRegistry: React.FC<Props> = ({ allUsers, onAddUser, onUpdateUser, onRemoveUser, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', email: '', department: '', role: Role.FACULTY as Role.FACULTY | Role.DEAN });

  const facultyMembers = allUsers.filter(u => u.globalRole === Role.FACULTY || u.globalRole === Role.DEAN);
  const filteredFaculty = facultyMembers.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || (f.branch || '').toLowerCase().includes(searchTerm.toLowerCase()) || f.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault(); if (allUsers.some(u => u.email.toLowerCase() === newFaculty.email.toLowerCase())) { alert("Registration Error: Authority Node already exists."); return; }
    const password = db.generateRandomPassword();
    const user: User = { id: `${newFaculty.role.toLowerCase()}-${Date.now()}`, name: newFaculty.name, email: newFaculty.email, globalRole: newFaculty.role, clubMemberships: [], branch: newFaculty.department, password };
    onAddUser(user); setNewFaculty({ name: '', email: '', department: '', role: Role.FACULTY }); setIsAddModalOpen(false);
    alert(`Credentials generated\nEmail: ${user.email}\nPassword: ${password}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <FacultyHeader setIsAddModalOpen={setIsAddModalOpen} />
      <FacultyFilters isDarkMode={isDarkMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FacultyTable isDarkMode={isDarkMode} filteredFaculty={filteredFaculty} handleGenerateKey={(f) => onUpdateUser({ ...f, password: db.generateRandomPassword() })} onRemoveUser={onRemoveUser} />
      {isAddModalOpen && <RegisterFacultyModal isDarkMode={isDarkMode} setIsAddModalOpen={setIsAddModalOpen} newFaculty={newFaculty} setNewFaculty={setNewFaculty} handleCreateFaculty={handleCreateFaculty} />}
    </div>
  );
};

export default FacultyRegistry;
