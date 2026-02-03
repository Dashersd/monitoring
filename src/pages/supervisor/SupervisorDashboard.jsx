import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { Users, FileCheck, AlertCircle } from 'lucide-react';

const SupervisorDashboard = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Department Dashboard</h1>
                <p className="text-slate-500">Monitor your department's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Dept Teachers"
                    value="24"
                    icon={Users}
                    trend="neutral"
                    trendValue=""
                    color="primary"
                />
                <StatCard
                    title="To Review"
                    value="8"
                    icon={FileCheck}
                    trend="up"
                    trendValue="+3"
                    color="warning"
                />
                <StatCard
                    title="Issues Reported"
                    value="1"
                    icon={AlertCircle}
                    trend="down"
                    trendValue="-2"
                    color="danger"
                />
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Pending Reviews for Your Department</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {[1, 2, 3].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">Maria Clara</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">Remedial Classes</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Oct 25, 2023</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                        <button className="text-green-600 hover:text-green-800 font-medium">Recommend</button>
                                        <button className="text-red-600 hover:text-red-800 font-medium">Reject</button>
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

export default SupervisorDashboard;
