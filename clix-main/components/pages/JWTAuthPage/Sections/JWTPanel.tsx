import React from 'react';
import { AlertCircle, BookOpen, Briefcase, Mail, Hash, GraduationCap, ChevronDown, Building2, Lock, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

interface JWTPanelProps {
  formType: 'login' | 'signup';
  setFormType: (val: 'login' | 'signup') => void;
  error: string | null;
  setError: (val: string | null) => void;
  signupRole: 'student' | 'faculty';
  setSignupRole: (val: 'student' | 'faculty') => void;
  name: string;
  setName: (val: string) => void;
  designation: string;
  setDesignation: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  enrollmentNumber: string;
  setEnrollmentNumber: (val: string) => void;
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  handleJWTSubmit: (e: React.FormEvent) => void;
  inputClass: string;
  selectClass: string;
}

export const JWTPanel: React.FC<JWTPanelProps> = ({
  formType, setFormType, error, setError, signupRole, setSignupRole, name, setName, designation, setDesignation, email, setEmail, enrollmentNumber, setEnrollmentNumber, selectedBranch, setSelectedBranch, selectedDepartment, setSelectedDepartment, password, setPassword, showPassword, setShowPassword, isLoading, handleJWTSubmit, inputClass, selectClass
}) => (
  <div className="uni-glass rounded-2xl p-10 space-y-7">
    <div className="space-y-1">
      <h3 className="text-3xl font-black tracking-tighter">{formType === 'login' ? 'System Login' : 'Create Node'}</h3>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{formType === 'login' ? 'Provide institutional credentials' : 'Register your institutional identity'}</p>
    </div>
    <div className="flex gap-4 border-b border-[var(--border-color)] pb-4">
      {(['login', 'signup'] as const).map(t => (
        <button key={t} onClick={() => { setFormType(t); setError(null); }} className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all relative ${formType === t ? 'text-primary' : 'text-[var(--text-secondary)]'}`}>
          {t === 'login' ? 'Authentication' : 'Registration'}
          {formType === t && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary rounded-full" />}
        </button>
      ))}
    </div>
    {error && <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"><AlertCircle size={18} /> {error}</div>}
    <form onSubmit={handleJWTSubmit} className="space-y-4">
      {formType === 'signup' && (
        <>
          <div className="flex gap-3 bg-primary-soft/30 p-1 rounded-2xl border border-[var(--border-color)]">
            <button type="button" onClick={() => setSignupRole('student')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${signupRole === 'student' ? 'bg-primary text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}><BookOpen size={12} className="inline mr-2" /> Student</button>
            <button type="button" onClick={() => setSignupRole('faculty')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${signupRole === 'faculty' ? 'bg-purple-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}><Briefcase size={12} className="inline mr-2" /> Faculty</button>
          </div>
          <input type="text" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
          {signupRole === 'faculty' && <input type="text" placeholder="Designation (e.g. Assistant Professor) *" value={designation} onChange={e => setDesignation(e.target.value)} required className={inputClass} />}
        </>
      )}
      <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><input type="email" placeholder="Institutional Email *" value={email} onChange={e => setEmail(e.target.value)} required className={`${inputClass} pl-12`} /></div>
      {formType === 'signup' && signupRole === 'student' && (
        <>
          <div className="relative"><Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><input type="text" placeholder="Enrollment Number (e.g. 0901CS221001)" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} className={`${inputClass} pl-12`} /></div>
          <div className="relative"><GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} required className={`${selectClass} pl-12`}><option value="">Select Branch *</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
        </>
      )}
      {formType === 'signup' && signupRole === 'faculty' && (
        <div className="relative"><Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} required className={`${selectClass} pl-12`}><option value="">Select Department *</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
      )}
      <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none z-10" size={18} /><input type={showPassword ? 'text' : 'password'} placeholder="Password *" value={password} onChange={e => setPassword(e.target.value)} required className={`${inputClass} pl-12 pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-gray-600 transition-colors z-10">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      <button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2">{isLoading ? 'Processing...' : formType === 'login' ? 'Initiate Link' : 'Register Node'}{!isLoading && <ArrowRight size={16} />}</button>
    </form>
  </div>
);
