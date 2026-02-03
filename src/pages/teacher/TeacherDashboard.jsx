import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { Award, Clock, FilePlus, List } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherDashboard = () => {
    const data = [
        { name: 'Sep', credits: 4 },
        { name: 'Oct', credits: 3 },
        { name: 'Nov', credits: 5 },
        { name: 'Dec', credits: 2 },
        { name: 'Jan', credits: 6 },
        { name: 'Feb', credits: 4 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
                <p className="text-slate-500">Track your service credits and activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Service Credits"
                    value="45 Days"
                    icon={Award}
                    trend="up"
                    trendValue="+5 Days"
                    color="primary"
                />
                <StatCard
                    title="Pending Submissions"
                    value="2"
                    icon={Clock}
                    trend="neutral"
                    trendValue=""
                    color="warning"
                />
                <StatCard
                    title="Approved Activities"
                    value="12"
                    icon={List}
                    trend="up"
                    trendValue="+2"
                    color="secondary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Credit Accumulation Over Time</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" />
                                <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                                <Tooltip />
                                <Area type="monotone" dataKey="credits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCredits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <button className="w-full flex items-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors group">
                            <div className="bg-primary-500 p-2 rounded text-white group-hover:scale-110 transition-transform">
                                <FilePlus size={20} />
                            </div>
                            <div className="ml-4 text-left">
                                <h4 className="font-semibold text-slate-900">Submit New Activity</h4>
                                <p className="text-xs text-slate-500">Form 48, Events, etc.</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors group">
                            <div className="bg-secondary-500 p-2 rounded text-white group-hover:scale-110 transition-transform">
                                <List size={20} />
                            </div>
                            <div className="ml-4 text-left">
                                <h4 className="font-semibold text-slate-900">View History</h4>
                                <p className="text-xs text-slate-500">Past submissions</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
