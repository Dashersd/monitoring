import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center w-96">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
