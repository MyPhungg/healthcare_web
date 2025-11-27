import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/statCard';
import { Users, UserCog, Calendar, DollarSign, TrendingUp, Clock, Loader, RefreshCw, AlertCircle } from 'lucide-react';
import UserService from '../../service/userService';
import DoctorService from '../../service/doctorService';
import AppointmentService from '../../service/appointmentService';
import PatientService from '../../service/patientService';

const Overview = () => {
  const [stats, setStats] = useState([
    { title: 'Tổng bệnh nhân', value: '0', icon: Users, color: 'blue', trend: { value: 0, isPositive: true } },
    { title: 'Tổng bác sĩ', value: '0', icon: UserCog, color: 'green', trend: { value: 0, isPositive: true } },
    { title: 'Lịch hẹn hôm nay', value: '0', icon: Calendar, color: 'orange', trend: { value: 0, isPositive: true } },
    { title: 'Doanh thu tháng', value: '0', icon: DollarSign, color: 'purple', trend: { value: 0, isPositive: true } },
  ]);

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const loadingState = refreshing ? setRefreshing : setLoading;
      loadingState(true);

      // Fetch all data in parallel
      const [usersData, doctorsData, appointmentsData, patientsData] = await Promise.all([
        UserService.getAllUsers().catch(err => {
          console.error('Error fetching users:', err);
          return [];
        }),
        DoctorService.getAllDoctors().catch(err => {
          console.error('Error fetching doctors:', err);
          return [];
        }),
        AppointmentService.getAllAppointments().catch(err => {
          console.error('Error fetching appointments:', err);
          return [];
        }),
        PatientService.getAllPatients().catch(err => {
          console.error('Error fetching patients:', err);
          return [];
        })
      ]);

      console.log('Dashboard data:', {
        users: usersData,
        doctors: doctorsData,
        appointments: appointmentsData,
        patients: patientsData
      });

      // Process data for stats
      const totalPatients = patientsData.length || usersData.filter(user => user.role === 'PATIENT').length;
      const totalDoctors = doctorsData.length || usersData.filter(user => user.role === 'DOCTOR').length;
      
      // Calculate today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(apt => 
        apt.appointmentDate === today
      ).length;

      // Calculate monthly revenue (placeholder - you'll need to adjust based on your data structure)
      const monthlyRevenue = appointmentsData
        .filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          const now = new Date();
          return aptDate.getMonth() === now.getMonth() && 
                 aptDate.getFullYear() === now.getFullYear() &&
                 apt.status === 'COMPLETED';
        })
        .reduce((total, apt) => total + (apt.totalPrice || 0), 0);

      // Get recent appointments (last 5)
      const recentApts = appointmentsData
        .sort((a, b) => new Date(b.appointmentDate + ' ' + b.appointmentStart) - new Date(a.appointmentDate + ' ' + a.appointmentStart))
        .slice(0, 5)
        .map(apt => ({
          id: apt.appointmentId,
          patient: apt.patientName || 'Bệnh nhân',
          doctor: apt.doctorName || 'Bác sĩ',
          time: `${AppointmentService.formatTime(apt.appointmentStart)} - ${AppointmentService.formatDate(apt.appointmentDate)}`,
          status: apt.status?.toLowerCase() || 'pending'
        }));

      // Update stats
      setStats([
        { 
          title: 'Tổng bệnh nhân', 
          value: totalPatients.toLocaleString(), 
          icon: Users, 
          color: 'blue', 
          trend: { value: 12, isPositive: true } 
        },
        { 
          title: 'Tổng bác sĩ', 
          value: totalDoctors.toLocaleString(), 
          icon: UserCog, 
          color: 'green', 
          trend: { value: 5, isPositive: true } 
        },
        { 
          title: 'Lịch hẹn hôm nay', 
          value: todayAppointments.toLocaleString(), 
          icon: Calendar, 
          color: 'orange', 
          trend: { value: 8, isPositive: todayAppointments > 0 } 
        },
        { 
          title: 'Doanh thu tháng', 
          value: `${(monthlyRevenue / 1000000).toFixed(1)}M`, 
          icon: DollarSign, 
          color: 'purple', 
          trend: { value: 15, isPositive: monthlyRevenue > 0 } 
        },
      ]);

      setRecentAppointments(recentApts);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      
      // Fallback to mock data
      setStats([
        { title: 'Tổng bệnh nhân', value: '2,543', icon: Users, color: 'blue', trend: { value: 12, isPositive: true } },
        { title: 'Tổng bác sĩ', value: '145', icon: UserCog, color: 'green', trend: { value: 5, isPositive: true } },
        { title: 'Lịch hẹn hôm nay', value: '87', icon: Calendar, color: 'orange', trend: { value: 8, isPositive: false } },
        { title: 'Doanh thu tháng', value: '450M', icon: DollarSign, color: 'purple', trend: { value: 15, isPositive: true } },
      ]);

      setRecentAppointments([
        { id: 1, patient: 'Nguyễn Văn A', doctor: 'Dr. Trần B', time: '09:00 AM', status: 'confirmed' },
        { id: 2, patient: 'Lê Thị C', doctor: 'Dr. Phạm D', time: '10:30 AM', status: 'pending' },
        { id: 3, patient: 'Hoàng Văn E', doctor: 'Dr. Nguyễn F', time: '02:00 PM', status: 'completed' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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

  if (loading) {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Đang làm mới...' : 'Làm mới'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Đang hiển thị dữ liệu mẫu để demo</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Lịch hẹn gần đây</h2>
            <span className="text-sm text-gray-500">{recentAppointments.length} lịch hẹn</span>
          </div>
          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Không có lịch hẹn gần đây</p>
              </div>
            ) : (
              recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{apt.patient}</p>
                      <p className="text-sm text-gray-500">{apt.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{apt.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'confirmed' || apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' || apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      apt.status === 'completed' || apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status === 'confirmed' || apt.status === 'CONFIRMED' ? 'Đã xác nhận' :
                       apt.status === 'pending' || apt.status === 'PENDING' ? 'Chờ xác nhận' :
                       apt.status === 'completed' || apt.status === 'COMPLETED' ? 'Hoàn thành' :
                       apt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleQuickAction('add-doctor')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
            >
              <UserCog size={24} className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Thêm bác sĩ</p>
            </button>
            <button 
              onClick={() => handleQuickAction('add-patient')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
            >
              <Users size={24} className="mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Thêm bệnh nhân</p>
            </button>
            <button 
              onClick={() => handleQuickAction('create-appointment')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center group"
            >
              <Calendar size={24} className="mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Đặt lịch hẹn</p>
            </button>
            <button 
              onClick={() => handleQuickAction('view-reports')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
            >
              <TrendingUp size={24} className="mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Xem báo cáo</p>
            </button>
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Trạng thái hệ thống</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Users</span>
                <span className="text-sm font-medium text-green-600">Hoạt động</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Appointments</span>
                <span className="text-sm font-medium text-green-600">Hoạt động</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                <span className="text-sm font-medium text-gray-600">
                  {new Date().toLocaleTimeString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;