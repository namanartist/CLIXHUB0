import { useState, useMemo } from 'react';
import { Club, CustomSection, Event } from '../../../types';
// @ts-ignore
import { smartLogicService } from '../../../logic';

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
};

export const useEditorState = (club: Club, events: Event[], onSave: (c: Club) => void) => {
  const [formData, setFormData] = useState<Club>({ ...club, customSections: club.customSections || [] });
  const [activeTab, setActiveTab] = useState<'themes' | 'content' | 'posts' | 'preview'>('themes');
  const [showSaved, setShowSaved] = useState(false);
  const [aiThemePrompt, setAiThemePrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [aiTheme, setAiTheme] = useState<{ color: string; name: string; desc: string } | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const posts = useMemo(() => (formData.customSections || []).filter(s => s.iconName === '__POST__'), [formData.customSections]);
  const sections = useMemo(() => (formData.customSections || []).filter(s => s.iconName !== '__POST__'), [formData.customSections]);

  const handleSave = () => { onSave(formData); setShowSaved(true); setTimeout(() => setShowSaved(false), 3000); };
  const applyTheme = (color: string) => setFormData(prev => ({ ...prev, themeColor: color }));

  const handleGenerateAITheme = async () => {
    if (!aiThemePrompt.trim()) return;
    setIsGeneratingTheme(true);
    try {
      const p = aiThemePrompt.toLowerCase();
      let h = 210, s = 90, l = 55;
      if (p.includes('tech') || p.includes('code') || p.includes('robot') || p.includes('digital'))   { h = 210; s = 100; l = 55; }
      else if (p.includes('nature') || p.includes('eco') || p.includes('green'))                       { h = 145; s = 75; l = 45; }
      else if (p.includes('fire') || p.includes('energy') || p.includes('sport') || p.includes('power')) { h = 15; s = 95; l = 55; }
      else if (p.includes('art') || p.includes('creative') || p.includes('media') || p.includes('design')) { h = 300; s = 70; l = 55; }
      else if (p.includes('science') || p.includes('research') || p.includes('physics') || p.includes('lab')) { h = 185; s = 80; l = 45; }
      else if (p.includes('culture') || p.includes('music') || p.includes('dance'))                    { h = 330; s = 80; l = 55; }
      else if (p.includes('social') || p.includes('nss') || p.includes('community'))                   { h = 25;  s = 85; l = 55; }
      else { const hash = aiThemePrompt.split('').reduce((a, c) => a + c.charCodeAt(0), 0); h = hash % 360; s = 65 + (hash % 30); l = 44 + (hash % 16); }
      const color = hslToHex(h, s, l);
      const words = aiThemePrompt.split(' ').slice(0, 3).map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
      setAiTheme({ color, name: `${words} Theme`, desc: `System-crafted for: "${aiThemePrompt}"` });
    } finally { setIsGeneratingTheme(false); }
  };

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    try {
      const result = await smartLogicService.generateClubContent(formData.name, formData.category);
      setFormData(prev => ({
        ...prev,
        tagline: result.tagline,
        description: result.mission,
        customSections: [
          ...(prev.customSections || []).filter(s => s.iconName === '__POST__'),
          ...result.sections.map((s: any) => ({ id: `ai-${Date.now()}-${Math.random()}`, title: s.title, content: s.content, iconName: s.iconName }))
        ]
      }));
    } catch { alert('Content Engine is at capacity. Try again shortly.'); }
    finally { setIsGeneratingContent(false); }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, bannerUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const addSection = () => setFormData(prev => ({
    ...prev,
    customSections: [...(prev.customSections || []), { id: `sec-${Date.now()}`, title: 'New Section', content: 'Describe this section...', iconName: 'Layers' }]
  }));

  const removeSection = (id: string) => setFormData(prev => ({ ...prev, customSections: (prev.customSections || []).filter(s => s.id !== id) }));

  const updateSection = (id: string, field: 'title' | 'content', val: string) => setFormData(prev => ({
    ...prev, customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, [field]: val } : s)
  }));

  const addPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const post: CustomSection = { id: `post-${Date.now()}`, title: newPost.title, content: newPost.content, iconName: '__POST__' };
    setFormData(prev => ({ ...prev, customSections: [...(prev.customSections || []), post] }));
    setNewPost({ title: '', content: '' });
    setIsAddingPost(false);
  };

  const removePost = (id: string) => setFormData(prev => ({ ...prev, customSections: (prev.customSections || []).filter(s => s.id !== id) }));

  return {
    formData, setFormData, activeTab, setActiveTab, showSaved, aiThemePrompt, setAiThemePrompt, isGeneratingTheme, aiTheme, isGeneratingContent, isAddingPost, setIsAddingPost, newPost, setNewPost, previewMode, setPreviewMode, posts, sections,
    handleSave, applyTheme, handleGenerateAITheme, handleGenerateContent, handleBannerUpload, addSection, removeSection, updateSection, addPost, removePost
  };
};
