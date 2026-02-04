import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTeachers: 0,
        pendingApprovals: 0,
        totalCredits: 0,
        activeReports: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activitiesRes] = await Promise.all([
                    api.get('/activities/stats'),
                    api.get('/activities/all?limit=5')
                ]);

                if (statsRes.data.status === 'success') {
                    setStats(statsRes.data.data);
                }
                if (activitiesRes.data.status === 'success') {
                    setRecentActivities(activitiesRes.data.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Mock Data for charts (To be replaced with real aggregation endpoint later)
    const data = [
        { name: 'Jan', credits: 4000 },
        { name: 'Feb', credits: 3000 },
        { name: 'Mar', credits: 2000 },
        { name: 'Apr', credits: 2780 },
        { name: 'May', credits: 1890 },
        { name: 'Jun', credits: 2390 },
        { name: 'Jul', credits: 3490 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
                <p className="text-slate-500">System-wide monitoring and control center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Teachers"
                    value={stats.totalTeachers}
                    icon={Users}
                    trend="neutral"
                    trendValue="-"
                    color="primary"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats.pendingApprovals}
                    icon={Clock}
                    trend="up"
                    trendValue="Active"
                    color="warning"
                />
                <StatCard
                    title="Credits Awarded"
                    value={stats.totalCredits}
                    icon={CheckCircle}
                    trend="up"
                    trendValue="Total"
                    color="secondary"
                />
                <StatCard
                    title="Active Reports"
                    value={stats.activeReports}
                    icon={FileText}
                    trend="neutral"
                    trendValue="0%"
                    color="info"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card h-96">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Service Credits Trend (Yearly)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" dy={10} />
                            <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                            <Tooltip />
                            <Line type="monotone" dataKey="credits" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card h-96">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Department Performance</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" dy={10} />
                            <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="credits" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activities Section */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
                    <Link to="/approve" className="text-primary-600 font-medium text-sm hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-slate-500">Loading activities...</td>
                                </tr>
                            ) : recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{activity.title}</div>
                                            <div className="text-xs text-slate-500">{activity.category?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{activity.teacher?.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{activity.teacher?.department?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                                                {activity.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No recent activities found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
