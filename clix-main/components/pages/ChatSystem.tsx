import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Club, Event, Registration, Message, Role } from '../../types';
import { db } from '../../db';
import { io, Socket } from 'socket.io-client';
import { pushNotificationService } from '../../lib/PushNotificationService';
import { formatTimeShort } from '../../lib/formatDate';
import { encryptMessageText, decryptMessageText } from '../../lib/crypto';
import { notifyChatReceived } from '../../lib/notifications';
import {
  Search,
  Send,
  Image as ImageIcon,
  ArrowLeft,
  MoreVertical,
  Paperclip,
  MessageSquare,
  X,
  ShieldCheck,
  Zap,
  Lock,
  Users,
  Calendar
} from 'lucide-react';

interface Props {
  user: User;
  clubs: Club[];
  events?: Event[];
  registrations?: Registration[];
  allUsers: User[];
  activeContext?: string;
  isDarkMode: boolean;
}

type Channel = {
  type: 'club' | 'dm' | 'event';
  id: string;
  name: string;
  subtitle?: string;
  eventId?: string;
};

const ImagePreviewModal: React.FC<{ imageUrl: string | null; onClose: () => void }> = ({ imageUrl, onClose }) => (
  imageUrl ? (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full rounded-[2rem] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 transition-all"><X size={18} /></button>
        <div className="p-5">
          <img src={imageUrl} alt="Message attachment" className="w-full max-h-[80vh] object-contain rounded-[1.5rem]" />
        </div>
      </div>
    </div>
  ) : null
);

