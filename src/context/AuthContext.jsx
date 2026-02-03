import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user/token on load
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // In a real app, this would hit the API
        // const response = await api.post('/auth/login', { email, password });
        // const { token, user } = response.data;

        // MOCK LOGIN FOR DEMO PURPOSES
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        let mockUser = null;
        let mockToken = 'mock-jwt-token';

        if (email.includes('admin')) {
            mockUser = { id: 1, name: 'Admin User', email, role: 'Administrator' };
        } else if (email.includes('supervisor')) {
            mockUser = { id: 2, name: 'Supervisor User', email, role: 'Supervisor' };
        } else {
            mockUser = { id: 3, name: 'Teacher User', email, role: 'Teacher' };
        }

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
