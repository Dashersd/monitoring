import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, X, Edit, UserX, UserCheck, Key, FileText, BarChart2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeActionId, setActiveActionId] = useState(null);
    const actionMenuRef = useRef(null);
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);

    // ... (existing code) ...

    const handleViewDetails = (teacherId) => {
        navigate(`/teachers/${teacherId}`);
    };

    // ... (render return) ...

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        departmentId: '',
        status: 'Active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchTeachers();
        fetchDepartments();

        // Click outside to close menu
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActiveActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/system/teachers');
            if (response.data.status === 'success') {
                setTeachers(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load teachers", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/system/reference-data');
            if (response.data.status === 'success') {
                setDepartments(response.data.data.departments);
            }
        } catch (error) {
            console.error("Failed to load departments", error);
        }
    };

    // Actions
    const handleAddClick = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: '', email: '', password: '', departmentId: '', status: 'Active' });
        setShowModal(true);
    };

    const handleEditClick = (teacher) => {
        setIsEditMode(true);
        setFormData({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            password: '', // Don't show password
            departmentId: teacher.departmentId || '', // Need to ensure backend sends this ID
            status: teacher.status
        });
        setActiveActionId(null);
        setShowModal(true);
    };

    const handleStatusToggle = async (teacher) => {
        if (!window.confirm(`Are you sure you want to ${teacher.status === 'Active' ? 'deactivate' : 'activate'} this teacher?`)) return;

        try {
            const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
            await api.put(`/system/teachers/${teacher.id}`, { status: newStatus });
            fetchTeachers();
            setActiveActionId(null);
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleResetPassword = async (teacher) => {
        if (!window.confirm(`Reset password for ${teacher.name} to 'welcome123'?`)) return;

        try {
            await api.put(`/system/teachers/${teacher.id}/reset-password`);
            alert("Password has been reset to 'welcome123'.");
            setActiveActionId(null);
        } catch (error) {
            alert("Failed to reset password");
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toString().includes(searchTerm)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await api.put(`/system/teachers/${formData.id}`, formData);
                alert('Teacher updated successfully!');
            } else {
                await api.post('/system/teachers', formData);
                alert('Teacher account created successfully!');
            }
            setShowModal(false);
            fetchTeachers();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/system/teachers/export', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Teachers_Performance_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Failed to export report");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Teacher Management</h1>
                    <p className="text-slate-500">Manage teacher accounts and departments.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                    <button
                        onClick={handleAddClick}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={18} />
                        <span>Add Teacher</span>
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-visible min-h-[400px]"> {/* Increased height for dropdowns */}
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">Loading teachers...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{teacher.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {teacher.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{teacher.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Mail size={12} className="mr-1" /> {teacher.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionId(activeActionId === teacher.id ? null : teacher.id);
                                                }}
                                                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {/* Action Menu Dropdown */}
                                            {activeActionId === teacher.id && (
                                                <div ref={actionMenuRef} className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 text-left">
                                                    <div className="py-1" role="menu">
                                                        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                            Teacher Account
                                                        </div>
                                                        <button onClick={() => handleEditClick(teacher)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center">
                                                            <Edit size={14} className="mr-2" /> Edit Details
                                                        </button>
                                                        <button onClick={() => handleStatusToggle(teacher)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center">
                                                            {teacher.status === 'Active' ? <UserX size={14} className="mr-2 text-red-500" /> : <UserCheck size={14} className="mr-2 text-green-500" />}
                                                            {teacher.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                                                        </button>

                                                        <div className="border-t border-slate-100 my-1"></div>
                                                        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                            Activities & Credits
                                                        </div>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                                                            onClick={() => handleViewDetails(teacher.id)}
                                                        >
                                                            <BarChart2 size={14} className="mr-2" /> View Credit Summary
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                                                            onClick={() => handleViewDetails(teacher.id)}
                                                        >
                                                            <FileText size={14} className="mr-2" /> View Activities
                                                        </button>

                                                        <div className="border-t border-slate-100 my-1"></div>
                                                        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                            Security
                                                        </div>
                                                        <button onClick={() => handleResetPassword(teacher)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center">
                                                            <Key size={14} className="mr-2" /> Reset Password
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTeachers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-500">No teachers found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add/Edit Teacher Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">
                                {isEditMode ? 'Edit Teacher' : 'Add New Teacher'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Maria Clara"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="teacher@school.edu"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {!isEditMode && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="input-field"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select
                                    required
                                    className="input-field"
                                    value={formData.departmentId}
                                    onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            {isEditMode && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Status</label>
                                    <select
                                        className="input-field"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            )}

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary flex-1"
                                >
                                    {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Teacher' : 'Create Account')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
