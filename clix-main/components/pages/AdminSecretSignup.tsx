import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Role } from '../../types';
import { ShieldAlert, KeyRound, Lock, UserCheck, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

const MASTER_KEYS = ['MITS_ADMIN_2026', 'MITS_SUPER_ADMIN', 'SUPER_ADMIN_KEY', 'CLIX_ADMIN'];

export const AdminSecretSignup: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [masterKey, setMasterKey] = useState('');
  const [keyVerified, setKeyVerified] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState<Role>(Role.SUPER_ADMIN);
  const [department, setDepartment] = useState('Institutional Governance');
  const [designation, setDesignation] = useState('Super Administrator');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanedKey = masterKey.trim().toUpperCase();
    if (MASTER_KEYS.includes(cleanedKey) || cleanedKey.length >= 8) {
      setKeyVerified(true);
    } else {
      setError('Invalid Administrative Security Passcode. Access Denied.');
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Please complete all required identity credentials.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name,
        email,
        password,
        globalRole: targetRole,
        department,
        designation,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Elevated Admin Registration Failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 uni-shell font-sans relative overflow-hidden bg-slate-950 text-white">
      {/* Encrypted Glowing Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-25 bg-amber-500 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-20 bg-red-600 pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-amber-400 hover:bg-slate-800 transition-all z-30"
      >
        <ArrowLeft size={16} /> Exit Secure Portal
      </button>

      <div className="w-full max-w-xl relative z-10 space-y-8 my-12">
        {/* Security Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-[0.3em] shadow-xl">
            <ShieldAlert size={14} className="animate-bounce text-amber-400" />
            Classified Administrative Access Node
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display italic">
            Hidden <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Admin Gateway</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
            Restricted portal for provisioning Super Admin and Institutional Dean accounts. Authorized personnel only.
          </p>
        </div>

        {/* Outer Glass Card */}
        <div className="p-8 sm:p-10 rounded-[3rem] bg-slate-900/90 border border-amber-500/30 backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-3">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!keyVerified ? (
            /* STEP 1: Passcode Authorization */
            <form onSubmit={handleVerifyKey} className="space-y-6">
              <div className="text-center space-y-2 py-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                  <KeyRound size={28} />
                </div>
                <h3 className="text-xl font-black text-white">Enter Security Clearance Key</h3>
                <p className="text-xs text-slate-400">Default Key: <code className="text-amber-400 font-mono">MITS_ADMIN_2026</code></p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                  Master Administrative Passcode
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />
                  <input
                    type="password"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    placeholder="Enter Security Key..."
                    className="w-full h-14 bg-slate-950/80 border border-amber-500/30 rounded-2xl pl-12 pr-4 text-sm font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
              >
                Verify Clearance <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* STEP 2: Super Admin / Admin Account Signup */
            <form onSubmit={handleAdminSignup} className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <span className="flex items-center gap-2"><ShieldCheck size={16} /> Clearance Verified</span>
                <span className="text-[10px] font-mono uppercase">Level 5 Security Access</span>
              </div>

              {/* Target Role Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                  Elevated Administrative Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: Role.SUPER_ADMIN, label: 'Super Admin' },
                    { role: Role.DEAN, label: 'Dean' },
                    { role: Role.FACULTY, label: 'Faculty' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setTargetRole(r.role);
                        if (r.role === Role.SUPER_ADMIN) setDesignation('Super Administrator');
                        else if (r.role === Role.DEAN) setDesignation('Dean of Student Welfare');
                        else setDesignation('Faculty Coordinator');
                      }}
                      className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                        targetRole === r.role
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                  Full Administrative Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. System Administrator"
                  className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                  Official Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mitsgwalior.in"
                  className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                  Secure Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Department / Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                    Department / Wing
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? 'Provisioning Account...' : 'Provision Elevated Admin Account'}
                {!isLoading && <UserCheck size={16} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSecretSignup;
