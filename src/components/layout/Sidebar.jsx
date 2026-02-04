import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';
import {
    LayoutDashboard,
    FileText,
    Users,
    CheckSquare,
    BarChart2,
    User,
    LogOut,
    School,
    X
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPERVISOR] },
        { label: 'Submit Activity', path: '/submit-activity', icon: FileText, roles: [ROLES.TEACHER] },
        { label: 'My Activities', path: '/activities', icon: CheckSquare, roles: [ROLES.TEACHER] },
        { label: 'Approve Activities', path: '/approve', icon: CheckSquare, roles: [ROLES.ADMIN, ROLES.SUPERVISOR] },
        { label: 'Teachers', path: '/teachers', icon: Users, roles: [ROLES.ADMIN] },
        { label: 'Reports', path: '/reports', icon: BarChart2, roles: [ROLES.ADMIN, ROLES.SUPERVISOR] },
        { label: 'Profile', path: '/profile', icon: User, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPERVISOR] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={clsx(
                "h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-lg z-50 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                    <div className="bg-primary-500 p-2 rounded-lg">
                        <School size={24} className="text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">EduCredit</span>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="ml-auto md:hidden text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()} // Close sidebar on navigation on mobile
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
