import React from 'react';
import { ShieldCheck, Award, Sparkles, Building2, GraduationCap, Heart, CheckCircle2 } from 'lucide-react';

export const PartnersMentorsSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const partners = [
    {
      name: 'MITS Gwalior',
      subtitle: 'Grant-in-Aid Autonomous Institute',
      logo: '/mitslogo.jpg',
      badge: 'NAAC A++ Accredited'
    },
    {
      name: 'Smart India Hackathon',
      subtitle: 'Ministry of Education / AICTE',
      logo: '/image.png',
      badge: 'National Innovation Partner'
    },
    {
      name: 'Clix Ecosystem',
      subtitle: 'Campus Operations System',
      logo: '/logo.png',
      badge: 'Core Infrastructure'
    },
    {
      name: 'Student Welfare Cell',
      subtitle: 'MITS Campus Governance',
      logo: '/mitslogo.jpg',
      badge: 'Institutional Body'
    }
  ];

  return (
    <section className="py-20 px-4 md:px-8 border-t border-[var(--border-color)] relative overflow-hidden bg-[var(--bg-main)]">
      {/* Background Accent Orbs */}
      <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-10 bg-blue-600" />
      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-10 bg-indigo-600" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] border border-[var(--border-color)] text-primary">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Governance</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-main)] font-display">
            Supporting Partners & <span className="text-primary italic">Institutional Mentors</span>
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
            Backed by Government accreditation, institutional mentorship, and industry-grade engineering frameworks.
          </p>
        </div>

        {/* Institutional Mentor Feature Card */}
        <div className="uni-pill-card p-8 md:p-12 border border-[var(--border-color)] rounded-[3rem] shadow-2xl relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Mentor Image Container */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 blur-md" />
                <div className="relative w-48 h-56 md:w-56 md:h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900">
                  <img
                    src="/minim.png"
                    alt="Dr. Minakshi Poonia"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as any).src = '/mitslogo.jpg'; }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-900/90 backdrop-blur-md text-center border border-white/20">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Faculty Advisor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Details & Quote */}
            <div className="md:col-span-8 space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold">
                <GraduationCap size={16} /> Department of Mathematics & Computing
              </div>
              <div>
                <h3 className="text-3xl font-black text-[var(--text-main)]">Dr. Minakshi Poonia</h3>
                <p className="text-sm font-semibold text-primary mt-1">Faculty Advisor & Institutional Mentor • MITS Gwalior</p>
              </div>

              <blockquote className="text-sm md:text-base text-[var(--text-secondary)] italic leading-relaxed border-l-4 border-blue-500 pl-4 py-1">
                "Fostering student-led innovation, digital transparency, and technical excellence across campus organizations at Madhav Institute of Technology & Science."
              </blockquote>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)]">
                  <CheckCircle2 size={16} className="text-emerald-500" /> NAAC A++ Institutional Mentorship
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)]">
                  <ShieldCheck size={16} className="text-blue-500" /> Official Club Oversight
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Partners Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Empowered By Leading Institutions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="uni-pill-card p-6 rounded-3xl border border-[var(--border-color)] text-center space-y-4 hover:border-primary/40 hover:scale-[1.02] transition-all shadow-lg bg-[var(--bg-surface)]"
              >
                <div className="w-16 h-16 rounded-2xl mx-auto bg-white p-2 border border-slate-200 shadow-md flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as any).src = '/mitslogo.jpg'; }}
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[var(--text-main)]">{partner.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{partner.subtitle}</p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                  {partner.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
