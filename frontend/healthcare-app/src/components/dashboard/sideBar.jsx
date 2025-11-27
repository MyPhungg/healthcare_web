import React, { useState, useEffect } from 'react';
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
import AuthService from '../../service/authService'; // Import AuthService

const Sidebar = ({ userRole = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch doctor information
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (userRole === "DOCTOR") {
        try {
          const userId = AuthService.getUserId();
          console.log('Fetching doctor info for userId:', userId);
          const token = AuthService.getToken();
          console.log('Using token:', token);
          
          if (userId && token) {
            const response = await fetch(`http://localhost:8082/api/doctors/user/${userId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const doctorData = await response.json();
              setDoctorInfo(doctorData);
              console.log('Doctor info loaded:', doctorData);
            } else {
              console.error('Failed to fetch doctor info');
            }
          }
        } catch (error) {
          console.error('Error fetching doctor info:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDoctorInfo();
  }, [userRole]);

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCog, label: 'Quản lý bác sĩ', path: '/dashboard/doctors' },
    { icon: Users, label: 'Quản lý bệnh nhân', path: '/dashboard/patients' },
    { icon: Users, label: 'Quản lý người dùng', path: '/dashboard/users' },
    { icon: Calendar, label: 'Quản lý lịch hẹn', path: '/dashboard/appointments' },
    { icon: FileText, label: 'Thống kê báo cáo', path: '/dashboard/reports' },
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
    AuthService.logout();
    navigate('/login');
  };

  // Format doctor name
  const formatDoctorName = (doctorInfo) => {
    console.log('Doctor Info:', doctorInfo); // Thêm dòng này để debug
    console.log('Full Name:', doctorInfo?.fullName);
    if (!doctorInfo) return 'Bác sĩ';
    
    // Nếu có fullName, sử dụng fullName
    if (doctorInfo.fullName) {
      return `Dr. ${doctorInfo.fullName}`;
    }
    
    // Fallback nếu không có fullName
    return 'Bác sĩ';
  };

  // Get display email
  const getDisplayEmail = () => {
    if (userRole === 'admin') {
      return 'admin.vieconnect@gmail.com';
    }
    
    if (doctorInfo?.email) {
      return doctorInfo.email;
    }
    
    const currentUser = AuthService.getCurrentUser();
    return currentUser?.email || 'doctor@hospital.com';
  };

  if (loading) {
    return (
      <div className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
        <div className="p-6 text-center border-b">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Stethoscope size={40} className="text-gray-600" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

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
          {userRole === 'admin' 
            ? 'Administrator' 
            : formatDoctorName(doctorInfo)
          }
        </h3>
        <p className="text-sm text-gray-500">
          {getDisplayEmail()}
        </p>
        
        {/* Hiển thị thêm thông tin bác sĩ nếu có */}
        {userRole === 'DOCTOR' && doctorInfo?.speciality && (
          <p className="text-xs text-blue-600 mt-1">
            {doctorInfo.speciality.specialityName}
          </p>
        )}
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