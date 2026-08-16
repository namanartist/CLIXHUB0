import React, { useState } from 'react';
import { User, Role } from '../../types';
import { db } from '../../db';
import { 
  Users, 
  Key, 
  Upload, 
  UserPlus, 
  Search, 
  Trash2, 
  X, 
  ShieldCheck, 
  GraduationCap,
  Briefcase,
  Shield,
  Filter
} from 'lucide-react';

interface RegistryHeaderProps {
  isDarkMode: boolean;
  handleBatchGenerate: () => void;
  setIsBulkModalOpen: (val: boolean) => void;
  setIsSingleModalOpen: (val: boolean) => void;
}

const RegistryHeader: React.FC<RegistryHeaderProps> = ({ handleBatchGenerate, setIsBulkModalOpen, setIsSingleModalOpen }) => (
  <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500"><Users size={18} /></div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Institutional Directory & Access Hub</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-main)] uppercase font-display">
        User <span className="text-primary italic">Registry</span>
      </h1>
      <p className="text-[var(--text-secondary)] font-medium max-w-2xl text-xs sm:text-sm">
        Search, verify, and govern credentials for all active Students, Faculty members, Deans, and Administrators in the database.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={handleBatchGenerate} className="px-6 py-3.5 bg-[var(--primary-soft)] border border-[var(--border-color)] text-[var(--text-main)] rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[var(--primary-soft)] transition-all flex items-center gap-2">
        <Key size={16} /> Cycle Keys
      </button>
      <button onClick={() => setIsBulkModalOpen(true)} className="px-6 py-3.5 border-2 border-dashed border-[var(--border-color)] text-[var(--text-secondary)] rounded-2xl font-bold text-xs uppercase tracking-wider hover:text-[var(--text-main)] hover:border-blue-500 transition-all flex items-center gap-2">
        <Upload size={16} /> Bulk Import
      </button>
      <button onClick={() => setIsSingleModalOpen(true)} className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2">
        <UserPlus size={16} /> Add Member
      </button>
    </div>
  </header>
);

interface RegistryFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (val: string) => void;
  filteredCount: number;
}

const RegistryFilters: React.FC<RegistryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedRoleFilter,
  setSelectedRoleFilter,
  filteredCount
}) => (
  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
    {/* Universal Database Search Bar */}
    <div className="relative flex-1 w-full group">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-all" size={18} />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Students & Faculty by Name, Email, Roll No, Branch, Dept..."
        className="w-full pl-14 pr-6 h-14 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl outline-none focus:border-blue-500 text-xs font-bold text-[var(--text-main)] transition-all shadow-md placeholder:text-[var(--text-secondary)]"
      />
    </div>

    {/* Role Category Tabs */}
    <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
      {[
        { id: 'All', label: 'All Members' },
        { id: Role.STUDENT, label: 'Students' },
        { id: Role.FACULTY, label: 'Faculty' },
        { id: Role.DEAN, label: 'Deans' },
        { id: Role.SUPER_ADMIN, label: 'Admins' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedRoleFilter(tab.id)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedRoleFilter === tab.id
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          {tab.label}
        </button>
      ))}

      <div className="px-4 py-2.5 bg-[var(--primary-soft)] border border-[var(--border-color)] rounded-xl whitespace-nowrap">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{filteredCount} Members</p>
      </div>
    </div>
  </div>
);

interface RegistryTableProps {
  filteredUsers: User[];
  handleGenerateKey: (user: User) => void;
  onRemoveUser?: (userId: string) => void;
}

