import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/activities/stats');
                if (response.data.status === 'success') {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load stats", error);
            }
        };
        fetchStats();
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
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
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
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" dy={10} />
                            <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="credits" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activities Section - Could be duplicated from ApproveActivities or kept separate */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
                    <button className="text-primary-600 font-medium text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            <tr>
                                <td className="px-6 py-4 text-sm text-slate-500">Feature coming soon in this view...</td>
                                <td className="px-6 py-4"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
