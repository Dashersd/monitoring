import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
    // Mock Data
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
                    value="1,248"
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                    color="primary"
                />
                <StatCard
                    title="Pending Approvals"
                    value="45"
                    icon={Clock}
                    trend="down"
                    trendValue="-5%"
                    color="warning"
                />
                <StatCard
                    title="Credits Awarded"
                    value="12.5k"
                    icon={CheckCircle}
                    trend="up"
                    trendValue="+8%"
                    color="secondary"
                />
                <StatCard
                    title="Active Reports"
                    value="24"
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

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
                    <button className="text-primary-600 font-medium text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">JD</div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">John Doe</div>
                                                <div className="text-sm text-slate-500">Science Dept</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Brigada Eskwela Participation</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Oct 24, 2023</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                                        Review
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