const RegistryTable: React.FC<RegistryTableProps> = ({ filteredUsers, handleGenerateKey, onRemoveUser }) => (
  <div className="uni-glass rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-2xl">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[var(--primary-soft)] border-b border-[var(--border-color)]">
          <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            <th className="px-8 py-6">Member Identity</th>
            <th className="px-8 py-6">Role & Status</th>
            <th className="px-8 py-6">Academic Unit / Dept</th>
            <th className="px-8 py-6">Security Key</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u: User) => {
              const isFaculty = u.globalRole === Role.FACULTY;
              const isDean = u.globalRole === Role.DEAN;
              const isAdmin = u.globalRole === Role.SUPER_ADMIN;

              let roleBadgeColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
              let roleIcon = <GraduationCap size={12} />;

              if (isFaculty) {
                roleBadgeColor = 'bg-purple-500/10 text-purple-500 border-purple-500/20';
                roleIcon = <Briefcase size={12} />;
              } else if (isDean) {
                roleBadgeColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                roleIcon = <ShieldCheck size={12} />;
              } else if (isAdmin) {
                roleBadgeColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                roleIcon = <Shield size={12} />;
              }

              return (
                <tr key={u.id} className="hover:bg-blue-600/[0.03] transition-colors group">
                  {/* Identity */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black text-xl border border-blue-500/20 shadow-md shrink-0">
                        {u.name ? u.name[0] : 'U'}
                      </div>
                      <div>
                        <p className="font-extrabold text-base text-[var(--text-main)] tracking-tight">{u.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${roleBadgeColor}`}>
                        {roleIcon} {u.globalRole}
                      </span>
                      {u.designation && (
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">{u.designation}</p>
                      )}
                    </div>
                  </td>

                  {/* Department / Branch / Roll */}
                  <td className="px-8 py-6">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[var(--text-main)]">{u.department || u.branch || 'General Division'}</p>
                      {u.enrollmentNumber && (
                        <p className="text-[10px] font-mono text-[var(--text-secondary)]">Roll: {u.enrollmentNumber}</p>
                      )}
                    </div>
                  </td>

                  {/* Security Key */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-xs font-bold text-blue-500">
                        {u.password || '••••••••'}
                      </span>
                      <button
                        onClick={() => handleGenerateKey(u)}
                        title="Generate Password Key"
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Key size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => onRemoveUser?.(u.id)}
                      className="p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Remove Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-8 py-24 text-center opacity-40 font-bold text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                No matching members found in database
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

interface SingleEntryModalProps {
  setIsSingleModalOpen: (val: boolean) => void;
  newStudent: any;
  setNewStudent: (val: any) => void;
  handleSingleSubmit: (e: React.FormEvent) => void;
}

const SingleEntryModal: React.FC<SingleEntryModalProps> = ({
  setIsSingleModalOpen,
  newStudent,
  setNewStudent,
  handleSingleSubmit
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
    <div className="absolute inset-0" onClick={() => setIsSingleModalOpen(false)} />
    <div className="relative max-w-xl w-full bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Add Database Member</h3>
          <p className="text-xs text-[var(--text-secondary)]">Create a student or faculty node</p>
        </div>
        <button onClick={() => setIsSingleModalOpen(false)} className="p-2.5 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-all">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSingleSubmit} className="space-y-4">
        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Member Role</label>
          <div className="grid grid-cols-3 gap-2">
            {[Role.STUDENT, Role.FACULTY, Role.DEAN].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setNewStudent({ ...newStudent, role: r })}
                className={`py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition ${
                  (newStudent.role || Role.STUDENT) === r
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Full Name</label>
          <input
            type="text"
            required
            value={newStudent.name}
            onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-xs font-bold text-[var(--text-main)]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Institutional Email</label>
          <input
            type="email"
            required
            value={newStudent.email}
            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
            placeholder="rahul@mitsgwalior.in"
            className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-xs font-bold text-[var(--text-main)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              {newStudent.role === Role.FACULTY ? 'Employee ID' : 'Roll Number'}
            </label>
            <input
              type="text"
              value={newStudent.enrollment}
              onChange={e => setNewStudent({ ...newStudent, enrollment: e.target.value })}
              placeholder="0101CS21101"
              className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-xs font-bold text-[var(--text-main)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Department / Branch</label>
            <input
              type="text"
              value={newStudent.branch}
              onChange={e => setNewStudent({ ...newStudent, branch: e.target.value })}
              placeholder="Computer Science"
              className="w-full px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-xs font-bold text-[var(--text-main)]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-2"
        >
          Add to Database
        </button>
      </form>
    </div>
  </div>
);

interface BulkImportModalProps {
  setIsBulkModalOpen: (val: boolean) => void;
  bulkText: string;
  setBulkText: (val: string) => void;
  handleBulkSubmit: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  setIsBulkModalOpen,
  bulkText,
  setBulkText,
  handleBulkSubmit
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
    <div className="absolute inset-0" onClick={() => setIsBulkModalOpen(false)} />
    <div className="relative max-w-2xl w-full bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight">Bulk Data Integration</h3>
          <p className="text-xs text-[var(--text-secondary)]">Batch add students and faculty members</p>
        </div>
        <button onClick={() => setIsBulkModalOpen(false)} className="p-2.5 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-all">
          <X size={18} />
        </button>
      </div>
      <div className="space-y-5">
        <div className="p-4 bg-[var(--primary-soft)] border border-[var(--border-color)] rounded-2xl space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">CSV Protocol Format</p>
          <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">Name, Email, RollNumber, Branch (One per line)</p>
        </div>
        <textarea
          value={bulkText}
          onChange={e => setBulkText(e.target.value)}
          className="w-full h-64 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-6 outline-none focus:border-blue-500 text-xs font-mono text-[var(--text-main)] resize-none"
          placeholder="John Doe, john@mits.ac.in, 0101CS21101, CSE&#10;Dr. Ananya Sharma, ananya@mits.ac.in, FAC001, Mathematics"
        />
        <button
          onClick={handleBulkSubmit}
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Synchronize Records
        </button>
      </div>
    </div>
  </div>
);

interface Props {
  allUsers: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onRemoveUser?: (userId: string) => void;
  isDarkMode: boolean;
}

const StudentRegistry: React.FC<Props> = ({ allUsers, onAddUser, onUpdateUser, onRemoveUser, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', email: '', enrollment: '', branch: '', role: Role.STUDENT });

  // Filter users dynamically by Role and Multi-field Search Query
  const filteredUsers = allUsers.filter(u => {
    const matchesRole = selectedRoleFilter === 'All' || u.globalRole === selectedRoleFilter;
    const term = searchTerm.toLowerCase().trim();

    if (!term) return matchesRole;

    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.enrollmentNumber || '').toLowerCase().includes(term) ||
      (u.branch || '').toLowerCase().includes(term) ||
      (u.department || '').toLowerCase().includes(term) ||
      (u.designation || '').toLowerCase().includes(term) ||
      (u.globalRole || '').toLowerCase().includes(term);

    return matchesRole && matchesSearch;
  });

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allUsers.some(u => u.email.toLowerCase() === newStudent.email.toLowerCase())) {
      return alert("Email address already registered in system database.");
    }

    onAddUser({
      id: `user-${Date.now()}`,
      name: newStudent.name,
      email: newStudent.email,
      password: db.generateRandomPassword(),
      globalRole: newStudent.role || Role.STUDENT,
      clubMemberships: [],
      enrollmentNumber: newStudent.enrollment,
      branch: newStudent.branch,
      department: newStudent.branch,
      designation: newStudent.role === Role.FACULTY ? 'Faculty Member' : undefined
    });

    setIsSingleModalOpen(false);
    setNewStudent({ name: '', email: '', enrollment: '', branch: '', role: Role.STUDENT });
  };

  const handleBulkSubmit = () => {
    const lines = bulkText.split('\n').filter(line => line.trim().length > 0);
    let count = 0;
    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const [name, email, enrollment, branch] = parts;
        if (!allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          onAddUser({
            id: `user-bulk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name,
            email,
            password: db.generateRandomPassword(),
            globalRole: Role.STUDENT,
            clubMemberships: [],
            enrollmentNumber: enrollment || '',
            branch: branch || '',
            department: branch || ''
          });
          count++;
        }
      }
    });

    alert(`${count} members added to database.`);
    setIsBulkModalOpen(false);
    setBulkText('');
  };

  return (
    <div className="p-6 md:p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-700">
      <RegistryHeader
        isDarkMode={isDarkMode}
        handleBatchGenerate={() => {
          if (window.confirm(`Cycle keys for ${filteredUsers.length} members?`)) {
            filteredUsers.forEach(u => onUpdateUser({ ...u, password: db.generateRandomPassword() }));
          }
        }}
        setIsBulkModalOpen={setIsBulkModalOpen}
        setIsSingleModalOpen={setIsSingleModalOpen}
      />

      <RegistryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRoleFilter={selectedRoleFilter}
        setSelectedRoleFilter={setSelectedRoleFilter}
        filteredCount={filteredUsers.length}
      />

      <RegistryTable
        filteredUsers={filteredUsers}
        handleGenerateKey={(u: User) => onUpdateUser({ ...u, password: db.generateRandomPassword() })}
        onRemoveUser={onRemoveUser}
      />

      {isSingleModalOpen && (
        <SingleEntryModal
          setIsSingleModalOpen={setIsSingleModalOpen}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          handleSingleSubmit={handleSingleSubmit}
        />
      )}

      {isBulkModalOpen && (
        <BulkImportModal
          setIsBulkModalOpen={setIsBulkModalOpen}
          bulkText={bulkText}
          setBulkText={setBulkText}
          handleBulkSubmit={handleBulkSubmit}
        />
      )}
    </div>
  );
};

export default StudentRegistry;
