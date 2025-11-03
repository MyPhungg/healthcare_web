import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/sideBar';
import { Bell } from 'lucide-react';

const DashboardLayout = ({ userRole = 'admin' }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userRole={userRole} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-end">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;