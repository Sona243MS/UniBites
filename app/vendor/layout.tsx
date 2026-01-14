"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', href: '/vendor/dashboard', icon: '📈' },
        { name: 'Menu Editor', href: '/vendor/menu', icon: '📝' },
        { name: 'Reviews', href: '/vendor/reviews', icon: '⭐' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <Image src="/logo-bowl.jpg" alt="UniBites Bowl" width={48} height={48} className="object-contain rounded-lg" />
                        <div>
                            <h1 className="text-2xl font-bold text-blue-700">UniBites</h1>
                            <p className="text-xs text-gray-500">Vendor Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {user?.name?.[0] || 'V'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'Vendor'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/login?role=vendor');
                        }}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="md:hidden bg-white p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <Image src="/logo-bowl.jpg" alt="UniBites Bowl" width={36} height={36} className="object-contain rounded-lg" />
                        <h1 className="text-xl font-bold text-blue-700">UniBites</h1>
                    </div>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
