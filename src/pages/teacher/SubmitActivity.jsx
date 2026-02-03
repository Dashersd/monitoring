import React, { useState, useEffect } from 'react';
import { Upload, X, Check } from 'lucide-react';
import api from '../../services/api';

const SubmitActivity = () => {
    // Form state
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    // UI state
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/system/reference-data');
                if (response.data.status === 'success') {
                    setCategories(response.data.data.categories);
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const payload = {
                title,
                description,
                date,
                durationHours: duration,
                categoryId
            };

            const response = await api.post('/activities/submit', payload);

            if (response.data.status === 'success') {
                setSuccess(true);
                // Reset form
                setTitle('');
                setCategoryId('');
                setDate('');
                setDuration('');
                setDescription('');
                setFiles([]);

                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit activity');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Submit Activity</h1>
                <p className="text-slate-500">Submit your service credit request with supporting documents.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 animate-fade-in">
                    <p className="font-bold">{error}</p>
                </div>
            )}

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
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. Brigada Eskwela"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                className="input-field"
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="input-field"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                            <input
                                type="number"
                                min="1"
                                step="0.5"
                                required
                                className="input-field"
                                placeholder="0"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            className="input-field h-32 resize-none"
                            placeholder="Describe the activity and your role..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
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
                    <button type="button" className="btn-secondary" onClick={() => window.history.back()}>Cancel</button>
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center">
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitActivity;
