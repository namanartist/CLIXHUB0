import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Club, CustomSection } from '../../../../types';

interface PreviewTabProps {
  formData: Club;
  sections: CustomSection[];
  posts: CustomSection[];
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
  formData, sections, posts, previewMode, setPreviewMode
}) => (
  <div className="space-y-4">
    <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-white/[0.02] space-y-3">
      <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-main)]/30">Current Config</p>
      {[
        ['Theme Color', <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-md inline-block" style={{ background: formData.themeColor }} /><code className="text-[10px]">{formData.themeColor}</code></span>],
        ['Tagline', formData.tagline || '—'],
        ['Content Sections', sections.length],
        ['Published Posts', posts.length],
        ['Banner', formData.bannerUrl ? <span className="text-emerald-400">Configured</span> : <span className="text-[var(--text-main)]/25">Default</span>],
      ].map(([k, v]) => (
        <div key={String(k)} className="flex items-center justify-between text-xs gap-3">
          <span className="text-[var(--text-main)]/40 shrink-0">{k}</span>
          <span className="text-[var(--text-main)]/70 text-right">{v as any}</span>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      {(['desktop', 'mobile'] as const).map(m => (
        <button key={m} onClick={() => setPreviewMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${previewMode === m ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
          {m === 'desktop' ? <Monitor size={13} /> : <Smartphone size={13} />} {m}
        </button>
      ))}
    </div>
    <p className="text-[8px] text-[var(--text-secondary)] opacity-50 text-center">Live preview always visible on the right →</p>
  </div>
);
