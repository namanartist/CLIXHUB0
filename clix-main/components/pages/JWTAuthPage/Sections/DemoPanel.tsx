import React from 'react';
import { ArrowRight, ShieldCheck, GraduationCap, Briefcase, UserCheck, Crown } from 'lucide-react';
import { DEMO_USERS } from '../../../../constants';

interface DemoPanelProps {
  handleDemoLogin: (email: string) => void;
  isLoading: boolean;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({ handleDemoLogin, isLoading }) => {
  const demoItems = [
    { user: { id: 'demo-student', name: 'Demo Student', email: 'student@mitsgwl.ac.in', globalRole: 'Student' }, icon: GraduationCap, gradient: 'from-blue-600/20 to-cyan-600/10', iconBg: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-500', badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10', hoverBorder: 'hover:border-blue-500/50', arrowColor: 'text-blue-500', desc: 'Student dashboard · Events · Clubs · Certificates' },
    { user: { id: 'demo-faculty', name: 'Demo Faculty', email: 'faculty@mitsgwl.ac.in', globalRole: 'Faculty' }, icon: Briefcase, gradient: 'from-amber-500/20 to-orange-500/10', iconBg: 'bg-amber-500/10 border-amber-500/20', iconColor: 'text-amber-500', badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10', hoverBorder: 'hover:border-amber-500/50', arrowColor: 'text-amber-500', desc: 'Faculty panel · Oversight · Event approvals' },
    { user: { id: 'demo-dean', name: 'Dean Student Welfare', email: 'dean.sw@mitsgwl.ac.in', globalRole: 'Dean' }, icon: UserCheck, gradient: 'from-purple-600/20 to-violet-600/10', iconBg: 'bg-purple-500/10 border-purple-500/20', iconColor: 'text-purple-400', badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10', hoverBorder: 'hover:border-purple-500/50', arrowColor: 'text-purple-400', desc: 'Dean portal · Policy governance · Final approvals' },
    { user: { id: 'demo-admin', name: 'System Administrator', email: 'admin@mitsgwl.ac.in', globalRole: 'Super Admin' }, icon: Crown, gradient: 'from-rose-600/20 to-pink-600/10', iconBg: 'bg-rose-500/10 border-rose-500/20', iconColor: 'text-rose-400', badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10', hoverBorder: 'hover:border-rose-500/50', arrowColor: 'text-rose-400', desc: 'Super Admin · Full system control · All features' },
  ];

  return (
    <div className="bento-card p-10 space-y-8">
      <div className="space-y-2">
        <h3 className="text-4xl font-black tracking-tighter">Demo Uplink</h3>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Click any identity to instantly access the dashboard</p>
      </div>
      <div className="grid grid-cols-1 gap-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
        {demoItems.map(({ user, icon: Icon, gradient, iconBg, iconColor, badgeColor, hoverBorder, arrowColor, desc }, i) => (
          <button key={user.id} onClick={() => handleDemoLogin(user.email)} disabled={isLoading} className={`group text-left p-5 rounded-2xl bg-gradient-to-r ${gradient} border border-[var(--border-color)] ${hoverBorder} hover:shadow-lg transition-all duration-300 flex items-center justify-between reveal disabled:opacity-60 disabled:cursor-not-allowed`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl border ${iconBg} ${iconColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}><Icon size={26} strokeWidth={2} /></div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap"><p className="font-black text-base tracking-tight leading-none">{user.name}</p><span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${badgeColor}`}>{user.globalRole}</span></div>
                <p className="text-[10px] font-semibold text-[var(--text-secondary)] tracking-wide">{desc}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50">{user.email}</p>
              </div>
            </div>
            <div className={`shrink-0 flex items-center gap-1 ${arrowColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}><span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">Enter</span><ArrowRight size={18} /></div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-soft/30 border border-[var(--border-color)]">
        <ShieldCheck size={16} className="text-primary shrink-0" />
        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">All demo sessions are isolated · No data is persisted · Safe to explore</p>
      </div>
    </div>
  );
};
