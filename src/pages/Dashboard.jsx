import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import SupervisorDashboard from './supervisor/SupervisorDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    switch (user.role) {
        case ROLES.ADMIN:
            return <AdminDashboard />;
        case ROLES.TEACHER:
            return <TeacherDashboard />;
        case ROLES.SUPERVISOR:
            return <SupervisorDashboard />;
        default:
            return <div className="p-8 text-center text-slate-500">Unknown Role</div>;
    }
};

export default Dashboard;
