"use client";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Store } from 'lucide-react';
import { CANTEENS } from '@/lib/data';

function SignupForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { register } = useAuth();

    const role = searchParams.get('role') || 'student';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [canteenId, setCanteenId] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        register({ name, email, password, role, canteenId: role === 'vendor' ? canteenId : undefined });

        if (role === 'student') router.push('/student/dashboard');
        else router.push('/vendor/dashboard');
    };

    const isStudent = role === 'student';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF4] p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className={`p-8 text-center text-white ${isStudent ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        {isStudent ? <User size={32} /> : <Store size={32} />}
                    </div>
                    <h2 className="text-3xl font-bold capitalize">Join as {role}</h2>
                    <p className="text-white/80 mt-2">Create your account to get started</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                                style={{
                                    borderColor: isStudent ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    ['--tw-ring-color' as any]: isStudent ? 'rgb(34 197 94)' : 'rgb(59 130 246)'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                style={{
                                    borderColor: isStudent ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    ['--tw-ring-color' as any]: isStudent ? 'rgb(34 197 94)' : 'rgb(59 130 246)'
                                }}
                                required
                            />
                        </div>

                        {/* Vendor Canteen Selection */}
                        {!isStudent && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Canteen</label>
                                <select
                                    value={canteenId}
                                    onChange={(e) => setCanteenId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                                    style={{
                                        borderColor: 'rgba(59, 130, 246, 0.2)',
                                        ['--tw-ring-color' as any]: 'rgb(59 130 246)'
                                    }}
                                    required
                                >
                                    <option value="" disabled>Select your canteen</option>
                                    {CANTEENS.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${isStudent ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                }`}
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href={`/login?role=${role}`}
                            className={`font-semibold hover:underline ${isStudent ? 'text-green-600' : 'text-blue-600'}`}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
