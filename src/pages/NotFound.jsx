import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
            <h1 className="text-9xl font-bold text-primary-200">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-slate-800">Page Not Found</h2>
            <p className="mt-2 text-slate-500">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="mt-8 btn-primary">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
