import React from 'react';
import { Plus, Globe2, Trash2 } from 'lucide-react';
import { Club, CustomSection } from '../../../../types';

interface PostsTabProps {
  formData: Club;
  posts: CustomSection[];
  isAddingPost: boolean;
  setIsAddingPost: (val: boolean) => void;
  newPost: { title: string; content: string };
  setNewPost: React.Dispatch<React.SetStateAction<{ title: string; content: string }>>;
  addPost: () => void;
  removePost: (id: string) => void;
}

export const PostsTab: React.FC<PostsTabProps> = ({
  formData, posts, isAddingPost, setIsAddingPost, newPost, setNewPost, addPost, removePost
}) => {
  const inputCls = 'w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-primary/60 text-white font-medium text-sm transition-all placeholder:text-white/25';
  const areaCls  = `${inputCls} leading-relaxed resize-none`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[var(--text-main)]">Club Posts</p>
          <p className="text-[9px] text-[var(--text-main)]/35">Public announcements &amp; updates</p>
        </div>
        <button onClick={() => setIsAddingPost(true)}
                className="px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-1.5">
          <Plus size={12} /> New Post
        </button>
      </div>

      {isAddingPost && (
        <div className="p-4 rounded-2xl border border-primary/25 space-y-3" style={{ background: 'rgba(0,85,255,0.05)' }}>
          <p className="text-[8px] font-black uppercase tracking-widest text-primary">New Post</p>
          <input type="text" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                 placeholder="Post title..." className={inputCls} />
          <textarea rows={4} value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    placeholder="Write your announcement or update..." className={areaCls} />
          <div className="flex gap-2">
            <button onClick={addPost} disabled={!newPost.title.trim() || !newPost.content.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-[1.01] transition-all disabled:opacity-40">
              Publish
            </button>
            <button onClick={() => { setIsAddingPost(false); setNewPost({ title: '', content: '' }); }}
                    className="px-4 py-2.5 rounded-xl bg-[var(--primary-soft)] text-[var(--text-main)]/50 text-[9px] font-black uppercase hover:bg-[var(--primary-soft)] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 && !isAddingPost && (
        <div className="py-14 text-center space-y-2.5 opacity-25">
          <Globe2 size={36} className="mx-auto text-[var(--text-main)]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-main)]">No posts yet</p>
        </div>
      )}

      {posts.map((post, i) => (
        <div key={post.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-white/[0.02] group space-y-1.5 hover:border-[var(--border-color)] transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[7px] font-black uppercase tracking-widest mb-0.5" style={{ color: formData.themeColor }}>Post #{i + 1}</p>
              <h4 className="text-sm font-black text-[var(--text-main)] tracking-tight truncate">{post.title}</h4>
            </div>
            <button onClick={() => removePost(post.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-main)]/40 leading-relaxed line-clamp-2">{post.content}</p>
        </div>
      ))}
    </div>
  );
};
