import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import Profile from '../pages/Profile';
import { ROLES } from '../utils/roles';

// Teacher Pages
import SubmitActivity from '../pages/teacher/SubmitActivity';
import MyActivities from '../pages/teacher/MyActivities';

// Admin / Supervisor Pages
import ApproveActivities from '../pages/shared/ApproveActivities';
import Reports from '../pages/shared/Reports';

// Admin Pages
import TeacherManagement from '../pages/admin/TeacherManagement';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Teacher Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
                        <Route path="/submit-activity" element={<SubmitActivity />} />
                        <Route path="/activities" element={<MyActivities />} />
                    </Route>

                    {/* Admin & Supervisor Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]} />}>
                        <Route path="/approve" element={<ApproveActivities />} />
                        <Route path="/reports" element={<Reports />} />
                    </Route>

                    {/* Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                        <Route path="/teachers" element={<TeacherManagement />} />
                    </Route>

                </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
