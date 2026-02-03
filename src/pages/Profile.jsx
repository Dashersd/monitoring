import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, School, MapPin, Phone } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
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
                            <p className="text-primary-600 font-medium">{user?.role}</p>
                        </div>
                        <button className="btn-secondary">Edit Profile</button>
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
                            <div className="flex items-center space-x-3 text-slate-600">
                                <MapPin size={20} className="text-slate-400" />
                                <span>Metro Manila, Philippines</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Employment Details</h3>

                            <div className="flex items-center space-x-3 text-slate-600">
                                <Shield size={20} className="text-slate-400" />
                                <span className="capitalize">{user?.role} Access Level</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <School size={20} className="text-slate-400" />
                                <span>Department of Science</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-600">
                                <User size={20} className="text-slate-400" />
                                <span>Employee ID: 2023-{Math.floor(Math.random() * 10000)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
