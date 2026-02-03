import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import api from '../../services/api';

const Reports = () => {
    const [reportData, setReportData] = useState({
        departmentData: [],
        pieData: [],
        topTeachers: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#8b5cf6'];

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/activities/reports');
                if (response.data.status === 'success') {
                    setReportData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load reports", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleExport = () => {
        alert("Export to PDF feature is being prepared. This will generate a formatted report of all service credits.");
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-500 font-medium">Generating analytical reports...</div>;
    }

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
                    <button onClick={handleExport} className="btn-primary flex items-center space-x-2">
                        <Download size={18} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="card h-96">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Activity Status by Department</h3>
                    {reportData.departmentData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData.departmentData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" dy={10} />
                                <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Legend />
                                <Bar dataKey="approved" stackId="a" fill="#3b82f6" name="Approved" />
                                <Bar dataKey="pending" stackId="a" fill="#fbbf24" name="Pending" />
                                <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">No departmental data available</div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="card h-96">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Credits Distributed by Category</h3>
                    {reportData.pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reportData.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {reportData.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} Credits`, 'Total']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">No approved credits by category</div>
                    )}
                </div>
            </div>

            {/* Top Teachers Table */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performing Teachers (by Approved Credits)</h3>
                <div className="overflow-x-auto">
                    {reportData.topTeachers.length > 0 ? (
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
                                {reportData.topTeachers.map((teacher) => (
                                    <tr key={teacher.rank}>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-400">#{teacher.rank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{teacher.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{teacher.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 font-bold">{teacher.credits}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-10 text-center text-slate-500 italic border border-dashed rounded-lg">
                            No approved credits yet. Top teachers will appear here after approvals.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
