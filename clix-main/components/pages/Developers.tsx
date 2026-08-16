import React from 'react';
import { Zap, Award, Sparkles, Star, ArrowLeft, Globe, Users, Layers, Github, Linkedin, ExternalLink, Code, BookOpen, Shield, Cpu, Terminal, CheckCircle2, Rocket } from 'lucide-react';

interface DevelopersProps {
  onBack?: () => void;
  isDarkMode: boolean;
  mode?: 'console' | 'public';
}

const Developers: React.FC<DevelopersProps> = ({ onBack, isDarkMode, mode = 'console' }) => {
  const dark = isDarkMode;
  const isPublic = mode === 'public';

  const projects = [
    {
      title: 'Clean-Up Platform',
      subtitle: 'SIH Project',
      desc: 'Smart platform for managing cleanup drives and resources efficiently. Built for real-world problem solving during Smart India Hackathon.',
      tech: ['MERN', 'React', 'Node.js', 'Express', 'MongoDB'],
      status: 'Active',
      link: 'https://clean-up-eea39809.base44.app/',
      icon: <Globe size={20} className="text-emerald-400" />,
    },
    {
      title: 'MITS Website Redesign',
      subtitle: 'Modern UI Overhaul',
      desc: 'Modern UI redesign of MITS Gwalior official website with focus on UX, performance, and institutional aesthetics.',
      tech: ['React.js', 'Tailwind CSS', 'Framer Motion'],
      status: 'Completed',
      link: 'https://mitsgwl.vercel.app',
      icon: <Layers size={20} className="text-blue-400" />,
    },
    {
      title: 'Personal Portfolio',
      subtitle: 'Professional Showcase',
      desc: 'Digital signature showcasing projects, skills, and journey. Built with a modern high-performance web stack.',
      tech: ['React', 'Tailwind', 'Vercel'],
      status: 'Active',
      link: 'https://namanlahariya.vercel.app',
      icon: <Star size={20} className="text-purple-400" />,
    },
  ];

  const skillCategories = [
    { category: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'C++'] },
    { category: 'Frontend Tech', items: ['React.js', 'HTML5 / CSS3', 'TailwindCSS', 'Vite'] },
    { category: 'Backend Systems', items: ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO'] },
    { category: 'Databases & BaaS', items: ['Supabase', 'PostgreSQL', 'MongoDB'] },
    { category: 'DevOps & Tools', items: ['Git', 'GitHub', 'Vercel', 'Postman'] },
    { category: 'Design & Core', items: ['UI/UX Systems', 'Architectural Design', 'Data Engineering'] },
  ];

  const achievements = [
    'Engineered SIH Smart India Hackathon shortlisted prototype for real-world cleanup operations',
    'Developed Clean-Up Platform for efficient task, venue, and campus resource management',
    'Spearheaded Frontend Battle @ MITS Gwalior, delivering institute website redesign',
    'Designed & deployed full-stack campus governance software with live real-time sockets & Supabase',
    'Actively building next-gen intelligent AI workflows & full-stack web architectures',
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/namanartist', icon: <Github size={18} />, color: 'hover:text-cyan-400 border-cyan-500/20' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/naman-lahariya', icon: <Linkedin size={18} />, color: 'hover:text-blue-400 border-blue-500/20' },
    { name: 'Portfolio', url: 'https://namanlahariya.vercel.app', icon: <Globe size={18} />, color: 'hover:text-purple-400 border-purple-500/20' },
  ];

  const guidanceInfo = {
    name: 'Dr. Minakshi Poonia',
    title: 'Faculty Advisor & Mentor',
    dept: 'Department of Mathematics and Computing',
    quote: 'Exceptional problem-solving approach combined with persistent dedication to innovative systems design and student-led software engineering.',
    photo: '/minim.png',
  };

  const supportingPartner = {
    name: 'Naitik Goyal',
    title: 'Supporting Partner & Core Collaborator',
    role: 'Technical Strategy & Systems Collaborator',
    photo: '/naitik.jpg',
    quote: 'Driving student empowerment and institutional technological excellence through active collaboration.',
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-600 selection:text-white ${dark ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'}`}>
      {/* Background Glowing Radial Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-25 bg-blue-600 animate-pulse" />
        <div className="absolute top-1/3 right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-20 bg-indigo-600" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20 bg-cyan-500" />
      </div>

      {onBack && (
        <button
          onClick={onBack}
          aria-label="Go back"
          className="fixed top-6 left-6 z-50 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 backdrop-blur-xl transition shadow-xl group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Top Hero Section */}
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">
              <Zap size={14} className="animate-pulse text-blue-400" />
              {isPublic ? 'Architect Profile' : 'Lead Full-Stack Architect'}
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white font-display">
              Naman Lahariya <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Campus Engineer
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal">
              Full Stack Developer & Intelligent Systems Architect building high-performance MERN & Supabase ecosystems for institutional communities and student governance.
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-xl">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Role</p>
                <p className="text-sm font-extrabold text-white">Full-Stack Lead</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Institute</p>
                <p className="text-sm font-extrabold text-white">MITS Gwalior</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">Status</p>
                <p className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active
                </p>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {socialLinks.map((sl) => (
                <a
                  key={sl.name}
                  href={sl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border text-slate-300 text-xs font-semibold hover:bg-slate-800 transition ${sl.color}`}
                >
                  {sl.icon} {sl.name}
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Profile Image & Badge Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-slate-900 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/5]">
                <img
                  src="/naman_profile.jpg"
                  alt="Naman Lahariya"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white">Naman Lahariya</h3>
                  <p className="text-xs text-blue-400 font-medium">B.Tech Student & Lead Software Developer</p>
                  <p className="text-[10px] text-slate-400 mt-1">Madhav Institute of Technology & Science, Gwalior</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">PORTFOLIO SHOWCASE</span>
              <h2 className="text-3xl font-black text-white italic">Featured Engineering Projects</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <a
                key={proj.title}
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                      {proj.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{proj.title}</h3>
                  <p className="text-xs font-semibold text-slate-400 mb-3">{proj.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{proj.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech.slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                  <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-400 transition" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic">Technical Stack & Core Skills</h3>
              <p className="text-xs text-slate-400">Engineering technologies used across full-stack systems</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((sc) => (
              <div key={sc.category} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider mb-2.5">{sc.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sc.items.map((item) => (
                    <span key={item} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship & Supporting Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Faculty Mentorship Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center gap-5 relative z-10">
              <img
                src={guidanceInfo.photo}
                alt={guidanceInfo.name}
                className="w-20 h-24 rounded-2xl object-cover border-2 border-blue-500/30 shadow-xl shrink-0"
                onError={(e) => { (e.target as any).src = '/mitslogo.jpg'; }}
              />
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  FACULTY ADVISOR & MENTOR
                </span>
                <h3 className="text-xl font-black text-white">{guidanceInfo.name}</h3>
                <p className="text-xs font-semibold text-slate-400">{guidanceInfo.title}</p>
                <p className="text-[10px] text-slate-400">{guidanceInfo.dept}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed pt-4 border-t border-slate-800/60 mt-4">
              "{guidanceInfo.quote}"
            </p>
          </div>

          {/* Supporting Partner Card (Naitik Goyal) */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center gap-5 relative z-10">
              <img
                src={supportingPartner.photo}
                alt={supportingPartner.name}
                className="w-20 h-24 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-xl shrink-0"
                onError={(e) => { (e.target as any).src = '/mitslogo.jpg'; }}
              />
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  SUPPORTING PARTNER
                </span>
                <h3 className="text-xl font-black text-white">{supportingPartner.name}</h3>
                <p className="text-xs font-semibold text-slate-400">{supportingPartner.title}</p>
                <p className="text-[10px] text-slate-400">MITS Gwalior Partner</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed pt-4 border-t border-slate-800/60 mt-4">
              "{supportingPartner.quote}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;
