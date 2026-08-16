import React, { useState, useEffect, useRef } from 'react';
import { User, Club, Notification } from '../types';
import { Bell, ChevronDown, LogOut, User as UserIcon, ArrowLeft, Sun, Moon, GraduationCap, CheckCircle2, Trash2, ExternalLink, Sparkles, Calendar, Award, Shield, FileText, MessageSquare, CreditCard, X } from 'lucide-react';
import { db } from '../db';
import InstallAppButton from './InstallAppButton';
import { pushNotificationService } from '../lib/PushNotificationService';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleMobileMenu: () => void;
  onGoHome?: () => void;
  onOpenProfile?: () => void;
  onOpenDeveloper?: () => void;
  onToggleTheme?: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'Event': return <Calendar size={15} className="text-emerald-400" />;
    case 'Certificate': return <Award size={15} className="text-purple-400" />;
    case 'Proposal': return <Shield size={15} className="text-amber-400" />;
    case 'Recruitment': return <FileText size={15} className="text-blue-400" />;
    case 'Chat': return <MessageSquare size={15} className="text-sky-400" />;
    case 'Finance': return <CreditCard size={15} className="text-rose-400" />;
    default: return <Sparkles size={15} className="text-primary" />;
  }
};

const Navbar: React.FC<NavbarProps> = ({
  user, clubs, activeContext, onLogout, isDarkMode, onGoHome, onOpenProfile, onOpenDeveloper, onToggleTheme
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const notifs = await db.getNotifications();
      // Filter for this user or global notifications
      const userNotifs = (notifs || []).filter(n => !n.userId || n.userId === user.id || n.userId === user.email);
      setNotifications(userNotifs);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 8000);
    return () => clearInterval(interval);
  }, [user?.id, user?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentClub = clubs.find(c => c.id === activeContext);

  const handleMarkAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    for (const n of notifications) {
      if (!n.read) {
        await db.markNotificationAsRead(n.id);
      }
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) {
      await db.markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    setIsNotifOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleRequestPush = async () => {
    await pushNotificationService.requestPermission();
  };

  return (
    <header className="sticky top-0 z-50 px-3 md:px-6 pt-3 pb-2 pointer-events-none">
      <nav className="uni-header-pill pointer-events-auto h-14 md:h-16 px-4 md:px-6 flex items-center max-w-[1600px] mx-auto">
        <div className="w-full flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">
            {activeContext !== 'Global' ? (
              <button
                type="button"
                onClick={onGoHome}
                className="p-2.5 uni-pill bg-[var(--primary-soft)] text-[var(--text-main)] shrink-0 hover:opacity-80 transition-opacity"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <img
                onClick={onGoHome}
                src="/image.png"
                alt="MITS Logo"
                className="w-10 h-10 rounded-2xl object-cover cursor-pointer shrink-0 shadow-sm border border-[var(--border-color)]"
              />
            )}
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] truncate">MITS Gwalior</p>
              <p className="text-sm font-bold text-[var(--text-main)] truncate">
                {activeContext === 'Global' ? 'University Portal' : (currentClub?.name || 'Club')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <InstallAppButton />

            {onOpenDeveloper && (
              <button
                type="button"
                onClick={onOpenDeveloper}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 uni-pill bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm shadow-emerald-500/5 shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Dev: Naman Lahariya
              </button>
            )}

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="w-10 h-10 uni-pill flex items-center justify-center bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative w-10 h-10 uni-pill flex items-center justify-center transition-all ${
                  isNotifOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-3xl border border-white/15 bg-[#090e1c] p-4 z-[1000] shadow-2xl animate-in zoom-in-95 text-slate-100 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-blue-400" />
                      <span className="font-bold text-sm text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-white/[0.06] max-h-[360px] overflow-y-auto space-y-1">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <Bell size={28} className="mx-auto text-slate-600" />
                        <p className="text-xs text-slate-400 font-medium">All caught up!</p>
                        <p className="text-[10px] text-slate-500">No new alerts or institutional broadcasts.</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 hover:bg-white/5 ${
                            !notif.read ? 'bg-blue-500/[0.06] border border-blue-500/10' : 'opacity-75'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-white truncate">{notif.title}</p>
                              <span className="text-[9px] text-slate-500 font-mono shrink-0">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {!pushNotificationService.isNotificationEnabled() && (
                    <div className="pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={handleRequestPush}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={12} className="text-amber-400" /> Enable Desktop Alerts
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 uni-pill bg-[var(--primary-soft)] border border-[var(--border-color)]"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold uni-btn-primary">
                  {user?.photoUrl ? <img src={user.photoUrl} className="w-full h-full rounded-full object-cover" alt="" /> : (user?.name?.[0] || 'U')}
                </div>
                <ChevronDown size={14} className={`text-[var(--text-secondary)] ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 uni-pill-card p-2 z-[100] animate-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">{user?.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                  </div>
                  <button type="button" onClick={() => { onOpenProfile?.(); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--text-main)]">
                    <UserIcon size={14} /> Profile
                  </button>
                  {onOpenDeveloper && (
                    <button type="button" onClick={() => { onOpenDeveloper(); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--text-main)]">
                      <GraduationCap size={14} /> Dev: Naman Lahariya
                    </button>
                  )}
                  <button type="button" onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm text-rose-600 hover:bg-rose-500/10">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
