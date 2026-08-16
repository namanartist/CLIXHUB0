import { User, Role } from '../types';

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
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Login failed' }));
            throw new Error(error.error || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        this.setAuthData(data);
        return data;
    }

    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...credentials,
                globalRole: credentials.globalRole || Role.STUDENT,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Signup failed' }));
            throw new Error(error.error || 'Signup failed');
        }

        const data: AuthResponse = await response.json();
        this.setAuthData(data);
        return data;
    }

    async demoLogin(email: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE}/auth/demo-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Demo login failed');
        }

        const data: AuthResponse = await response.json();
        this.setAuthData(data);
        return data;
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
