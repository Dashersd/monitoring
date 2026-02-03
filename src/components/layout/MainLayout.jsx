import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
