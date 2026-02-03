import React from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';

const TeacherManagement = () => {
    const teachers = [
        { id: 1, name: 'John Doe', dept: 'Science', email: 'john@school.edu', status: 'Active' },
        { id: 2, name: 'Jane Smith', dept: 'Math', email: 'jane@school.edu', status: 'Active' },
        { id: 3, name: 'Robert Brown', dept: 'English', email: 'robert@school.edu', status: 'On Leave' },
        { id: 4, name: 'Emily White', dept: 'History', email: 'emily@school.edu', status: 'Active' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Teacher Management</h1>
                    <p className="text-slate-500">Manage teacher accounts and departments.</p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Add Teacher</span>
                </button>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by name or ID..." className="input-field pl-10" />
                    </div>
                    <select className="input-field w-full md:w-64">
                        <option>All Departments</option>
                        <option>Science</option>
                        <option>Math</option>
                        <option>English</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{teacher.name}</div>
                                                <div className="text-xs text-slate-500">ID: T-2023-{teacher.id}00</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{teacher.dept}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Mail size={12} className="mr-1" /> {teacher.email}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Phone size={12} className="mr-1" /> +63 900 000 0000
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreHorizontal size={20} />
                                        </button>
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

export default TeacherManagement;
