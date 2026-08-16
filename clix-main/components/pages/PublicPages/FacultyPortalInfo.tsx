import React from 'react';
import { GraduationCap, ShieldCheck, Lock } from 'lucide-react';
import { PublicLayout } from './PublicLayout';

export const FacultyPortalInfo: React.FC<{ onBack: () => void; onLogin: () => void }> = ({ onBack, onLogin }) => {
  const features = [
    { icon: '✓', title: 'Event Approvals', desc: 'Review and authorize all club events with instant notifications' },
    { icon: '✓', title: 'Budget Oversight', desc: 'Audit financial transactions and fund allocations in real-time' },
    { icon: '✓', title: 'Certificates & Credentials', desc: 'Issue verified and tamper-proof digital credentials' },
    { icon: '✓', title: 'Leadership Registry', desc: 'Maintain records of all club leadership positions and transitions' },
    { icon: '✓', title: 'Attendance Verification', desc: 'Confirm genuine participation in institutional events' },
    { icon: '✓', title: 'Performance Analytics', desc: 'Track club engagement, event success metrics, and student outcomes' }
  ];

  return (
    <PublicLayout title="Faculty Portal" subtitle="Institutional Oversight & Leadership Governance" icon={<GraduationCap size={32} className="text-emerald-400" />} onBack={onBack}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/30 rounded-[2.5rem] p-10 space-y-6 shadow-xl shadow-emerald-500/10 backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3">Governance Authority</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Faculty coordinators serve as the institutional oversight body, ensuring all student club activities align with campus standards and educational mission.</p>
            </div>
            <ul className="space-y-3">
              {['View all club proposals', 'Approve/reject event applications', 'Monitor financial compliance'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]"><div className="w-2 h-2 rounded-full bg-emerald-400" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-[2.5rem] p-10 space-y-6 shadow-xl shadow-cyan-500/10 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 mb-6">
                <Lock size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3">Secure Access</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">Access to the Faculty Portal is restricted to verified institutional accounts with multi-factor authentication and role-based permissions.</p>
            </div>
            <button onClick={onLogin} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-[var(--text-main)] rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-cyan-600/30 transition-all">Access Faculty Portal</button>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[var(--text-main)]">Portal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="uni-pill-card/50 border border-cyan-400/10 rounded-2xl p-8 space-y-4 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group">
                <div className="text-3xl font-black text-cyan-400 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h4 className="text-lg font-bold text-[var(--text-main)]">{feature.title}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#111C44]/50 to-[#0F1A3D]/50 border border-[var(--border-color)] rounded-[2.5rem] p-12 space-y-6">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Enrollment Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-5xl font-black text-cyan-400">1</div>
              <h4 className="text-lg font-bold text-[var(--text-main)]">Request Access</h4>
              <p className="text-[var(--text-secondary)] text-sm">Contact your institutional administrator with your institutional email ID and faculty designation.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-cyan-400">2</div>
              <h4 className="text-lg font-bold text-[var(--text-main)]">Verification</h4>
              <p className="text-[var(--text-secondary)] text-sm">Your credentials will be verified through MITS directory and you'll receive activation instructions.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-cyan-400">3</div>
              <h4 className="text-lg font-bold text-[var(--text-main)]">Activate Portal</h4>
              <p className="text-[var(--text-secondary)] text-sm">Set up your secure password and enable two-factor authentication to begin managing clubs.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
