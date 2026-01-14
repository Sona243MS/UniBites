"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, USERS } from '@/lib/data';

export type RegisterData = {
    name: string;
    email: string;
    password?: string;
    role: string;
    canteenId?: string;
};

export interface AuthContextType {
    user: User | null;
    login: (email: string, role: string) => boolean; // Changed to return success status
    register: (data: RegisterData) => void;
    updateUser: (updates: Partial<User>) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [customUsers, setCustomUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load stored user session
        const storedUserId = localStorage.getItem('campusbite_user_id');

        // Load custom registered users
        const storedCustomUsers = localStorage.getItem('campusbite_custom_users');
        let parsedCustomUsers: User[] = [];
        if (storedCustomUsers) {
            try {
                parsedCustomUsers = JSON.parse(storedCustomUsers);
                setCustomUsers(parsedCustomUsers);
            } catch (e) {
                console.error("Failed to parse custom users", e);
            }
        }

        if (storedUserId) {
            const foundUser = USERS.find(u => u.id === storedUserId) || parsedCustomUsers.find(u => u.id === storedUserId);
            if (foundUser) setUser(foundUser);
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: string) => {
        // Check both static and custom users
        const foundUser = USERS.find(u => u.email === email && u.role === role) ||
            customUsers.find(u => u.email === email && u.role === role);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('campusbite_user_id', foundUser.id);
            return true;
        } else {
            // Don't alert here, let the UI handle it
            return false;
        }
    };

    const register = (data: RegisterData) => {
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: data.name,
            email: data.email,
            role: data.role as any,
            canteenId: data.canteenId,
            isOnboardingComplete: false,
            budget: {
                dailyLimit: 200,
                monthlyLimit: 5000,
                savingGoal: 0,
                spentToday: 0,
                spentMonth: 0
            },
            preferences: []
        };

        const updatedCustomUsers = [...customUsers, newUser];
        setCustomUsers(updatedCustomUsers);
        localStorage.setItem('campusbite_custom_users', JSON.stringify(updatedCustomUsers));

        // Auto login after register
        setUser(newUser);
        localStorage.setItem('campusbite_user_id', newUser.id);
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        // Update in custom users list if applicable
        const updatedCustomUsers = customUsers.map(u => u.id === user.id ? updatedUser : u);
        setCustomUsers(updatedCustomUsers);
        localStorage.setItem('campusbite_custom_users', JSON.stringify(updatedCustomUsers));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('campusbite_user_id');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
