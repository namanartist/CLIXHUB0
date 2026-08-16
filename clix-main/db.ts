import { Club, Applicant, Registration, Event, AuditLog, User, Role, ClubRole, Inquiry, SavedEvent, Message, Notification, SessionArchive, TeamMember, Mentor, DevConfig, PollOption, CertificateBatch, IssuedCertificate, Activity, Proposal, Venue } from './types';
import { DEMO_USERS, DEMO_CLUBS, DEMO_EVENTS, DEMO_VENUES, DEMO_REGISTRATIONS, DEMO_APPLICANTS, DEMO_LOGS, DEMO_BATCHES, DEMO_PROPOSALS } from './constants';
import { storage } from './lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestoreGetAll, firestoreGetOne, firestoreSave, firestoreDelete, firestoreQueryWhere } from './lib/firestoreDb';

const defaultApiBase = import.meta.env.PROD ? '' : 'http://localhost:4000';
const API_BASE = `${import.meta.env.VITE_API_BASE || defaultApiBase}/api`;

class InstitutionalAPI {
    private hasInitialized = false;

    async initialize(): Promise<void> {
        if (this.hasInitialized) return;
        try {
            const res = await fetch(`${API_BASE}/health`);
            const status = await res.json();
            console.log('Backend connection status:', status);

            // Auto-sync seed data if server tables are unpopulated
            const existingClubs = await fetch(`${API_BASE}/clubs`).then(r => r.json()).catch(() => []);
            if (!Array.isArray(existingClubs) || existingClubs.length === 0) {
                await fetch(`${API_BASE}/db/seed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        users: DEMO_USERS,
                        clubs: DEMO_CLUBS,
                        events: DEMO_EVENTS,
                        venues: DEMO_VENUES,
                        proposals: DEMO_PROPOSALS,
                        batches: DEMO_BATCHES,
                        registrations: DEMO_REGISTRATIONS,
                        applicants: DEMO_APPLICANTS,
                        logs: DEMO_LOGS
                    })
                }).catch(() => {});
            }
        } catch (e) {
            console.log('Using Firebase Firestore cloud fabric.');
        }
        this.hasInitialized = true;
    }


    // ─── PROPOSALS ─────────────────────────────────────────────────────────
    async getProposals(): Promise<Proposal[]> {
        try {
            const serverProposals = await this.request('/proposals');
            if (Array.isArray(serverProposals) && serverProposals.length > 0) {
                localStorage.setItem('ccms_offline_proposals', JSON.stringify(serverProposals));
                return serverProposals;
            }
        } catch (e) {}

        const firestoreProposals = await firestoreGetAll<Proposal>('proposals');
        if (firestoreProposals.length > 0) {
            localStorage.setItem('ccms_offline_proposals', JSON.stringify(firestoreProposals));
            return firestoreProposals;
        }

        return this.offlineFallbackGet('ccms_offline_proposals', DEMO_PROPOSALS);
    }

    async saveProposal(proposal: Proposal): Promise<Proposal> {
        // Save to Firestore and local storage
        firestoreSave('proposals', proposal).catch(() => {});
        
        let offlineList: Proposal[] = [];
        try {
            const listStr = localStorage.getItem('ccms_offline_proposals');
            if (listStr) {
                const parsed = JSON.parse(listStr);
                if (Array.isArray(parsed)) offlineList = parsed;
            }
        } catch { }

        const idx = offlineList.findIndex(p => p && p.id === proposal.id);
        if (idx >= 0) offlineList[idx] = proposal;
        else offlineList.push(proposal);
        localStorage.setItem('ccms_offline_proposals', JSON.stringify(offlineList));

        try {
            return await this.request(`/proposals/${proposal.id}`, {
                method: 'PUT',
                body: JSON.stringify(proposal)
            });
        } catch (e) {
            return proposal;
        }
    }

    // --- Auth Helpers (kept for compatibility) ---
    setToken(token: string) { localStorage.setItem('ccms_auth_token', token); }
    clearToken() { localStorage.removeItem('ccms_auth_token'); }

    // --- Chat Polls ---
    async votePoll(_messageId: string, _optionId: string, _userId: string): Promise<void> { }

    private async request(path: string, options?: RequestInit) {
        const token = localStorage.getItem('ccms_auth_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options?.headers
        };

        try {
            const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
            if (res.ok) {
                return await res.json();
            }
            if (res.status !== 401 && res.status !== 404) {
                const err = await res.json().catch(() => ({ error: res.statusText }));
                console.warn(`API Error (${path}):`, err);
            }
        } catch (netErr) {
            // Direct Browser Firebase Firestore Cloud Fallback
            try {
                const cleanPath = path.replace(/^\//, '').split('?')[0];
                const parts = cleanPath.split('/');
                const collectionName = parts[0];
                const id = parts[1];
                const method = options?.method?.toUpperCase() || 'GET';

                if (collectionName && ['users', 'clubs', 'events', 'venues', 'registrations', 'certificates', 'batches', 'applicants', 'proposals', 'activities', 'logs', 'messages', 'notifications'].includes(collectionName)) {
                    if (method === 'GET') {
                        if (id) {
                            const item = await firestoreGetOne(collectionName, id);
                            if (item) return item;
                        } else {
                            const list = await firestoreGetAll(collectionName);
                            if (Array.isArray(list) && list.length > 0) return list;
                        }
                    } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                        const body = options?.body ? JSON.parse(options.body as string) : {};
                        const saved = await firestoreSave(collectionName, body);
                        return saved;
                    } else if (method === 'DELETE' && id) {
                        await firestoreDelete(collectionName, id);
                        return { success: true, id };
                    }
                }
            } catch (firestoreErr) {
                console.warn(`Firestore direct fallback error (${path}):`, firestoreErr);
            }
        }

        throw new Error('Request failed and fallback exhausted');
    }


    private withDemoFallback<T>(data: T[], fallback: T[] = []): T[] {
        return (Array.isArray(data) && data.length > 0) ? data : fallback;
    }

    private offlineFallbackGet<T>(key: string, demoFallback: T[] = []): T[] {
        try {
            const offlineStr = localStorage.getItem(key);
            if (offlineStr) {
                const parsed = JSON.parse(offlineStr);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        if (Array.isArray(demoFallback) && demoFallback.length > 0) {
            try {
                localStorage.setItem(key, JSON.stringify(demoFallback));
            } catch {}
            return demoFallback;
        }
        return [];
    }

    private offlineFallbackSave<T extends {id?: string}>(key: string, item: T): T {
        let offlineList: T[] = [];
        try {
            const listStr = localStorage.getItem(key);
            if (listStr) {
                const parsed = JSON.parse(listStr);
                if (Array.isArray(parsed)) offlineList = parsed;
            }
        } catch {}

        if (!item.id) {
            item.id = `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        }

        const idx = offlineList.findIndex(x => x.id === item.id);
        if (idx >= 0) offlineList[idx] = item;
        else offlineList.push(item);
        
        localStorage.setItem(key, JSON.stringify(offlineList));
        return item;
    }
    
    private offlineFallbackDelete(key: string, id: string) {
        try {
            const listStr = localStorage.getItem(key);
            if (listStr) {
                const parsed = JSON.parse(listStr);
                if (Array.isArray(parsed)) {
                    const filtered = parsed.filter(x => x.id !== id);
                    localStorage.setItem(key, JSON.stringify(filtered));
                }
            }
        } catch {}
    }

    // ─── USERS ─────────────────────────────────────────────────────────────
    async getUsers(): Promise<User[]> {
        try {
            const users = await this.request('/users');
            if (Array.isArray(users) && users.length > 0) {
                try { localStorage.setItem('ccms_offline_users', JSON.stringify(users)); } catch {}
                return users;
            }
            return this.offlineFallbackGet('ccms_offline_users', DEMO_USERS);
        } catch (e) {
            return this.offlineFallbackGet('ccms_offline_users', DEMO_USERS);
        }
    }

    async getUser(id: string): Promise<User | null> {
        try {
            return await this.request(`/users/${id}`);
        } catch (e) { 
            const users = this.offlineFallbackGet('ccms_offline_users', DEMO_USERS);
            return users.find((u: any) => u.id === id) || null;
        }
    }

    async getMe(): Promise<User | null> {
        try {
            return await this.request('/auth/me');
        } catch (e) { return null; }
    }

    async demoLogin(email: string): Promise<{ token: string, user: User }> {
        const demoUser = DEMO_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (demoUser) {
            const data = { token: `demo:${demoUser.id}`, user: demoUser };
            this.setToken(data.token);
            return data;
        }
        const data = await this.request('/auth/demo-login', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        this.setToken(data.token);
        return data;
    }


    async seedDatabase(data: any) {
        return await this.request('/db/seed', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async saveUser(user: User): Promise<User> {
        this.offlineFallbackSave('ccms_offline_users', user);
        try {
            return await this.request(`/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify(user)
            });
        } catch (e) {
            return user;
        }
    }

    async deleteUser(id: string) {
        this.offlineFallbackDelete('ccms_offline_users', id);
        try {
            await this.request(`/users/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    // ─── CLUBS ─────────────────────────────────────────────────────────────
    async getClubs(): Promise<Club[]> {
        try {
            const clubs = await this.request('/clubs');
            if (Array.isArray(clubs) && clubs.length > 0) {
                try { localStorage.setItem('ccms_offline_clubs', JSON.stringify(clubs)); } catch {}
                return clubs;
            }
            return this.offlineFallbackGet('ccms_offline_clubs', DEMO_CLUBS);
        } catch (e) { return this.offlineFallbackGet('ccms_offline_clubs', DEMO_CLUBS); }
    }

    async addClub(c: Club) {
        const saved = this.offlineFallbackSave('ccms_offline_clubs', c);
        try {
            return await this.request('/clubs', {
                method: 'POST',
                body: JSON.stringify(c)
            });
        } catch (e) { return saved; }
    }

    async updateClub(c: Club) {
        this.offlineFallbackSave('ccms_offline_clubs', c);
        try {
            await this.request(`/clubs/${c.id}`, {
                method: 'PATCH',
                body: JSON.stringify(c)
            });
        } catch (e) {}
    }

    async appointPresident(cId: string, sId: string) {
        try {
            const allUsers = await this.getUsers();
            const user = allUsers.find(u => u.id === sId) || await this.getUser(sId);
            if (!user) return;
            const memberships = user.clubMemberships || [];
            const existing = memberships.findIndex(m => m.clubId === cId);
            if (existing >= 0) memberships[existing].role = ClubRole.PRESIDENT;
            else memberships.push({ clubId: cId, role: ClubRole.PRESIDENT });
            await this.saveUser({ ...user, clubMemberships: memberships });

            const clubs = await this.getClubs();
            const club = clubs.find(c => c.id === cId);
            if (club) {
                const updatedLeadership = {
                    ...(club.leadership || {}),
                    presidentId: user.id,
                    President: user.name
                };
                await this.updateClub({ ...club, leadership: updatedLeadership });
            }
        } catch (e) { console.error('appointPresident:', e); }
    }

    async assignFaculty(cId: string, faculty: User) {
        try {
            const clubs = await this.getClubs();
            const club = clubs.find(c => c.id === cId);
            if (club) {
                await this.updateClub({
                    ...club,
                    facultyCoordinatorId: faculty.id,
                    facultyCoordinatorNames: [faculty.name]
                });
            }
        } catch (e) { console.error('assignFaculty:', e); }
    }

    // ─── VENUES ─────────────────────────────────────────────────────────────
    async getVenues(): Promise<Venue[]> {
        try {
            return this.withDemoFallback(await this.request('/venues'), DEMO_VENUES);
        } catch (e) {
            try {
                const offlineStr = localStorage.getItem('ccms_offline_venues');
                if (offlineStr) {
                    const parsed = JSON.parse(offlineStr);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch { }
            return DEMO_VENUES;
        }
    }

    async saveVenue(venue: Venue) {
        let offlineList: Venue[] = [];
        try {
            const listStr = localStorage.getItem('ccms_offline_venues');
            if (listStr) {
                const parsed = JSON.parse(listStr);
                if (Array.isArray(parsed)) offlineList = parsed;
            }
        } catch { }

        const idx = offlineList.findIndex(v => v.id === venue.id);
        if (idx >= 0) offlineList[idx] = venue;
        else offlineList.push(venue);
        localStorage.setItem('ccms_offline_venues', JSON.stringify(offlineList));

        const method = venue.id ? 'PATCH' : 'POST';
        const path = venue.id ? `/venues/${venue.id}` : '/venues';
        try {
            return await this.request(path, {
                method,
                body: JSON.stringify(venue)
            });
        } catch (e) {
            console.warn('Failed to save venue to server, saved locally in browser:', e);
            return venue;
        }
    }

    async deleteVenue(id: string) {
        await this.request(`/venues/${id}`, { method: 'DELETE' });
    }

    // ─── EVENTS ─────────────────────────────────────────────────────────────
    async getEvents(): Promise<Event[]> {
        try {
            const events = await this.request('/events');
            if (Array.isArray(events) && events.length > 0) {
                try { localStorage.setItem('ccms_offline_events', JSON.stringify(events)); } catch (e) {}
                return events;
            }
        } catch (e) {}
        return this.offlineFallbackGet('ccms_offline_events', DEMO_EVENTS);
    }

    async saveEvent(event: Event) {
        const saved = this.offlineFallbackSave('ccms_offline_events', event);
        const method = event.id ? 'PATCH' : 'POST';
        const path = event.id ? `/events/${event.id}` : '/events';
        try {
            const res = await this.request(path, {
                method: method,
                body: JSON.stringify(event)
            });
            if (res && res.id) {
                this.offlineFallbackSave('ccms_offline_events', res);
                return res;
            }
        } catch (e) {
            console.warn('Backend event save fallback to local:', e);
        }
        return saved;
    }

    async deleteEvent(id: string) {
        this.offlineFallbackDelete('ccms_offline_events', id);
        try {
            await this.request(`/events/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    // ─── REGISTRATIONS ──────────────────────────────────────────────────────
    async getRegistrations(): Promise<Registration[]> {
        try {
            const regs = await this.request('/registrations');
            if (regs && regs.length > 0) return regs;
            return this.offlineFallbackGet('ccms_offline_registrations', DEMO_REGISTRATIONS);
        } catch (e) { return this.offlineFallbackGet('ccms_offline_registrations', DEMO_REGISTRATIONS); }
    }

    async saveRegistration(reg: Registration) {
        const saved = this.offlineFallbackSave('ccms_offline_registrations', reg);
        const method = reg.id ? 'PATCH' : 'POST';
        const path = reg.id ? `/registrations/${reg.id}` : '/registrations';
        try {
            await this.request(path, {
                method: method,
                body: JSON.stringify(reg)
            });
        } catch (e) {}
    }

    // ─── APPLICANTS ─────────────────────────────────────────────────────────
    async getApplicants(): Promise<Applicant[]> {
        try {
            const apps = await this.request('/applicants');
            if (apps && apps.length > 0) return apps;
            return this.offlineFallbackGet('ccms_offline_applicants', DEMO_APPLICANTS);
        } catch (e) { return this.offlineFallbackGet('ccms_offline_applicants', DEMO_APPLICANTS); }
    }

    async saveApplicant(a: Applicant) {
        this.offlineFallbackSave('ccms_offline_applicants', a);
        const method = a.id ? 'PATCH' : 'POST';
        const path = a.id ? `/applicants/${a.id}` : '/applicants';
        try {
            await this.request(path, {
                method: method,
                body: JSON.stringify(a)
            });
        } catch (e) {}
    }

    async deleteApplicant(id: string) {
        this.offlineFallbackDelete('ccms_offline_applicants', id);
        try {
            await this.request(`/applicants/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    // ─── LOGS ───────────────────────────────────────────────────────────────
    async getLogs(): Promise<AuditLog[]> {
        try {
            const logs = await this.request('/logs');
            if (logs && logs.length > 0) return logs;
            return this.offlineFallbackGet('ccms_offline_logs', DEMO_LOGS);
        } catch (e) { return this.offlineFallbackGet('ccms_offline_logs', DEMO_LOGS); }
    }

    async addLog(log: AuditLog) {
        this.offlineFallbackSave('ccms_offline_logs', log);
        try {
            await this.request('/logs', {
                method: 'POST',
                body: JSON.stringify(log)
            });
        } catch (e) {}
    }

    // ─── CERTIFICATE BATCHES ───────────────────────────────────────────────
    async getBatches(): Promise<CertificateBatch[]> {
        try {
            const batches = await this.request('/batches');
            if (batches && batches.length > 0) return batches;
            return this.offlineFallbackGet('ccms_offline_batches', DEMO_BATCHES);
        } catch (e) { return this.offlineFallbackGet('ccms_offline_batches', DEMO_BATCHES); }
    }

    async saveBatch(batch: CertificateBatch) {
        const saved = this.offlineFallbackSave('ccms_offline_batches', batch);
        const method = batch.id ? 'PATCH' : 'POST';
        const path = batch.id ? `/batches/${batch.id}` : '/batches';
        try {
            return await this.request(path, {
                method: method,
                body: JSON.stringify(batch)
            });
        } catch (e) { return saved; }
    }

    async deleteBatch(id: string) {
        this.offlineFallbackDelete('ccms_offline_batches', id);
        try {
            await this.request(`/batches/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    // ─── ACTIVITIES ──────────────────────────────────────────────────────────
    async getActivities(): Promise<Activity[]> {
        try {
            const activities = await this.request('/activities');
            if (activities && activities.length > 0) return activities;
            return this.offlineFallbackGet('ccms_offline_activities', []);
        } catch (e) { return this.offlineFallbackGet('ccms_offline_activities', []); }
    }

    async saveActivity(activity: Activity) {
        const saved = this.offlineFallbackSave('ccms_offline_activities', activity);
        const method = activity.id ? 'PATCH' : 'POST';
        const path = activity.id ? `/activities/${activity.id}` : '/activities';
        try {
            return await this.request(path, {
                method: method,
                body: JSON.stringify(activity)
            });
        } catch (e) { return saved; }
    }

    async deleteActivity(id: string) {
        this.offlineFallbackDelete('ccms_offline_activities', id);
        try {
            await this.request(`/activities/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    // ─── CLUB MEMBER MANAGEMENT ────────────────────────────────────────────────
    async getAvailableMembers(clubId: string): Promise<User[]> {
        try {
            return await this.request(`/clubs/${clubId}/available-members`);
        } catch (e) {
            console.error('getAvailableMembers:', e);
            return [];
        }
    }

    async addClubMember(clubId: string, userId: string, role: ClubRole = ClubRole.MEMBER) {
        try {
            return await this.request(`/clubs/${clubId}/members`, {
                method: 'POST',
                body: JSON.stringify({ userId, role })
            });
        } catch (e) {
            console.error('addClubMember:', e);
            throw e;
        }
    }

    async removeClubMember(clubId: string, userId: string) {
        try {
            return await this.request(`/clubs/${clubId}/members/${userId}`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error('removeClubMember:', e);
            throw e;
        }
    }

    // ─── MANUAL TICKET GENERATION ──────────────────────────────────────────────
    async getTicketCandidates(eventId: string): Promise<User[]> {
        try {
            return await this.request(`/events/${eventId}/ticket-candidates`);
        } catch (e) {
            console.error('getTicketCandidates:', e);
            return [];
        }
    }

    async generateManualTicket(eventId: string, studentId: string, studentName: string, studentRoll: string) {
        try {
            return await this.request(`/events/${eventId}/generate-ticket`, {
                method: 'POST',
                body: JSON.stringify({ studentId, studentName, studentRoll })
            });
        } catch (e) {
            console.error('generateManualTicket:', e);
            throw e;
        }
    }

    // ─── REAL-TIME MESSAGES ────────────────────────────────────────────────────
    async sendMessage(message: Message) {
        try {
            return await this.request('/messages', {
                method: 'POST',
                body: JSON.stringify(message)
            });
        } catch (e) {
            console.error('sendMessage:', e);
            throw e;
        }
    }

    async getMessages(clubId?: string, userId?: string, otherUserId?: string): Promise<Message[]> {
        try {
            const params = new URLSearchParams();
            if (clubId) params.append('clubId', clubId);
            if (userId) params.append('userId', userId);
            if (otherUserId) params.append('otherUserId', otherUserId);
            return await this.request(`/messages?${params.toString()}`);
        } catch (e) {
            console.error('getMessages:', e);
            return [];
        }
    }

    async markMessageAsRead(messageId: string) {
        try {
            return await this.request(`/messages/${messageId}/read`, {
                method: 'PATCH'
            });
        } catch (e) {
            console.error('markMessageAsRead:', e);
            throw e;
        }
    }

    // ─── Utilities ───────────────────────────────────────────────────────────
    generateRandomPassword() { return Math.random().toString(36).slice(-8).toUpperCase(); }

    // ─── NOTIFICATIONS & AUXILIARIES (Fully Synced to DB & Local Mirror) ───────────────────
    async getNotifications(userId?: string): Promise<Notification[]> {
        try {
            const path = userId ? `/notifications?userId=${userId}` : '/notifications';
            const serverNotifs = await this.request(path);
            if (Array.isArray(serverNotifs) && serverNotifs.length > 0) {
                return serverNotifs;
            }
        } catch (e) {}

        // Fallback to local storage mirror
        try {
            const local = localStorage.getItem('clix_notifications');
            if (local) {
                const parsed: Notification[] = JSON.parse(local);
                if (userId) {
                    return parsed.filter(n => !n.userId || n.userId === userId);
                }
                return parsed;
            }
        } catch (e) {}
        return [];
    }

    async sendNotification(n: Notification): Promise<void> {
        // Save to local storage mirror immediately
        try {
            const local = localStorage.getItem('clix_notifications');
            const parsed: Notification[] = local ? JSON.parse(local) : [];
            const updated = [n, ...parsed.filter(x => x.id !== n.id)].slice(0, 50);
            localStorage.setItem('clix_notifications', JSON.stringify(updated));
        } catch (e) {}

        try {
            await this.request('/notifications', {
                method: 'POST',
                body: JSON.stringify(n)
            });
        } catch (e) {}
    }

    async markNotificationAsRead(id: string): Promise<void> {
        try {
            const local = localStorage.getItem('clix_notifications');
            if (local) {
                const parsed: Notification[] = JSON.parse(local);
                const updated = parsed.map(n => n.id === id ? { ...n, read: true } : n);
                localStorage.setItem('clix_notifications', JSON.stringify(updated));
            }
        } catch (e) {}

        try {
            await this.request(`/notifications/${id}/read`, { method: 'POST' });
        } catch (e) {}
    }

    async clearNotifications(userId?: string): Promise<void> {
        try {
            if (!userId) {
                localStorage.removeItem('clix_notifications');
            } else {
                const local = localStorage.getItem('clix_notifications');
                if (local) {
                    const parsed: Notification[] = JSON.parse(local);
                    const updated = parsed.filter(n => n.userId && n.userId !== userId);
                    localStorage.setItem('clix_notifications', JSON.stringify(updated));
                }
            }
        } catch (e) {}
    }

    async getDevelopers(): Promise<TeamMember[]> {
        try {
            return await this.request('/developers');
        } catch (e) { return []; }
    }

    async saveDeveloper(d: TeamMember): Promise<void> {
        try {
            await this.request('/developers', {
                method: 'POST',
                body: JSON.stringify(d)
            });
        } catch (e) {}
    }

    async deleteDeveloper(id: string): Promise<void> {
        try {
            await this.request(`/developers/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    async getMentors(): Promise<Mentor[]> {
        try {
            return await this.request('/mentors');
        } catch (e) { return []; }
    }

    async saveMentor(m: Mentor): Promise<void> {
        try {
            await this.request('/mentors', {
                method: 'POST',
                body: JSON.stringify(m)
            });
        } catch (e) {}
    }

    async deleteMentor(id: string): Promise<void> {
        try {
            await this.request(`/mentors/${id}`, { method: 'DELETE' });
        } catch (e) {}
    }

    async getSavedEvents(userId: string): Promise<string[]> {
        try {
            return await this.request(`/saved-events/${userId}`);
        } catch (e) { return []; }
    }

    async toggleSavedEvent(userId: string, eventId: string): Promise<void> {
        try {
            await this.request('/saved-events/toggle', {
                method: 'POST',
                body: JSON.stringify({ userId, eventId })
            });
        } catch (e) {}
    }

    async getDevConfig(): Promise<DevConfig | null> {
        try {
            return await this.request('/dev-config');
        } catch (e) { return null; }
    }

    async saveDevConfig(d: DevConfig): Promise<void> {
        try {
            await this.request('/dev-config', {
                method: 'POST',
                body: JSON.stringify(d)
            });
        } catch (e) {}
    }

    // ─── FIREBASE STORAGE (kept for file uploads) ────────────────────────────
    async uploadAsset(file: File, path: string): Promise<string> {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    }
}

export const db = new InstitutionalAPI();
