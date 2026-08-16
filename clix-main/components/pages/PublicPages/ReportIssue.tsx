import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Send } from 'lucide-react';
import { PublicLayout } from './PublicLayout';
// @ts-ignore
import { db } from '../../../db';

export const ReportIssue: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'bug' | 'security' | 'feedback'>('bug');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'Anonymous Reporter',
      action: `[${category.toUpperCase()}] ${desc}`,
      clubId: 'System'
    });
    setSubmitted(true);
    setTimeout(() => onBack(), 3000);
  };

  if (submitted) {
    return (
      <PublicLayout title="Report Received" onBack={onBack} icon={<CheckCircle2 size={32} className="text-emerald-400" />}>
        <div className="text-center space-y-8 uni-pill-card/50 border border-emerald-400/30 rounded-[2.5rem] p-16 shadow-2xl shadow-emerald-500/10 backdrop-blur-md">
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed">Thank you for helping improve Clix Hub. Your report has been logged and will be reviewed by our technical team within 24 hours.</p>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-widest">Redirecting to home...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title="Report an Issue" subtitle="Help us improve Clix Hub by reporting bugs, security concerns, and feature requests." icon={<AlertTriangle size={32} className="text-amber-400" />} onBack={onBack}>
      <div className="uni-pill-card/50 border border-amber-400/20 rounded-[2.5rem] p-10 md:p-16 shadow-2xl backdrop-blur-md max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-amber-400 ml-2">Report Category</label>
            <div className="grid grid-cols-3 gap-4">
              {(['bug', 'security', 'feedback'] as const).map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`py-4 px-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${category === cat ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'}`}>
                  {cat === 'bug' && '🐛 Bug'}
                  {cat === 'security' && '🔒 Security'}
                  {cat === 'feedback' && '💡 Feature'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-amber-400 ml-2">Detailed Description</label>
            <textarea required rows={8} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Provide as much detail as possible to help us understand and fix the issue..."
              className="w-full bg-[#0B1437] border border-amber-400/20 rounded-3xl p-6 text-[var(--text-main)] outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all font-medium placeholder:text-slate-600 resize-none" />
          </div>
          <button type="submit" disabled={!desc.trim()}
            className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-[var(--text-main)] rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-amber-600/30 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={18} /> Submit Report
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};
