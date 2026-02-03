import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, CheckCircle, XCircle, Clock, ArrowLeft, Mail, Briefcase } from 'lucide-react';
import api from '../../services/api';

const TeacherDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/activities/teacher/${id}`);
                if (response.data.status === 'success') {
                    setTeacher(response.data.data.teacher);
                    setStats(response.data.data.stats);
                    setActivities(response.data.data.activities);
                }
            } catch (error) {
                console.error("Failed to load teacher details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center py-10 font-medium text-slate-500">Loading teacher profile...</div>;
    }

    if (!teacher) {
        return <div className="text-center py-10 text-red-500 font-bold">Teacher not found.</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header / Profile */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{teacher.name}</h1>
                    <div className="flex items-center space-x-4 text-slate-500 text-sm">
                        <span className="flex items-center"><Mail size={14} className="mr-1" /> {teacher.email}</span>
                        <span className="flex items-center"><Briefcase size={14} className="mr-1" /> {teacher.department} Department</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {teacher.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-blue-50 border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 uppercase">Total Credits</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.totalCredits}</p>
                        </div>
                        <CheckCircle size={32} className="text-blue-300" />
                    </div>
                </div>
                <div className="card bg-green-50 border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 uppercase">Approved</p>
                            <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                        </div>
                        <CheckCircle size={32} className="text-green-300" />
                    </div>
                </div>
                <div className="card bg-yellow-50 border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 uppercase">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                        </div>
                        <Clock size={32} className="text-yellow-300" />
                    </div>
                </div>
                <div className="card bg-red-50 border-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600 uppercase">Rejected</p>
                            <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
                        </div>
                        <XCircle size={32} className="text-red-300" />
                    </div>
                </div>
            </div>

            {/* Activities Table */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Activity History</h3>
                <div className="overflow-x-auto">
                    {activities.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 border border-dashed rounded-lg bg-slate-50">
                            No activities found for this teacher.
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hours</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {activities.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{item.title}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{item.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {item.category?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                                            {item.durationHours}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDetails;
