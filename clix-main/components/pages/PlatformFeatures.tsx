import React from 'react';
import { PublicLayout } from './PublicPages';
import { 
  ShieldCheck, 
  Wallet, 
  Cpu, 
  Zap, 
  Globe, 
  Code,
  Layers
} from 'lucide-react';

const FeaturesGrid: React.FC = () => {
  const features = [
    { title: "Governance Core", desc: "RBAC for Presidents, Faculty, and Admins. Hierarchical approval workflows.", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Treasury & Finance", desc: "Integrated UPI verification. Automated quotation handling with audit trails.", icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Smart Recruiter", desc: "Automated screening. Scores intent statements and categorizes candidates.", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Vault Storage", desc: "AES-256 encrypted institutional data vault for secure record management.", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Real-time Uplink", desc: "Low-latency state synchronization using optimized WebSocket protocols.", icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { title: "Public Microsites", desc: "Auto-generated, SEO-optimized landing pages with dynamic CMS.", icon: Globe, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((f, i) => (
        <div key={i} className={`p-8 rounded-[2.5rem] border ${f.border} ${f.bg} backdrop-blur-sm relative group overflow-hidden`}>
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-all duration-500"><f.icon size={120} className={f.color} /></div>
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#02040a] border border-[var(--border-color)] shadow-xl"><f.icon size={28} className={f.color} /></div>
            <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{f.title}</h3>
            <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const TechStack: React.FC = () => (
  <div className="p-12 rounded-[3rem] uni-pill-card/50 border border-[var(--border-color)] text-center space-y-8">
    <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Built on Modern Primitives</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {['React 18', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Intelligent Core', 'Recharts'].map((tech) => (
        <span key={tech} className="px-6 py-3 rounded-full bg-[#02040a] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <Code size={14} className="text-[#0055FF]"/> {tech}
        </span>
      ))}
    </div>
  </div>
);

const PlatformFeatures: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PublicLayout title="Modular Infrastructure" subtitle="A distributed institutional operating system designed for high-velocity campus governance." icon={<Layers size={32} className="text-[#0055FF]" />} onBack={onBack}>
    <div className="space-y-20">
      <FeaturesGrid />
      <TechStack />
    </div>
  </PublicLayout>
);

export default PlatformFeatures;
