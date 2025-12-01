import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/statCard';
import { Users, UserCog, Calendar, DollarSign, TrendingUp, Clock, Loader, RefreshCw, AlertCircle, Activity } from 'lucide-react';
import UserService from '../../service/userService';
import DoctorService from '../../service/doctorService';
import AppointmentService from '../../service/appointmentService';
import PatientService from '../../service/patientService';

const Overview = () => {
  const [stats, setStats] = useState([
    { title: 'Tổng bệnh nhân', value: '0', icon: Users, color: 'blue', trend: { value: 0, isPositive: true } },
    { title: 'Tổng bác sĩ', value: '0', icon: UserCog, color: 'green', trend: { value: 0, isPositive: true } },
    { title: 'Lịch hẹn hôm nay', value: '0', icon: Calendar, color: 'orange', trend: { value: 0, isPositive: true } },
    { title: 'Doanh thu tháng', value: '0đ', icon: DollarSign, color: 'purple', trend: { value: 0, isPositive: true } },
  ]);

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    usersApi: false,
    appointmentsApi: false,
    doctorsApi: false,
    patientsApi: false,
    lastUpdate: new Date()
  });

  // Kiểm tra trạng thái API
  const checkApiStatus = async () => {
    try {
      // Test các API endpoint
      const [usersStatus, appointmentsStatus, doctorsStatus, patientsStatus] = await Promise.allSettled([
        UserService.getAllUsers(),
        AppointmentService.getAllAppointments(),
        DoctorService.getAllDoctors(),
        PatientService.getAllPatients()
      ]);

      setSystemStatus({
        usersApi: usersStatus.status === 'fulfilled',
        appointmentsApi: appointmentsStatus.status === 'fulfilled',
        doctorsApi: doctorsStatus.status === 'fulfilled',
        patientsApi: patientsStatus.status === 'fulfilled',
        lastUpdate: new Date()
      });

      return {
        usersApi: usersStatus.status === 'fulfilled',
        appointmentsApi: appointmentsStatus.status === 'fulfilled'
      };
    } catch (err) {
      console.error('Error checking API status:', err);
      return { usersApi: false, appointmentsApi: false };
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const loadingState = refreshing ? setRefreshing : setLoading;
      loadingState(true);

      // Check API status first
      const apiStatus = await checkApiStatus();

      if (!apiStatus.usersApi && !apiStatus.appointmentsApi) {
        throw new Error('Không thể kết nối đến API server');
      }

      // Fetch all data in parallel
      const [appointmentsData, patientsData, doctorsData, usersData] = await Promise.allSettled([
        AppointmentService.getAllAppointments(),
        PatientService.getAllPatients(),
        DoctorService.getAllDoctors(),
        UserService.getAllUsers()
      ]);

      console.log('Dashboard data fetched:', {
        appointments: appointmentsData.status === 'fulfilled' ? appointmentsData.value : [],
        patients: patientsData.status === 'fulfilled' ? patientsData.value : [],
        doctors: doctorsData.status === 'fulfilled' ? doctorsData.value : [],
        users: usersData.status === 'fulfilled' ? usersData.value : []
      });

      // Process appointments data
      const appointments = appointmentsData.status === 'fulfilled' ? appointmentsData.value : [];
      const patients = patientsData.status === 'fulfilled' ? patientsData.value : [];
      const doctors = doctorsData.status === 'fulfilled' ? doctorsData.value : [];
      const users = usersData.status === 'fulfilled' ? usersData.value : [];

      // Calculate stats
      const totalPatients = patients.length > 0 ? patients.length : 
                          users.filter(user => user.role === 'PATIENT').length;
      const totalDoctors = doctors.length > 0 ? doctors.length : 
                          users.filter(user => user.role === 'DOCTOR').length;
      
      // Calculate today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => 
        apt.appointment?.appointmentDate === today
      ).length;

      // Calculate monthly revenue
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = now.getFullYear();

      const monthlyRevenue = appointments
        .filter(apt => {
          const aptDate = apt.appointment?.appointmentDate;
          if (!aptDate) return false;
          
          const [year, month] = aptDate.split('-');
          return parseInt(month) === currentMonth && 
                 parseInt(year) === currentYear &&
                 apt.appointment?.status === 'COMPLETED';
        })
        .reduce((total, apt) => total + (apt.fee || 0), 0);

      // Get recent appointments (last 5)
      const recentApts = appointments
        .sort((a, b) => {
          const dateA = a.appointment?.appointmentDate + ' ' + a.appointment?.appointmentStart;
          const dateB = b.appointment?.appointmentDate + ' ' + b.appointment?.appointmentStart;
          return new Date(dateB) - new Date(dateA);
        })
        .slice(0, 5)
        .map(apt => {
          const patientName = apt.patient?.fullName || 'Chưa có thông tin';
          const doctorName = apt.doctor?.fullName || 'Chưa có thông tin';
          const appointmentDate = apt.appointment?.appointmentDate || today;
          const appointmentTime = apt.appointment?.appointmentStart || '00:00:00';
          
          return {
            id: apt.appointment?.appointmentId || `app-${Math.random().toString(36).substr(2, 9)}`,
            patient: patientName,
            doctor: doctorName,
            time: `${AppointmentService.formatTime(appointmentTime)} - ${AppointmentService.formatDate(appointmentDate)}`,
            status: apt.appointment?.status || 'PENDING'
          };
        });

      // Calculate trends (placeholder - you can implement actual trend calculation)
      const calculateTrend = (current, previous) => {
        if (!previous || previous === 0) return { value: 100, isPositive: true };
        const change = ((current - previous) / previous) * 100;
        return {
          value: Math.abs(Math.round(change)),
          isPositive: change >= 0
        };
      };

      // Update stats with calculated values
      setStats([
        { 
          title: 'Tổng bệnh nhân', 
          value: totalPatients.toLocaleString('vi-VN'), 
          icon: Users, 
          color: 'blue', 
          trend: calculateTrend(totalPatients, Math.max(0, totalPatients - 10))
        },
        { 
          title: 'Tổng bác sĩ', 
          value: totalDoctors.toLocaleString('vi-VN'), 
          icon: UserCog, 
          color: 'green', 
          trend: calculateTrend(totalDoctors, Math.max(0, totalDoctors - 3))
        },
        { 
          title: 'Lịch hẹn hôm nay', 
          value: todayAppointments.toLocaleString('vi-VN'), 
          icon: Calendar, 
          color: 'orange', 
          trend: calculateTrend(todayAppointments, Math.max(0, todayAppointments - 2))
        },
        { 
          title: 'Doanh thu tháng', 
          value: `${(monthlyRevenue / 1000000) >= 1 
            ? (monthlyRevenue / 1000000).toFixed(1) + 'M'
            : monthlyRevenue.toLocaleString('vi-VN')}đ`, 
          icon: DollarSign, 
          color: 'purple', 
          trend: calculateTrend(monthlyRevenue, Math.max(0, monthlyRevenue * 0.8))
        },
      ]);

      setRecentAppointments(recentApts);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Đang hiển thị dữ liệu mẫu.');
      
      // Fallback to mock data
      const mockAppointments = await AppointmentService.getMockAppointments();
      
      setStats([
        { 
          title: 'Tổng bệnh nhân', 
          value: '24', 
          icon: Users, 
          color: 'blue', 
          trend: { value: 12, isPositive: true } 
        },
        { 
          title: 'Tổng bác sĩ', 
          value: '20', 
          icon: UserCog, 
          color: 'green', 
          trend: { value: 5, isPositive: true } 
        },
        { 
          title: 'Lịch hẹn hôm nay', 
          value: '8', 
          icon: Calendar, 
          color: 'orange', 
          trend: { value: 8, isPositive: true } 
        },
        { 
          title: 'Doanh thu tháng', 
          value: '29.5Mđ', 
          icon: DollarSign, 
          color: 'purple', 
          trend: { value: 15, isPositive: true } 
        },
      ]);

      // Format mock appointments for display
      const mockRecentApts = mockAppointments.slice(0, 5).map(apt => ({
        id: apt.appointmentId || `app-${Math.random().toString(36).substr(2, 9)}`,
        patient: apt.patient?.fullName || apt.patientName || 'Bệnh nhân',
        doctor: apt.doctor?.fullName || apt.doctorName || 'Bác sĩ',
        time: `${AppointmentService.formatTime(apt.appointmentStart)} - ${AppointmentService.formatDate(apt.appointmentDate)}`,
        status: apt.status || 'PENDING'
      }));

      setRecentAppointments(mockRecentApts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    // Implement quick actions based on your routing
    switch (action) {
      case 'add-doctor':
        window.location.href = '/dashboard/doctors?action=create';
        break;
      case 'add-patient':
        window.location.href = '/dashboard/patients?action=create';
        break;
      case 'create-appointment':
        window.location.href = '/dashboard/appointments?action=create';
        break;
      case 'view-reports':
        window.location.href = '/dashboard/reports';
        break;
      default:
        break;
    }
  };

  // Function to get status display
  const getStatusDisplay = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return { text: 'Đã xác nhận', className: 'bg-green-100 text-green-700' };
      case 'PENDING':
        return { text: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' };
      case 'COMPLETED':
        return { text: 'Hoàn thành', className: 'bg-blue-100 text-blue-700' };
      case 'CANCELLED':
        return { text: 'Đã hủy', className: 'bg-red-100 text-red-700' };
      default:
        return { text: 'Không xác định', className: 'bg-gray-100 text-gray-700' };
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tổng quan hệ thống</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Đang làm mới...' : 'Làm mới'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Dữ liệu có thể không phản ánh thông tin thực tế</p>
          </div>
        </div>
      )}

      {/* API Status Indicator */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${systemStatus.usersApi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <Activity size={12} />
          API Users: {systemStatus.usersApi ? '✓' : '✗'}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${systemStatus.appointmentsApi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <Activity size={12} />
          API Appointments: {systemStatus.appointmentsApi ? '✓' : '✗'}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${systemStatus.doctorsApi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <Activity size={12} />
          API Doctors: {systemStatus.doctorsApi ? '✓' : '✗'}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${systemStatus.patientsApi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <Activity size={12} />
          API Patients: {systemStatus.patientsApi ? '✓' : '✗'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-bold text-gray-800">Lịch hẹn gần đây</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {recentAppointments.length} lịch hẹn
              </span>
              <button 
                onClick={() => window.location.href = '/dashboard/appointments'}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả →
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Không có lịch hẹn gần đây</p>
                <button 
                  onClick={() => handleQuickAction('create-appointment')}
                  className="mt-3 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Tạo lịch hẹn ngay
                </button>
              </div>
            ) : (
              recentAppointments.map((apt) => {
                const statusInfo = getStatusDisplay(apt.status);
                return (
                  <div 
                    key={apt.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-0"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate" title={apt.patient}>
                          {apt.patient}
                        </p>
                        <p className="text-sm text-gray-500 truncate" title={apt.doctor}>
                          {apt.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 sm:gap-0">
                      <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        {apt.time}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.className} w-fit`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => handleQuickAction('add-doctor')}
              className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
            >
              <UserCog size={20} className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Thêm bác sĩ</p>
            </button>
            <button 
              onClick={() => handleQuickAction('add-patient')}
              className="p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
            >
              <Users size={20} className="mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Thêm bệnh nhân</p>
            </button>
            <button 
              onClick={() => handleQuickAction('create-appointment')}
              className="p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center group"
            >
              <Calendar size={20} className="mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Đặt lịch hẹn</p>
            </button>
            <button 
              onClick={() => handleQuickAction('view-reports')}
              className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
            >
              <TrendingUp size={20} className="mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Xem báo cáo</p>
            </button>
          </div>

          {/* System Status */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Trạng thái hệ thống</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Users</span>
                <span className={`text-sm font-medium ${systemStatus.usersApi ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.usersApi ? '✓ Hoạt động' : '✗ Lỗi'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Appointments</span>
                <span className={`text-sm font-medium ${systemStatus.appointmentsApi ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.appointmentsApi ? '✓ Hoạt động' : '✗ Lỗi'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Doctors</span>
                <span className={`text-sm font-medium ${systemStatus.doctorsApi ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.doctorsApi ? '✓ Hoạt động' : '✗ Lỗi'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Patients</span>
                <span className={`text-sm font-medium ${systemStatus.patientsApi ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStatus.patientsApi ? '✓ Hoạt động' : '✗ Lỗi'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                <span className="text-sm font-medium text-gray-600">
                  {systemStatus.lastUpdate.toLocaleTimeString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Hệ thống quản lý phòng khám • Phiên bản 1.0.0</p>
        <p className="mt-1">Dữ liệu được cập nhật tự động mỗi 5 phút</p>
      </div>
    </div>
  );
};

export default Overview;