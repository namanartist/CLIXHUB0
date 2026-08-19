import React from 'react';
import { ArrowRight, ShieldCheck, GraduationCap, Briefcase, UserCheck, Crown, Cpu, Palette, Sparkles } from 'lucide-react';

interface DemoPanelProps {
  handleDemoLogin: (email: string) => void;
  isLoading: boolean;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({ handleDemoLogin, isLoading }) => {
  const demoItems = [
    {
      user: { id: 'usr_student_demo', name: 'Naman Lahariya / Demo Student', email: 'student@mitsgwl.ac.in', globalRole: 'Student' },
      icon: GraduationCap,
      gradient: 'from-blue-600/20 to-cyan-600/10',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      hoverBorder: 'hover:border-blue-500/50',
      arrowColor: 'text-blue-400',
      desc: 'ACM President · Tickets · Events · Certificates · Website Editor · Governance',
      alias: 'student@mitsgwl.ac.in'
    },
    {
      user: { id: 'usr_faculty_demo', name: 'Dr. Priya Verma / Central Coordinator', email: 'faculty@mitsgwl.ac.in', globalRole: 'Faculty' },
      icon: Briefcase,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      hoverBorder: 'hover:border-amber-500/50',
      arrowColor: 'text-amber-400',
      desc: 'Faculty Coordinator · Event Approvals · Certificate Signoffs · Club Oversight',
      alias: 'faculty@mitsgwl.ac.in'
    },
    {
      user: { id: 'usr_dean_1', name: 'Prof. Alok Bansal', email: 'dean.sw@mitsgwl.ac.in', globalRole: 'Dean' },
      icon: UserCheck,
      gradient: 'from-purple-600/20 to-violet-600/10',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      hoverBorder: 'hover:border-purple-500/50',
      arrowColor: 'text-purple-400',
      desc: 'Dean Student Welfare · Institutional Proposals · Final Batch Approvals',
      alias: 'dean.sw@mitsgwl.ac.in'
    },
    {
      user: { id: 'usr_admin_1', name: 'Dr. Rajeev Sharma', email: 'admin@mitsgwl.ac.in', globalRole: 'Super Admin' },
      icon: Crown,
      gradient: 'from-rose-600/20 to-pink-600/10',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      iconColor: 'text-rose-400',
      badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      hoverBorder: 'hover:border-rose-500/50',
      arrowColor: 'text-rose-400',
      desc: 'Super Administrator · System Logs · Global Audits · User & Venue Registry',
      alias: 'admin@mitsgwl.ac.in'
    },
    {
      user: { id: 'usr_student_2', name: 'Aryan Gupta', email: 'aryan@mitsgwl.ac.in', globalRole: 'Student' },
      icon: Cpu,
      gradient: 'from-emerald-600/20 to-teal-600/10',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      hoverBorder: 'hover:border-emerald-500/50',
      arrowColor: 'text-emerald-400',
      desc: 'Robotics Club President · Robowars Organizer · Hardware Lab',
      alias: 'aryan@mitsgwl.ac.in'
    },
    {
      user: { id: 'usr_student_3', name: 'Riya Sharma', email: 'riya@mitsgwl.ac.in', globalRole: 'Student' },
      icon: Palette,
      gradient: 'from-fuchsia-600/20 to-pink-600/10',
      iconBg: 'bg-fuchsia-500/10 border-fuchsia-500/20',
      iconColor: 'text-fuchsia-400',
      badgeColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
      hoverBorder: 'hover:border-fuchsia-500/50',
      arrowColor: 'text-fuchsia-400',
      desc: 'Design Club President · Media Wing · Brand Assets & Figma',
      alias: 'riya@mitsgwl.ac.in'
    },
    {
      user: { id: 'usr_student_4', name: 'Sneha Patel', email: 'sneha@mitsgwl.ac.in', globalRole: 'Student' },
      icon: Sparkles,
      gradient: 'from-cyan-600/20 to-indigo-600/10',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-400',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      hoverBorder: 'hover:border-cyan-500/50',
      arrowColor: 'text-cyan-400',
      desc: 'AI & Data Science President · LLM Masterclass · Hackathon Lead',
      alias: 'sneha@mitsgwl.ac.in'
    }
  ];

  return (
    <div className="bento-card p-5 sm:p-8 md:p-10 space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tighter">Demo Uplink Hub</h3>
        <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">Click any role to test all features with complete permissions</p>
      </div>
      <div className="grid grid-cols-1 gap-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
        {demoItems.map(({ user, icon: Icon, gradient, iconBg, iconColor, badgeColor, hoverBorder, arrowColor, desc, alias }, i) => (
          <button
            key={user.id}
            type="button"
            onClick={() => handleDemoLogin(alias)}
            disabled={isLoading}
            className={`group text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${gradient} border border-[var(--border-color)] ${hoverBorder} hover:shadow-lg transition-all duration-300 flex items-center justify-between reveal disabled:opacity-60 disabled:cursor-not-allowed`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-2xl border ${iconBg} ${iconColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-sm sm:text-base tracking-tight leading-none text-[var(--text-main)] truncate">{user.name}</p>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${badgeColor}`}>{user.globalRole}</span>
                </div>
                <p className="text-[10px] font-semibold text-[var(--text-secondary)] tracking-wide line-clamp-1">{desc}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60 font-mono">{alias}</p>
              </div>
            </div>
            <div className={`shrink-0 flex items-center gap-1 ${arrowColor} opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 pl-2`}>
              <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Access</span>
              <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-primary-soft/30 border border-[var(--border-color)]">
        <ShieldCheck size={16} className="text-primary shrink-0" />
        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">All demo sessions have full access enabled · Safe to explore & test</p>
      </div>
    </div>
  );
};

export default DemoPanel;
