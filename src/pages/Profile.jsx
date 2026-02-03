import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, School, MapPin, Phone, Key, Lock, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // We'll reuse the teacher stats endpoint if role is TEACHER
                if (user?.role === 'TEACHER') {
                    const response = await api.get(`/activities/teacher/${user.id}`);
                    if (response.data.status === 'success') {
                        setProfileData(response.data.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile info");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProfile();
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (response.data.status === 'success') {
                setStatus({ type: 'success', message: 'Password updated successfully!' });
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update password'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
                <p className="text-slate-500">Manage your personal information and account settings.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                            <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-4xl font-bold text-primary-600">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-8 px-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                            <p className="text-primary-600 font-medium capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Contact Information</h3>

                            <div className="flex items-center space-x-3 text-slate-600">
                                <Mail size={20} className="text-slate-400" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <Phone size={20} className="text-slate-400" />
                                <span>+63 912 345 6789</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Employment Details</h3>

                            <div className="flex items-center space-x-3 text-slate-600">
                                <Shield size={20} className="text-slate-400" />
                                <span className="capitalize">{user?.role?.toLowerCase()} Access Level</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <School size={20} className="text-slate-400" />
                                <span>{profileData?.profile?.department?.name || 'Academic Department'}</span>
                            </div>
                            {user?.role === 'TEACHER' && (
                                <div className="flex items-center space-x-3 text-primary-600 font-bold">
                                    <CreditCard size={20} className="text-primary-400" />
                                    <span>Total Credits: {profileData?.stats?.approvedCredits || 0}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Key size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Security & Password</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Changing your password regularly helps keep your account secure. Ensure your new password is
                            at least 6 characters long and includes a mix of characters.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="md:col-span-2 space-y-4">
                        {status.message && (
                            <div className={`p-4 rounded-lg flex items-center space-x-3 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span>{status.message}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    className="input-field pl-10"
                                    required
                                    value={passwords.currentPassword}
                                    onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        className="input-field pl-10"
                                        required
                                        value={passwords.newPassword}
                                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        className="input-field pl-10"
                                        required
                                        value={passwords.confirmPassword}
                                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-full md:w-auto"
                            >
                                {submitting ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
