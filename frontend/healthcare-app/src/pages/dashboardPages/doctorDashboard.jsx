import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, Loader } from 'lucide-react';
import StatCard from '../../components/dashboard/statCard';
import AppointmentService from '../../service/appointmentService';
import ScheduleService from '../../service/scheduleService';
import AuthService from '../../service/authService';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    workingHours: '0h',
    completedToday: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduleId, setScheduleId] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const doctorId = await getDoctorId();
        if (doctorId) {
          // Fetch doctor info
          const doctorProfile = await ScheduleService.getDoctorProfile(AuthService.getUserId());
          setDoctorInfo(doctorProfile);

          // Fetch schedule and appointments
          const scheduleData = await ScheduleService.getDoctorSchedule(doctorId);
          if (scheduleData) {
            setScheduleId(scheduleData.scheduleId);
            const appointments = await AppointmentService.getAppointmentsBySchedule(scheduleData.scheduleId);
            
            // Process data for dashboard
            processDashboardData(appointments, scheduleData);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDoctorId = async () => {
    try {
      const userId = AuthService.getUserId();
      const doctorProfile = await ScheduleService.getDoctorProfile(userId);
      return doctorProfile.doctorId;
    } catch (error) {
      console.error('Error getting doctor ID:', error);
      return null;
    }
  };

  const processDashboardData = (appointments, scheduleData) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's appointments
    const todayApts = appointments.filter(apt => apt.appointmentDate === today);
    
    // Get unique patients
    const uniquePatients = [...new Set(appointments.map(apt => apt.patientId))];
    
    // Calculate working hours from schedule
    const workingHours = calculateWorkingHours(scheduleData);
    
    // Count completed appointments today
    const completedToday = todayApts.filter(apt => apt.status === 'COMPLETED').length;

    setDashboardData({
      todayAppointments: todayApts.length,
      totalPatients: uniquePatients.length,
      workingHours: workingHours,
      completedToday: completedToday
    });

    // Prepare today's appointments for display
    const formattedAppointments = todayApts.map(apt => ({
      id: apt.appointmentId,
      patientId: apt.patientId,
      time: apt.appointmentStart.substring(0, 5),
      reason: apt.reason,
      status: mapAppointmentStatus(apt.status)
    }));

    setTodayAppointments(formattedAppointments);
  };

  const calculateWorkingHours = (scheduleData) => {
    if (!scheduleData || !scheduleData.startTime || !scheduleData.endTime) {
      return '0h';
    }
    
    const start = new Date(`2000-01-01T${scheduleData.startTime}`);
    const end = new Date(`2000-01-01T${scheduleData.endTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);
    
    return `${Math.round(diffHours)}h`;
  };

  const mapAppointmentStatus = (status) => {
    const statusMap = {
      'PENDING': 'waiting',
      'CONFIRMED': 'waiting',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || 'waiting';
  };

  const getStatusDisplay = (status) => {
    const config = {
      'waiting': { label: 'Đang chờ', bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'in-progress': { label: 'Đang khám', bg: 'bg-blue-100', text: 'text-blue-700' },
      'completed': { label: 'Hoàn thành', bg: 'bg-green-100', text: 'text-green-700' },
      'cancelled': { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-700' },
      'scheduled': { label: 'Đã đặt', bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    
    const { label, bg, text } = config[status] || config.waiting;
    return { label, bg, text };
  };

  const stats = [
    { 
      title: 'Lịch hẹn hôm nay', 
      value: dashboardData.todayAppointments.toString(), 
      icon: Calendar, 
      color: 'blue' 
    },
    { 
      title: 'Tổng bệnh nhân', 
      value: dashboardData.totalPatients.toString(), 
      icon: Users, 
      color: 'green' 
    },
    { 
      title: 'Giờ làm việc', 
      value: dashboardData.workingHours, 
      icon: Clock, 
      color: 'orange' 
    },
    { 
      title: 'Hoàn thành hôm nay', 
      value: dashboardData.completedToday.toString(), 
      icon: CheckCircle, 
      color: 'purple' 
    },
  ];

  const handleViewAppointmentDetails = (appointmentId) => {
    // Navigate to appointments page or show details
    console.log('View appointment:', appointmentId);
    // You can implement navigation here
    window.location.href = '/doctor/appointments';
  };

  const formatDoctorName = (doctor) => {
    if (!doctor) return 'Bác sĩ';
    return `Dr. ${doctor.fullName || ''}`.trim();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-lg">Đang tải dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Xin chào, {formatDoctorName(doctorInfo)}
        </h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hôm nay</p>
          <p className="text-lg font-semibold text-gray-800">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Lịch hẹn hôm nay</h2>
          <span className="text-sm text-gray-500">
            {todayAppointments.length} lịch hẹn
          </span>
        </div>
        
        {todayAppointments.length > 0 ? (
          <div className="space-y-3">
            {todayAppointments.map((apt) => {
              const statusConfig = getStatusDisplay(apt.status);
              return (
                <div 
                  key={apt.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all border-l-4 border-blue-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-16">
                      <p className="text-2xl font-bold text-blue-600">{apt.time.split(':')[0]}</p>
                      <p className="text-sm text-gray-500">{apt.time.split(':')[1]}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">ID: {apt.patientId}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{apt.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                    <button 
                      onClick={() => handleViewAppointmentDetails(apt.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-lg">Không có lịch hẹn nào hôm nay</p>
            <p className="text-sm">Hãy kiểm tra lại lịch làm việc của bạn</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Thao tác nhanh</h3>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/doctor/appointments'}
              className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-blue-700">Quản lý lịch hẹn</span>
              <p className="text-sm text-blue-600">Xem và quản lý tất cả lịch hẹn</p>
            </button>
            <button 
              onClick={() => window.location.href = '/doctor/schedule'}
              className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-green-700">Lịch làm việc</span>
              <p className="text-sm text-green-600">Cài đặt lịch làm việc</p>
            </button>
            <button 
              onClick={() => window.location.href = '/doctor/profile'}
              className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-purple-700">Hồ sơ cá nhân</span>
              <p className="text-sm text-purple-600">Cập nhật thông tin cá nhân</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {todayAppointments.slice(0, 3).map((apt, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-500' :
                  apt.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    Lịch hẹn với bệnh nhân ID: {apt.patientId}
                  </p>
                  <p className="text-xs text-gray-600">
                    {apt.time} - {apt.reason}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getStatusDisplay(apt.status).bg
                } ${getStatusDisplay(apt.status).text}`}>
                  {getStatusDisplay(apt.status).label}
                </span>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Chưa có hoạt động nào hôm nay
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;