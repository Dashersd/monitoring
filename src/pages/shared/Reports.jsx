import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar } from 'lucide-react';

const Reports = () => {
    const departmentData = [
        { name: 'Science', approved: 400, pending: 240, rejected: 24 },
        { name: 'Math', approved: 300, pending: 139, rejected: 80 },
        { name: 'English', approved: 200, pending: 980, rejected: 20 },
        { name: 'History', approved: 278, pending: 390, rejected: 8 },
        { name: 'PE', approved: 189, pending: 480, rejected: 28 },
    ];

    const pieData = [
        { name: 'Training', value: 400 },
        { name: 'Events', value: 300 },
        { name: 'Committee', value: 300 },
        { name: 'Others', value: 200 },
    ];

    const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
                    <p className="text-slate-500">Analytics and statistical data overview.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center space-x-2">
                        <Calendar size={18} />
                        <span>This School Year</span>
                    </button>
                    <button className="btn-primary flex items-center space-x-2">
                        <Download size={18} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card h-96">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Activity Status by Department</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" />
                            <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                            <Legend />
                            <Bar dataKey="approved" stackId="a" fill="#3b82f6" name="Approved" />
                            <Bar dataKey="pending" stackId="a" fill="#fbbf24" name="Pending" />
                            <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card h-96">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Credits Distributed by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performing Teachers</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Credits</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-400">#{i}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Top Teacher {i}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Science</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 font-bold">{20 - i}.5</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