const ChatSystem: React.FC<Props> = ({ user, clubs = [], events = [], registrations = [], allUsers = [], activeContext }) => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    pushNotificationService.requestPermission().catch(() => { });
  }, []);

  // 1. Show Club Group Chats ONLY to Club Members (and Admins/Faculty/Deans)
  // 1. Show Club Group Chats & Universal Campus Channels
  const allowedClubs = useMemo(() => {
    const isGlobalAdmin = user.globalRole === Role.SUPER_ADMIN || (user.globalRole as string) === 'SuperAdmin' || user.globalRole === Role.FACULTY || user.globalRole === Role.DEAN;
    if (isGlobalAdmin || (user.clubMemberships || []).length === 0) return clubs;
    const myClubIds = (user.clubMemberships || []).map(m => m.clubId);
    const joined = clubs.filter(c => myClubIds.includes(c.id));
    const others = clubs.filter(c => !myClubIds.includes(c.id));
    return [...joined, ...others];
  }, [clubs, user]);

  const allowedUsers = useMemo(() => {
    return allUsers.filter(u => u.id !== user.id);
  }, [allUsers, user]);

  // 2. Create Temporary Group Chat for Every Event of Any Club
  const eventChannels = useMemo(() => {
    return (events || []).map(e => {
      const hostClub = clubs.find(c => c.id === e.clubId);
      const attendeeCount = (registrations || []).filter(r => r.eventId === e.id).length;
      return {
        type: 'event' as const,
        id: e.id,
        name: `⚡ Event: ${e.title}`,
        subtitle: `${hostClub?.name || 'MITS Club'} • ${attendeeCount} Attendees`,
        eventId: e.id
      };
    });
  }, [events, registrations, clubs]);

  const channels: Channel[] = useMemo(() => {
    const campusBroadcast: Channel = {
      type: 'club',
      id: 'institutional',
      name: '📢 MITS Campus Announcements & General',
      subtitle: 'Universal Institutional Broadcast Lounge'
    };

    const clubChannels: Channel[] = allowedClubs.map(c => ({
      type: 'club' as const,
      id: c.id,
      name: `🏛️ ${c.name}`,
      subtitle: `${c.category || 'Technical'} Club Channel`,
    }));

    const dmChannels: Channel[] = allowedUsers.map(u => ({
      type: 'dm' as const,
      id: u.id,
      name: `👤 ${u.name}`,
      subtitle: u.globalRole === Role.STUDENT ? (u.enrollmentNumber || u.rollNumber || 'Student') : `${u.globalRole} Coordinator`,
    }));

    return [campusBroadcast, ...clubChannels, ...eventChannels, ...dmChannels].filter(ch =>
      ch.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allowedClubs, eventChannels, allowedUsers, search]);

  useEffect(() => {
    if (activeContext && activeContext !== 'Global') {
      const club = allowedClubs.find(c => c.id === activeContext);
      if (club) {
        setActiveChannel({ type: 'club', id: club.id, name: `🏛️ ${club.name}`, subtitle: club.category });
      }
    } else if (!activeChannel && channels.length > 0) {
      setActiveChannel(channels[0]);
    }
  }, [activeContext, allowedClubs, channels]);

  useEffect(() => {
    const defaultSocketUrl = import.meta.env.PROD ? '' : 'http://localhost:4000';
    const newSocket = io(import.meta.env.VITE_API_BASE?.replace('/api', '') || defaultSocketUrl);
    setSocket(newSocket);
    newSocket.on('connect', () => {
      newSocket.emit('join', {
        userId: user.id,
        clubIds: clubs.map(c => c.id).concat(['institutional'])
      });
    });

    const handleIncomingMessage = (msg: Message) => {
      if (!msg) return;
      if (
        activeChannel &&
        (msg.clubId === activeChannel.id ||
          msg.recipientId === activeChannel.id ||
          msg.senderId === activeChannel.id ||
          (activeChannel.type === 'club' && msg.clubId === activeChannel.id))
      ) {
        setMessages(prev => (prev.find(m => m.id === msg.id) ? prev : [...prev, msg]));
      } else {
        const channelId = msg.clubId || msg.senderId;
        if (channelId) {
          setUnreadCounts(prev => ({ ...prev, [channelId]: (prev[channelId] || 0) + 1 }));
        }
      }
      if (pushNotificationService.isNotificationEnabled() && msg.senderId !== user.id) {
        const plain = decryptMessageText(msg.content, msg.clubId || msg.senderId || '');
        pushNotificationService.notifyMessage(msg.senderName, plain || 'New message');
      }
    };

    newSocket.on('receive_message', handleIncomingMessage);
    newSocket.on('new_message', handleIncomingMessage);

    return () => {
      newSocket.disconnect();
    };
  }, [user.id, activeChannel, clubs]);

  useEffect(() => {
    if (!activeChannel) return;
    db.getMessages(
      activeChannel.type === 'club' || activeChannel.type === 'event' ? activeChannel.id : undefined,
      user.id,
      activeChannel.type === 'dm' ? activeChannel.id : undefined
    ).then((msgs) => {
      if (Array.isArray(msgs)) {
        setMessages(msgs);
      }
    });
    setUnreadCounts(prev => ({ ...prev, [activeChannel.id]: 0 }));
  }, [activeChannel, user.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // 3. End-to-End Encryption (E2EE) Messaging Handler
  const handleSend = async (type: Message['type'] = 'text', rawContent?: string, extra?: Partial<Message>) => {
    const unencryptedText = type === 'text' ? input : rawContent;
    if (!activeChannel || (type === 'text' && !unencryptedText?.trim())) return;

    // Encrypt content with room channel key
    const encryptedContent = encryptMessageText(unencryptedText || '', activeChannel.id);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content: encryptedContent,
      timestamp: new Date().toISOString(),
      type,
      status: 'sent',
      clubId: activeChannel.type === 'club' || activeChannel.type === 'event' ? activeChannel.id : undefined,
      recipientId: activeChannel.type === 'dm' ? activeChannel.id : undefined,
      ...extra,
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setShowAttach(false);
    if (socket) socket.emit('send_message', newMsg);
    await db.sendMessage(newMsg);
    notifyChatReceived(user.name, activeChannel.name, unencryptedText || 'Sent attachment');
  };

  const formatTime = (ts: string) => formatTimeShort(ts);

  /* —— Chat list (Telegram-style with Member Scoping & Event GCs) —— */
  const chatList = (
    <div className={`flex flex-col h-full chat-shell ${activeChannel ? 'hidden md:flex md:w-80 lg:w-96 border-r border-[var(--border-color)]' : 'flex w-full'}`}>
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-500 uppercase tracking-wider">
            <Lock size={12} /> E2EE Active
          </div>
          <span className="text-[9px] font-mono text-[var(--text-secondary)]">{channels.length} Rooms</span>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search channels & event rooms..."
            className="w-full h-11 pl-11 pr-4 uni-pill bg-[var(--primary-soft)] border border-[var(--border-color)] text-[var(--text-main)] text-sm outline-none placeholder:text-[var(--text-secondary)]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {channels.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)] space-y-2">
            <Users size={32} className="mx-auto opacity-30" />
            <p className="font-bold">No Channels Available</p>
            <p>You can view Club GCs only if you are a confirmed member of that club.</p>
          </div>
        ) : (
          channels.map(ch => {
            const unread = unreadCounts[ch.id] || 0;
            const isActive = activeChannel?.id === ch.id;
            return (
              <button
                key={`${ch.type}-${ch.id}`}
                type="button"
                onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${isActive ? 'bg-[var(--chat-list-hover)]' : 'hover:bg-[var(--chat-list-hover)]'
                  }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 ${
                  ch.type === 'event' ? 'bg-amber-500 shadow-md shadow-amber-500/20' : ch.type === 'club' ? 'bg-blue-600 shadow-md shadow-blue-600/20' : 'bg-slate-700'
                }`}>
                  {ch.type === 'event' ? <Zap size={20} /> : ch.type === 'club' ? <Users size={20} /> : ch.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-[var(--text-main)] truncate text-sm">{ch.name}</span>
                    {unread > 0 && (
                      <span className="uni-pill min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold bg-primary text-white">
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                    {ch.subtitle || (ch.type === 'event' ? 'Temp Event GC' : ch.type === 'club' ? 'Members Only' : 'Direct Message')}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  /* —— E2EE Conversation Window —— */
  const conversation = activeChannel ? (
    <div className={`flex flex-col h-full flex-1 chat-shell ${!activeChannel ? 'hidden' : 'flex'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
        <button
          type="button"
          onClick={() => setActiveChannel(null)}
          className="md:hidden p-2 rounded-full hover:bg-[var(--primary-soft)] text-[var(--text-main)]"
        >
          <ArrowLeft size={22} />
        </button>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 ${
          activeChannel.type === 'event' ? 'bg-amber-500' : activeChannel.type === 'club' ? 'bg-blue-600' : 'bg-slate-700'
        }`}>
          {activeChannel.type === 'event' ? <Zap size={18} /> : activeChannel.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[var(--text-main)] truncate text-base">{activeChannel.name}</p>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} /> E2EE
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            {activeChannel.type === 'event' ? '⚡ Temporary Event Room • Auto-Archives After Event' : activeChannel.type === 'club' ? '🏛️ Official Club Group Chat • Members Only' : '🔒 End-to-End Encrypted Direct Message'}
          </p>
        </div>
      </div>

      {/* Temporary Event Room Banner */}
      {activeChannel.type === 'event' && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-xs font-semibold flex items-center gap-2">
          <Zap size={14} /> This is a temporary event group chat. All event attendees & coordinators are connected here.
        </div>
      )}

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar bg-[var(--bg-main)]">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user.id;
          const showName = (activeChannel.type === 'club' || activeChannel.type === 'event') && !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId);
          // Dynamically Decrypt Message Content
          const plainContent = decryptMessageText(msg.content, activeChannel.id);

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {showName && (
                <span className="text-xs font-bold text-[var(--text-secondary)] mb-1 ml-2">{msg.senderName}</span>
              )}
              <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 shadow-sm rounded-3xl ${isMe ? 'chat-bubble-out' : 'chat-bubble-in'}`}>
                {msg.type === 'text' && <p className="text-[15px] leading-relaxed break-words font-sans">{plainContent}</p>}
                {msg.type === 'image' && msg.mediaUrl && (
                  <button type="button" onClick={() => setPreviewImageUrl(msg.mediaUrl)} className="group w-full overflow-hidden rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-primary transition-all">
                    <img src={msg.mediaUrl} alt="Attachment preview" className="w-full max-h-64 object-cover" />
                    <div className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] text-left">Tap to enlarge</div>
                  </button>
                )}
                <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${isMe ? 'text-white/70' : 'text-[var(--text-secondary)]'}`}>
                  <span>{formatTime(msg.timestamp)}</span>
                  <Lock size={10} className="opacity-60" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
        {showAttach && (
          <div className="flex gap-2 px-2 pb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="uni-pill-card px-4 py-2 text-sm text-[var(--text-main)] flex items-center gap-2 hover:bg-[var(--primary-soft)]"
            >
              <ImageIcon size={18} /> Photo
            </button>
          </div>
        )}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend('text');
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setShowAttach(!showAttach)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--primary-soft)]"
          >
            <Paperclip size={20} />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Message ${activeChannel.name} (End-to-End Encrypted)...`}
            className="flex-1 h-12 px-5 uni-pill border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] text-[15px] outline-none placeholder:text-[var(--text-secondary)]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white disabled:opacity-40 uni-btn-primary shadow-lg shadow-blue-500/20"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center chat-shell text-[var(--text-secondary)] p-8 space-y-3">
      <div className="w-20 h-20 rounded-3xl bg-blue-600/10 text-primary flex items-center justify-center border border-primary/20 shadow-xl">
        <Lock size={40} />
      </div>
      <p className="text-xl font-bold text-[var(--text-main)]">End-to-End Encrypted Messenger</p>
      <p className="text-xs max-w-sm text-center text-[var(--text-secondary)] leading-relaxed">
        Select a member-only Club Group Chat, temporary Event room, or Direct Message. All messages are encrypted with AES-256 protocols.
      </p>
    </div>
  );

  return (
    <>
      <ImagePreviewModal imageUrl={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      <div className="flex h-[calc(100dvh-8.5rem)] md:h-[calc(100vh-7.5rem)] overflow-hidden rounded-2xl md:uni-pill-card border border-[var(--border-color)] md:mx-0 -mx-3">
        {chatList}
        {conversation}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => handleSend('image', undefined, { mediaUrl: reader.result as string });
            reader.readAsDataURL(file);
          }}
        />
      </div>
    </>
  );
};

export default ChatSystem;
