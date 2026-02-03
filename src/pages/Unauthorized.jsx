import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="bg-red-50 p-6 rounded-full">
                <ShieldAlert size={64} className="text-red-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-800">Access Denied</h2>
            <p className="mt-2 text-slate-500">You don't have permission to access this page.</p>
            <Link to="/" className="mt-8 btn-primary">
                Return to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;
