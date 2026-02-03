import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

const SubmitActivity = () => {
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setFiles([]);
            e.target.reset();
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Submit Activity</h1>
                <p className="text-slate-500">Submit your service credit request with supporting documents.</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 animate-fade-in">
                    <Check className="mr-3" size={24} />
                    <div>
                        <p className="font-bold">Submission Successful!</p>
                        <p className="text-sm">Your activity has been submitted for review.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">Activity Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Activity Title</label>
                            <input type="text" required className="input-field" placeholder="e.g. Brigada Eskwela" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select className="input-field" required>
                                <option value="">Select Category</option>
                                <option value="training">Training / Seminar</option>
                                <option value="event">School Event</option>
                                <option value="committee">Committee Work</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input type="date" required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                            <input type="number" min="1" step="0.5" required className="input-field" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea className="input-field h-32 resize-none" placeholder="Describe the activity and your role..."></textarea>
                    </div>
                </div>

                <div className="card space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">Supporting Documents</h3>
                    <p className="text-sm text-slate-500">Upload certificates, attendance sheets, or photos (Max 5MB each).</p>

                    <div
                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer bg-slate-50"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <Upload className="mx-auto text-slate-400 mb-3" size={32} />
                        <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG supported</p>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            multiple
                            onChange={handleFileInput}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                    </div>

                    {files.length > 0 && (
                        <ul className="space-y-3">
                            {files.map((file, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="bg-white p-2 rounded shadow-sm">
                                            <span className="text-xs font-bold uppercase text-slate-600">{file.name.split('.').pop()}</span>
                                        </div>
                                        <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center">
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitActivity;
