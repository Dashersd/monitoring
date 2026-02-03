import React from 'react';
import { Search, Filter, Eye, Download } from 'lucide-react';

const MyActivities = () => {
    // Mock Data
    const activities = [
        { id: 1, title: 'Brigada Eskwela', date: '2023-10-24', credits: 1.5, status: 'Approved', category: 'Event' },
        { id: 2, title: 'Science Month Seminar', date: '2023-11-05', credits: 1.0, status: 'Pending', category: 'Training' },
        { id: 3, title: 'Parent-Teacher Conference', date: '2023-11-15', credits: 0.5, status: 'Rejected', category: 'Meeting' },
        { id: 4, title: 'Curriculum Review', date: '2023-11-20', credits: 2.0, status: 'Approved', category: 'Committee' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Activities</h1>
                    <p className="text-slate-500">Track the status of your service credit submissions.</p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                    <Download size={18} />
                    <span>Export Record</span>
                </button>
            </div>

            <div className="card">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-slate-200 pb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search activities..." className="input-field pl-10" />
                    </div>
                    <div className="flex gap-4">
                        <button className="btn-secondary flex items-center space-x-2">
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>
                        <select className="input-field w-40">
                            <option>All Status</option>
                            <option>Approved</option>
                            <option>Pending</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Credits</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{activity.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{activity.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{activity.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{activity.credits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(activity.status)}`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-primary-600 hover:text-primary-900 flex items-center justify-end w-full">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Mock */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4">
                    <div className="text-sm text-slate-500">Showing 1 to 4 of 12 results</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyActivities;
