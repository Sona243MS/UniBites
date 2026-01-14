"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FloatingLogButton from '@/components/FloatingLogButton';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/student/dashboard', icon: '📊' },
        { name: 'Menu Browser', href: '/student/menu', icon: '🍔' },
        { name: 'Log Book', href: '/student/logbook', icon: '📝' },
        { name: 'Feedback', href: '/student/feedback', icon: '💬' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-gray-200 hidden md:flex flex-col transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Header */}
                <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <Image
                            src="/logo-bowl.jpg"
                            alt="UniBites Bowl"
                            width={isCollapsed ? 40 : 48}
                            height={isCollapsed ? 40 : 48}
                            className="object-contain rounded-lg flex-shrink-0"
                        />
                        {!isCollapsed && (
                            <div className="transition-opacity duration-300">
                                <h1 className="text-2xl font-bold text-green-700">UniBites</h1>
                                <p className="text-xs text-gray-500">Student Portal</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.name : ''}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition whitespace-nowrap ${isActive
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200 overflow-hidden whitespace-nowrap">
                    <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                            {user?.name?.[0] || 'S'}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 transition-opacity duration-300">
                                <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/login?role=student');
                        }}
                        className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2 ${isCollapsed ? 'justify-center p-2' : ''
                            }`}
                        title={isCollapsed ? "Sign Out" : ""}
                    >
                        {isCollapsed ? <LogOut size={20} /> : "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <FloatingLogButton />
                <div className="md:hidden bg-white p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <Image src="/logo-bowl.jpg" alt="UniBites Bowl" width={36} height={36} className="object-contain rounded-lg" />
                        <h1 className="text-xl font-bold text-green-700">UniBites</h1>
                    </div>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
