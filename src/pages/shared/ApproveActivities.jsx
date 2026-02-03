import React, { useState } from 'react';
import { Search, Check, X, FileText, ChevronDown } from 'lucide-react';

const ApproveActivities = () => {
    const [selectedTab, setSelectedTab] = useState('pending');

    const pendingActivities = [
        { id: 1, teacher: 'Maria Clara', activity: 'Remedial Reading Class', date: 'Oct 12, 2023', credits: 2.0, docs: 1 },
        { id: 2, teacher: 'Jose Rizal', activity: 'Science Fair Judging', date: 'Oct 15, 2023', credits: 1.5, docs: 2 },
        { id: 3, teacher: 'Andres B.', activity: 'Boy Scouts Camp', date: 'Oct 20, 2023', credits: 5.0, docs: 3 },
    ];

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
                    Pending Review <span className="ml-2 bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">3</span>
                </button>
                <button
                    onClick={() => setSelectedTab('history')}
                    className={`py-2 px-4 border-b-2 font-medium transition-colors ${selectedTab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Approval History
                </button>
            </div>

            {selectedTab === 'pending' && (
                <div className="space-y-4">
                    {pendingActivities.map((item) => (
                        <div key={item.id} className="card hover:border-primary-300 transition-colors">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                                <div className="flex items-start space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                                        {item.teacher.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.activity}</h3>
                                        <p className="text-sm text-slate-500">Submitted by <span className="font-medium text-slate-700">{item.teacher}</span> • {item.date}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                                                {item.credits} Credits Requested
                                            </span>
                                            <button className="text-xs flex items-center text-primary-600 hover:underline">
                                                <FileText size={12} className="mr-1" /> View {item.docs} Attachment(s)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 self-end lg:self-center">
                                    <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
                                        <X size={18} />
                                        <span>Reject</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 rounded-lg text-white hover:bg-primary-700 font-medium transition-colors shadow-sm shadow-primary-200">
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
                <div className="card text-center py-12 text-slate-500">
                    History view placeholder
                </div>
            )}
        </div>
    );
};

export default ApproveActivities;
