"use client";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';


import { User, Store, ArrowLeft } from 'lucide-react';


function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    // Default to student only if no param, but allow state implementation to override
    const initialRole = searchParams.get('role') || 'student';
    const [activeRole, setActiveRole] = useState(initialRole);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = login(email, activeRole);
        if (success) {
            if (activeRole === 'student') router.push('/student/dashboard');
            else router.push('/vendor/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const isStudent = activeRole === 'student';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF4] p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden relative transition-colors duration-500">
                {/* Back Link */}
                <Link href="/" className="absolute top-4 left-4 text-white/80 hover:text-white z-10 p-2">
                    <ArrowLeft size={24} />
                </Link>

                {/* Header */}
                <div className={`p-8 pb-12 text-center text-white transition-colors duration-500 ${isStudent ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        {isStudent ? <User size={32} /> : <Store size={32} />}
                    </div>
                    <h2 className="text-3xl font-bold capitalize">Welcome Back</h2>
                    <p className="text-white/80 mt-2">Sign in to continue</p>
                </div>

                {/* Role Toggle */}
                <div className="relative -mt-6 px-12">
                    <div className="bg-white rounded-xl shadow-lg p-1 flex">
                        <button
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isStudent ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveRole('student')}
                        >
                            Student
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isStudent ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveRole('vendor')}
                        >
                            Vendor
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={isStudent ? 'student@campus.edu' : 'Kuksi@campus.edu'}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                                style={{
                                    borderColor: isStudent ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    ['--tw-ring-color' as any]: isStudent ? 'rgb(34 197 94)' : 'rgb(59 130 246)'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${isStudent ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                }`}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p className="mb-2">Demo Credentials:</p>
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-700 select-all">
                            {isStudent ? 'student@campus.edu' : 'Kuksi@campus.edu'}
                        </code>
                    </div>

                    <div className="mt-8 border-t pt-6 text-center text-gray-500">
                        New on campus?{' '}
                        <Link
                            href={`/signup?role=${activeRole}`}
                            className={`font-semibold hover:underline ${isStudent ? 'text-green-600' : 'text-blue-600'}`}
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
