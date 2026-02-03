import React, { useState, useEffect } from 'react';
import { Search, Check, X, FileText, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const ApproveActivities = () => {
    const [selectedTab, setSelectedTab] = useState('pending');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await api.get('/activities/all');
            if (response.data.status === 'success') {
                setActivities(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load activities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleAction = async (id, status) => {
        try {
            const response = await api.put(`/activities/${id}/status`, {
                status,
                remarks: `Activity marked as ${status}`
            });
            if (response.data.status === 'success') {
                // Refresh list
                fetchActivities();
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const pendingActivities = activities.filter(a => a.status === 'PENDING');
    const historyActivities = activities.filter(a => a.status !== 'PENDING');

    // Helper to extract teacher name safely
    const getTeacherName = (activity) => {
        // Since we include teacher -> user in prisma, structure is activity.teacher.user.name
        return activity.teacher?.user?.name || 'Unknown Teacher';
    };

    // Helper to get formatted date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Activity Approval</h1>
                <p className="text-slate-500">Review and validate activity submissions.</p>
            </div>

            <div className="flex space-x-4 border-b border-slate-200">
                <button
                    onClick={() => setSelectedTab('pending')}
                    className={`py-2 px-4 border-b-2 font-medium transition-colors ${selectedTab === 'pending' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Pending Review <span className="ml-2 bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">{pendingActivities.length}</span>
                </button>
                <button
                    onClick={() => setSelectedTab('history')}
                    className={`py-2 px-4 border-b-2 font-medium transition-colors ${selectedTab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Approval History
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading activities...</div>
            ) : (
                <>
                    {selectedTab === 'pending' && (
                        <div className="space-y-4">
                            {pendingActivities.map((item) => (
                                <div key={item.id} className="card hover:border-primary-300 transition-colors">
                                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                                                {getTeacherName(item).charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{item.title}</h3>
                                                <p className="text-sm text-slate-500">Submitted by <span className="font-medium text-slate-700">{getTeacherName(item)}</span> • {formatDate(item.date)}</p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                                                        {item.durationHours} Credits Requested
                                                    </span>
                                                    <button className="text-xs flex items-center text-primary-600 hover:underline">
                                                        <FileText size={12} className="mr-1" /> View Attachments (0)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 self-end lg:self-center">
                                            <button
                                                onClick={() => handleAction(item.id, 'REJECTED')}
                                                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
                                            >
                                                <X size={18} />
                                                <span>Reject</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(item.id, 'APPROVED')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 rounded-lg text-white hover:bg-primary-700 font-medium transition-colors shadow-sm shadow-primary-200"
                                            >
                                                <Check size={18} />
                                                <span>Approve</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {pendingActivities.length === 0 && (
                                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <p className="text-slate-500">No pending activities to review.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedTab === 'history' && (
                        <div className="space-y-4">
                            {historyActivities.map((item) => (
                                <div key={item.id} className="card hover:border-primary-300 transition-colors opacity-80 hover:opacity-100">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${item.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {item.status === 'APPROVED' ? <Check size={18} /> : <X size={18} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{item.title}</h3>
                                                <p className="text-sm text-slate-500">{getTeacherName(item)} • {item.status}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {item.durationHours} Cr.
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {historyActivities.length === 0 && (
                                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <p className="text-slate-500">No history found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ApproveActivities;
