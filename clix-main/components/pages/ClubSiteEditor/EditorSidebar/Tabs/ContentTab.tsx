import React from 'react';
import { Sparkles, Loader2, Upload, Plus, Trash2 } from 'lucide-react';
import { Club, CustomSection } from '@/types';

interface ContentTabProps {
  formData: Club;
  setFormData: React.Dispatch<React.SetStateAction<Club>>;
  handleGenerateContent: () => void;
  isGeneratingContent: boolean;
  bannerRef: React.RefObject<HTMLInputElement>;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addSection: () => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, field: 'title' | 'content', val: string) => void;
  sections: CustomSection[];
}

export const ContentTab: React.FC<ContentTabProps> = ({
  formData, setFormData, handleGenerateContent, isGeneratingContent, bannerRef, handleBannerUpload, addSection, removeSection, updateSection, sections
}) => {
  const inputCls = 'w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-primary/60 text-white font-medium text-sm transition-all placeholder:text-white/25';
  const areaCls  = `${inputCls} leading-relaxed resize-none`;

  return (
    <div className="space-y-4">
      <button onClick={handleGenerateContent} disabled={isGeneratingContent}
              className="w-full py-3.5 rounded-2xl text-[var(--text-main)] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--primary), #8B5CF6)' }}>
        {isGeneratingContent ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        Auto-Generate Content Modules
      </button>

      <div className="space-y-1.5">
        <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-main)]/35 ml-1">Hero Tagline</label>
        <input type="text" value={formData.tagline || ''} onChange={e => setFormData({ ...formData, tagline: e.target.value })}
               placeholder="High-impact mission summary..." className={inputCls} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-main)]/35 ml-1">Club Description / Vision</label>
        <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="The definitive purpose of your club..." className={areaCls} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-main)]/35 ml-1">Banner Image URL</label>
          <button onClick={() => bannerRef.current?.click()}
                  className="text-[8px] font-black uppercase text-primary hover:underline flex items-center gap-1">
            <Upload size={10} /> Upload
          </button>
          <input type="file" accept="image/*" className="hidden" ref={bannerRef} onChange={handleBannerUpload} />
        </div>
        <input type="text" value={formData.bannerUrl || ''} onChange={e => setFormData({ ...formData, bannerUrl: e.target.value })}
               placeholder="https://example.com/banner.jpg" className={inputCls} />
        {formData.bannerUrl && (
          <div className="h-20 rounded-xl overflow-hidden border border-[var(--border-color)] mt-1">
            <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-main)]/35 ml-1">Content Modules</label>
          <button onClick={addSection} className="text-[8px] font-black uppercase text-primary hover:underline flex items-center gap-1">
            <Plus size={10} /> Add
          </button>
        </div>
        {sections.map(sec => (
          <div key={sec.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-white/[0.02] space-y-2 group relative">
            <button onClick={() => removeSection(sec.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={12} />
            </button>
            <input type="text" value={sec.title} onChange={e => updateSection(sec.id, 'title', e.target.value)}
                   placeholder="Section title" className={`${inputCls} text-xs h-9 py-2`} />
            <textarea rows={2} value={sec.content} onChange={e => updateSection(sec.id, 'content', e.target.value)}
                      placeholder="Section content..." className={`${areaCls} text-xs`} />
          </div>
        ))}
      </div>
    </div>
  );
};
