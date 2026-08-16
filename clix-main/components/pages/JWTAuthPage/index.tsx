import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../lib/AuthContext';
import { LogIn, Zap, ArrowLeft } from 'lucide-react';
import { HeroSide } from './Sections/HeroSide';
import { JWTPanel } from './Sections/JWTPanel';
import { DemoPanel } from './Sections/DemoPanel';

interface Props { isDarkMode: boolean; }

const JWTAuthPage: React.FC<Props> = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/dashboard';
    const { login, signup, demoLogin } = useAuth();

    const [authMode, setAuthMode] = useState<'demo' | 'jwt'>('jwt');
    const [formType, setFormType] = useState<'login' | 'signup'>('login');
    const [signupRole, setSignupRole] = useState<'student' | 'faculty'>('student');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [designation, setDesignation] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const inputClass = 'w-full h-14 uni-glass text-[var(--text-main)] rounded-2xl px-5 font-semibold text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-[var(--text-secondary)]';
    const selectClass = 'w-full h-14 uni-glass text-[var(--text-main)] rounded-2xl px-5 pr-10 font-semibold text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer';

    const handleJWTSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(null);
        if (formType === 'signup') {
            if (!name || !email || !password) { setError('Please fill all required fields.'); return; }
            if (signupRole === 'student' && !selectedBranch) { setError('Please select your branch.'); return; }
            if (signupRole === 'faculty' && (!designation || !selectedDepartment)) { setError('Please fill all faculty fields.'); return; }
        }
        setIsLoading(true);
        try {
            if (formType === 'login') { await login({ email, password }); }
            else { await signup({ name, email, password, globalRole: signupRole === 'student' ? 'Student' : 'Faculty', enrollmentNumber: signupRole === 'student' ? enrollmentNumber : undefined, branch: signupRole === 'student' ? selectedBranch : undefined, department: signupRole === 'student' ? selectedBranch : selectedDepartment, designation: signupRole === 'faculty' ? designation : undefined }); }
            navigate(returnTo.startsWith('/') ? returnTo : '/dashboard');
        } catch (err: any) { setError(err.message || 'Authentication failed.'); } finally { setIsLoading(false); }
    };

    const handleDemoLogin = async (userEmail: string) => {
        setError(null); setIsLoading(true);
        try { await demoLogin(userEmail); navigate(returnTo.startsWith('/') ? returnTo : '/dashboard'); }
        catch (err: any) { setError(err.message || 'Demo login failed.'); } finally { setIsLoading(false); }
    };

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden uni-shell font-sans">
            <div className="relative z-10 w-full flex flex-col lg:flex-row">
                <HeroSide />
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-y-auto">
                    <button onClick={() => navigate('/')} className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-primary hover:bg-primary/10 transition-all active:scale-95 z-20">
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <div className="w-full max-w-lg space-y-6 sm:space-y-8 reveal mt-8 sm:mt-0">
                        <div className="flex bg-primary-soft/50 p-2 rounded-2xl border border-[var(--border-color)] text-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary flex items-center gap-2">
                                <LogIn size={14} /> Official Institutional Gateway
                            </span>
                        </div>

                        <JWTPanel formType={formType} setFormType={setFormType} error={error} setError={setError} signupRole={signupRole} setSignupRole={setSignupRole} name={name} setName={setName} designation={designation} setDesignation={setDesignation} email={email} setEmail={setEmail} enrollmentNumber={enrollmentNumber} setEnrollmentNumber={setEnrollmentNumber} selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} isLoading={isLoading} handleJWTSubmit={handleJWTSubmit} inputClass={inputClass} selectClass={selectClass} />
                        <div className="text-center space-y-2">
                            <Link to="/developer-profile" className="text-[10px] font-black uppercase tracking-[0.35em] text-primary hover:text-primary-dark transition-colors">Developed by Naman Lahariya</Link>
                            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] opacity-30">Institutional Command Protocol v2.8.4-RELEASE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JWTAuthPage;
