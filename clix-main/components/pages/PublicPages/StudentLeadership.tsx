import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { PublicLayout } from './PublicLayout';
import { Club, User, ClubRole } from '../../../types';

export const StudentLeadership: React.FC<{ clubs: Club[]; users: User[]; onBack: () => void }> = ({ clubs, users, onBack }) => {
  const leaders = clubs.map(club => {
    const president = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
    const vicePresident = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.VICE_PRESIDENT));
    const treasurer = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === 'Treasurer'));
    return { club, president, vicePresident, treasurer };
  }).filter(item => item.president);

  return (
    <PublicLayout title="Campus leadership" subtitle="Student leaders across MITS clubs" icon={<Users size={28} className="text-primary" />} onBack={onBack}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { val: leaders.length, label: 'Club presidents' },
            { val: clubs.length, label: 'Active clubs' },
            { val: users.length, label: 'Registered users' },
          ].map(s => (
            <div key={s.label} className="uni-glass rounded-2xl p-8 text-center space-y-2">
              <div className="text-4xl font-black text-[var(--text-main)]">{s.val}</div>
              <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[var(--text-main)]">Club presidents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map(({ club, president, vicePresident, treasurer }) => (
              <div key={club.id} className="uni-glass uni-glass-hover rounded-2xl overflow-hidden">
                <div className="h-24 bg-[var(--primary-soft)]" style={{ borderBottom: '1px solid var(--border-color)' }} />
                <div className="p-6 -mt-10 relative">
                  <div className="w-20 h-20 rounded-2xl uni-glass border border-[var(--glass-morphism-border)] overflow-hidden mb-4">
                    {president?.photoUrl ? (
                      <img src={president.photoUrl} className="w-full h-full object-cover" alt={president.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-primary">{president?.name[0]}</div>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-[var(--text-main)]">{president?.name}</h3>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">President</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{club.name}</p>
                  {(vicePresident || treasurer) && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-color)] space-y-2 text-sm text-[var(--text-secondary)]">
                      {vicePresident && <p>VP: {vicePresident.name}</p>}
                      {treasurer && <p>Treasurer: {treasurer.name}</p>}
                    </div>
                  )}
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 uni-glass rounded-xl text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-primary" /> Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
