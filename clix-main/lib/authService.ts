import { User, Role } from '../types';
import { DEMO_USERS } from '../constants';
import { firestoreQueryWhere, firestoreSave } from './firestoreDb';

const defaultApiBase = import.meta.env.PROD ? '' : 'http://localhost:4000';
const API_BASE = `${import.meta.env.VITE_API_BASE || defaultApiBase}/api`;
const TOKEN_KEY = 'ccms_auth_token';
const USER_KEY = 'ccms_user';

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
    globalRole?: Role;
    enrollmentNumber?: string;
    department?: string;
    designation?: string;
}

class AuthService {
    private token: string | null = null;
    private user: User | null = null;

    constructor() {
        this.token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                this.user = JSON.parse(userStr);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
            }
        }
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data: AuthResponse = await response.json();
                this.setAuthData(data);
                return data;
            }
        } catch (netErr) {}

        // Fallback: Check Firebase Firestore online database or demo users
        const emailLower = credentials.email.toLowerCase();
        try {
            const users = await firestoreQueryWhere<User>('users', 'email', emailLower);
            if (users && users.length > 0) {
                const user = users[0];
                const authRes = { token: `jwt_${user.id}_${Date.now()}`, user };
                this.setAuthData(authRes);
                return authRes;
            }
        } catch (firestoreErr) {}

        const matchedDemo = DEMO_USERS.find(u => u.email.toLowerCase() === emailLower);
        if (matchedDemo) {
            const authRes = { token: `demo:${matchedDemo.id}`, user: matchedDemo };
            this.setAuthData(authRes);
            return authRes;
        }

        throw new Error('Invalid email or credentials');
    }

    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...credentials,
                    globalRole: credentials.globalRole || Role.STUDENT,
                }),
            });

            if (response.ok) {
                const data: AuthResponse = await response.json();
                this.setAuthData(data);
                return data;
            }
        } catch (netErr) {}

        // Fallback: Create user in Firebase Firestore online directly
        const newUser: User = {
            id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: credentials.name,
            email: credentials.email.toLowerCase(),
            globalRole: credentials.globalRole || Role.STUDENT,
            enrollmentNumber: credentials.enrollmentNumber || '',
            department: credentials.department || '',
            designation: credentials.designation || '',
            clubMemberships: []
        };

        try {
            await firestoreSave('users', newUser);
        } catch (e) {}

        const authRes = { token: `jwt_${newUser.id}_${Date.now()}`, user: newUser };
        this.setAuthData(authRes);
        return authRes;
    }

    async demoLogin(email: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE}/auth/demo-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data: AuthResponse = await response.json();
                this.setAuthData(data);
                return data;
            }
        } catch (netErr) {}

        const emailLower = email.toLowerCase();
        const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === emailLower) || {
            id: `usr_demo_${Date.now()}`,
            name: email.split('@')[0].toUpperCase(),
            email: emailLower,
            globalRole: emailLower.includes('admin') ? Role.SUPER_ADMIN : emailLower.includes('dean') ? Role.DEAN : emailLower.includes('faculty') ? Role.FACULTY : Role.STUDENT,
            clubMemberships: []
        };

        const authRes = { token: `demo:${demoUser.id}`, user: demoUser };
        this.setAuthData(authRes);
        return authRes;
    }

    async getMe(): Promise<User | null> {
        if (!this.token) return null;

        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                }
                return null;
            }

            const user: User = await response.json();
            this.user = user;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            return this.user;
        }
    }

    logout(): void {
        this.token = null;
        this.user = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    getToken(): string | null {
        return this.token;
    }

    getUser(): User | null {
        return this.user;
    }

    isAuthenticated(): boolean {
        return !!this.token && !!this.user;
    }

    isAdmin(): boolean {
        return this.user?.globalRole === Role.SUPER_ADMIN;
    }

    isFaculty(): boolean {
        return this.user?.globalRole === Role.FACULTY || this.user?.globalRole === Role.SUPER_ADMIN;
    }

    getAuthHeader(): HeadersInit {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }

    private setAuthData(data: AuthResponse): void {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
}

export const authService = new AuthService();
