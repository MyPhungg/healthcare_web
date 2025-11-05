import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Calendar, 
  FileText,
  LogOut,
  User,
  Clock,
  Stethoscope
} from 'lucide-react';

const Sidebar = ({ userRole = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCog, label: 'Doctors', path: '/dashboard/doctors' },
    { icon: Users, label: 'Patients', path: '/dashboard/patients' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
  ];

  const doctorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: User, label: 'Thông tin cá nhân', path: '/doctor/profile' },
    { icon: Clock, label: 'Lịch làm việc', path: '/doctor/schedule' },
    { icon: Calendar, label: 'Quản lý lịch hẹn', path: '/doctor/appointments' },
    { icon: Users, label: 'Bệnh nhân', path: '/doctor/patients' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : doctorMenuItems;

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
      {/* User Profile */}
      <div className="p-6 text-center border-b">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
          {userRole === 'admin' ? (
            <UserCog size={40} className="text-gray-600" />
          ) : (
            <Stethoscope size={40} className="text-gray-600" />
          )}
        </div>
        <h3 className="font-bold text-gray-800">
          {userRole === 'admin' ? 'Administrator' : 'Dr. Nguyễn Văn A'}
        </h3>
        <p className="text-sm text-gray-500">
          {userRole === 'admin' ? 'admin.vieconnect@gmail.com' : 'doctor@hospital.com'}
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors border-t"
      >
        <LogOut size={20} />
        <span className="font-semibold">Đăng xuất</span>
      </button>
    </div>
  );
};

export default Sidebar;