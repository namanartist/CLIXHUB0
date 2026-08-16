import React from 'react';
import { Club, CustomSection, Event } from '../../../../types';

interface PreviewFrameProps {
  formData: Club;
  sections: CustomSection[];
  posts: CustomSection[];
  events: Event[];
  previewMode: 'desktop' | 'mobile';
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  formData, sections, posts, events, previewMode
}) => (
  <div className={`${previewMode === 'mobile' ? 'w-[370px]' : 'w-full max-w-3xl'} rounded-[1.75rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/70 transition-all duration-500`}
       style={{ background: '#0a0f1a' }}>

    {/* Hero */}
    <div className="relative h-48 overflow-hidden">
      {formData.bannerUrl
        ? <img src={formData.bannerUrl} alt="" className="w-full h-full object-cover" />
        : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${formData.themeColor}44 0%, #0a0f1a 100%)` }} />
      }
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,15,26,0.9))' }} />
      <div className="absolute bottom-5 left-6 space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-main)] font-black text-base shadow-xl"
               style={{ background: formData.themeColor }}>
            {formData.name[0]}
          </div>
          <span className="text-[7px] font-black text-[var(--text-main)]/40 uppercase tracking-[0.3em]">MITS Council Org</span>
        </div>
        <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">{formData.name}</h2>
        {formData.tagline && <p className="text-xs text-[var(--text-secondary)] italic">"{formData.tagline}"</p>}
      </div>
    </div>

    {/* Body */}
    <div className="p-7 space-y-7">
      {formData.description && (
        <div>
          <p className="text-[7px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: formData.themeColor }}>Mission</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{formData.description}</p>
        </div>
      )}

      {sections.length > 0 && (
        <div className="grid gap-3">
          {sections.slice(0, 3).map(sec => (
            <div key={sec.id} className="p-4 rounded-xl border border-[var(--border-color)]" style={{ background: 'rgba(255,255,255,0.025)' }}>
              <h4 className="text-xs font-black mb-1" style={{ color: formData.themeColor }}>{sec.title}</h4>
              <p className="text-[10px] text-[var(--text-main)]/40 line-clamp-2">{sec.content}</p>
            </div>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div>
          <p className="text-[7px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: formData.themeColor }}>Latest Posts</p>
          <div className="space-y-2">
            {posts.slice(0, 2).map(post => (
              <div key={post.id} className="p-3.5 rounded-xl border border-[var(--border-color)]" style={{ background: 'rgba(255,255,255,0.025)' }}>
                <p className="text-xs font-black text-[var(--text-main)] mb-0.5">{post.title}</p>
                <p className="text-[10px] text-[var(--text-main)]/40 line-clamp-2">{post.content}</p>
              </div>
            ))}
            {posts.length > 2 && <p className="text-[8px] text-[var(--text-secondary)] opacity-50 text-center">+{posts.length - 2} more posts</p>}
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div>
          <p className="text-[7px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: formData.themeColor }}>Upcoming Events</p>
          <div className="space-y-2">
            {events.slice(0, 2).map(ev => (
              <div key={ev.id} className="p-3.5 rounded-xl border border-[var(--border-color)] flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.025)' }}>
                <div>
                  <p className="text-xs font-black text-[var(--text-main)]">{ev.title}</p>
                  <p className="text-[8px] text-[var(--text-main)]/30">{ev.date}</p>
                </div>
                <span className={`text-[7px] font-black uppercase px-2 py-1 rounded-full border ${ev.type === 'Paid' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>{ev.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-[var(--border-color)] text-center">
        <p className="text-[7px] font-black uppercase tracking-[0.5em] text-[var(--text-main)]/15">© 2026 MITS GWALIOR</p>
      </div>
    </div>
  </div>
);
