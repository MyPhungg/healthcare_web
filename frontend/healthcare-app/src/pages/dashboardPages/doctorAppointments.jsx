import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock4,
  Loader,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Button from '../../components/common/button';
import AppointmentService from '../../service/appointmentService';
import ScheduleService from '../../service/scheduleService';
import AuthService from '../../service/authService';

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientDetails, setPatientDetails] = useState({});
  const [scheduleId, setScheduleId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Transform API data to match component expectations
  const transformAppointmentData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map(item => {
      // Extract appointment data from nested structure
      const appointmentData = {
        ...item.appointment,
        doctor: item.doctor,
        fee: item.fee
      };
      
      // Add patient info from doctor if needed (in case of API change)
      // In current API, patient info is not included in the response
      // We'll use what we have from appointment data
      
      return appointmentData;
    });
  };

  // Fetch schedule and appointments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const doctorId = await getDoctorId();
      if (doctorId) {
        const scheduleData = await ScheduleService.getDoctorSchedule(doctorId);
        if (scheduleData && scheduleData.scheduleId) {
          setScheduleId(scheduleData.scheduleId);
          const appointmentsData = await AppointmentService.getAppointmentsBySchedule(scheduleData.scheduleId);
          
          // Transform data to match expected structure
          const transformedData = transformAppointmentData(appointmentsData);
          setAppointments(transformedData);
        } else {
          setAppointments([]);
        }
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Lỗi khi tải dữ liệu: ' + error.message);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDoctorId = async () => {
    try {
      const userId = AuthService.getUserId();
      if (!userId) return null;
      
      const doctorProfile = await ScheduleService.getDoctorProfile(userId);
      return doctorProfile?.doctorId || null;
    } catch (error) {
      console.error('Error getting doctor ID:', error);
      return null;
    }
  };

  const refreshAppointments = async () => {
    setRefreshing(true);
    await fetchData();
  };

  // Helper function to extract searchable text from appointment
  const getSearchableText = (appointment) => {
    return [
      appointment.appointmentId || '',
      appointment.reason || '',
      appointment.patientId || '',
      appointment.status || ''
    ].join(' ').toLowerCase();
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = getSearchableText(apt).includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter.toUpperCase();
    const matchesDate = !dateFilter || apt.appointmentDate === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const config = {
      'PENDING': { 
        label: 'Chờ xác nhận', 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        icon: Clock4 
      },
      'CONFIRMED': { 
        label: 'Đã xác nhận', 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        icon: CheckCircle 
      },
      'COMPLETED': { 
        label: 'Hoàn thành', 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        icon: CheckCircle 
      },
      'CANCELLED': { 
        label: 'Đã hủy', 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        icon: XCircle 
      }
    };
    const { label, bg, text, icon: Icon } = config[status] || config.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} flex items-center gap-1`}>
        <Icon size={14} />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (appointment) => {
    // Determine priority based on status and date
    const today = new Date().toISOString().split('T')[0];
    const isToday = appointment.appointmentDate === today;
    const isPending = appointment.status === 'PENDING';
    
    if (isToday && isPending) {
      return { label: 'Cao', bg: 'bg-red-100', text: 'text-red-700' };
    } else if (isPending) {
      return { label: 'Bình thường', bg: 'bg-blue-100', text: 'text-blue-700' };
    } else {
      return { label: 'Thấp', bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  // Generic function to handle status change
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setActionLoading(`${appointmentId}-${newStatus}`);
      
      // Check if status transition is allowed
      const appointment = appointments.find(apt => apt.appointmentId === appointmentId);
      if (appointment && AppointmentService.isStatusTransitionAllowed) {
        if (!AppointmentService.isStatusTransitionAllowed(appointment.status, newStatus)) {
          alert(`Không thể chuyển từ ${AppointmentService.getStatusDisplayName?.(appointment.status) || appointment.status} sang ${AppointmentService.getStatusDisplayName?.(newStatus) || newStatus}`);
          return;
        }
      }

      await AppointmentService.changeAppointmentStatus(appointmentId, newStatus);
      
      // Show success message based on status
      const successMessages = {
        'CONFIRMED': 'Đã xác nhận lịch hẹn!',
        'COMPLETED': 'Đã đánh dấu hoàn thành lịch hẹn!',
        'CANCELLED': 'Đã hủy lịch hẹn!'
      };
      
      alert(successMessages[newStatus] || 'Đã thay đổi trạng thái lịch hẹn!');
      
      // Refresh appointments and close modal if open
      await refreshAppointments();
      if (selectedAppointment?.appointmentId === appointmentId) {
        setSelectedAppointment(null);
      }
      
    } catch (error) {
      console.error(`Error changing appointment status to ${newStatus}:`, error);
      alert(`Lỗi khi thay đổi trạng thái: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Specific handlers using the generic function
  const handleConfirmAppointment = async (appointmentId) => {
    await handleStatusChange(appointmentId, 'CONFIRMED');
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      await handleStatusChange(appointmentId, 'CANCELLED');
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    await handleStatusChange(appointmentId, 'COMPLETED');
  };

  const handleViewDetails = async (appointment) => {
    setSelectedAppointment(appointment);
    
    // Since patient info is not in API response, we'll use what we have
    // Or fetch additional info if available
    if (appointment.patientId && !patientDetails[appointment.patientId]) {
      try {
        // Try to get patient info if service exists
        if (AppointmentService.getPatientInfo) {
          const patientInfo = await AppointmentService.getPatientInfo(appointment.patientId);
          setPatientDetails(prev => ({
            ...prev,
            [appointment.patientId]: patientInfo
          }));
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
        // Set default patient info if fetch fails
        setPatientDetails(prev => ({
          ...prev,
          [appointment.patientId]: {
            id: appointment.patientId,
            name: 'Bệnh nhân',
            phone: 'Chưa cập nhật',
            email: 'Chưa cập nhật'
          }
        }));
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Remove seconds
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.appointmentDate === today && apt.status !== 'CANCELLED';
  });

  const getAppointmentStats = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    };
    return stats;
  };

  // Get available actions for appointment status
  const getAvailableActions = (appointment) => {
    const actions = [];
    
    switch (appointment.status) {
      case 'PENDING':
        actions.push(
          { 
            label: 'Xác nhận', 
            action: () => handleConfirmAppointment(appointment.appointmentId), 
            color: 'green',
            icon: CheckCircle,
            status: 'CONFIRMED'
          },
          { 
            label: 'Hủy', 
            action: () => handleCancelAppointment(appointment.appointmentId), 
            color: 'red',
            icon: XCircle,
            status: 'CANCELLED'
          }
        );
        break;
      case 'CONFIRMED':
        actions.push(
          { 
            label: 'Hoàn thành', 
            action: () => handleCompleteAppointment(appointment.appointmentId), 
            color: 'blue',
            icon: CheckCircle,
            status: 'COMPLETED'
          },
          { 
            label: 'Hủy', 
            action: () => handleCancelAppointment(appointment.appointmentId), 
            color: 'red',
            icon: XCircle,
            status: 'CANCELLED'
          }
        );
        break;
      case 'COMPLETED':
        // Không có action nào sau khi hoàn thành
        break;
      case 'CANCELLED':
        // Không có action nào sau khi hủy
        break;
      default:
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-lg">Đang tải lịch hẹn...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lịch hẹn của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý lịch hẹn khám bệnh</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshAppointments}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
          {/* <Button variant="primary">
            <Calendar size={20} className="mr-2" />
            Lịch làm việc
          </Button> */}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            <button 
              onClick={fetchData}
              className="text-sm underline hover:text-red-800 mt-1"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{getAppointmentStats().total}</p>
            <p className="text-sm text-gray-600">Tổng số</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{getAppointmentStats().pending}</p>
            <p className="text-sm text-gray-600">Chờ xác nhận</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{getAppointmentStats().confirmed}</p>
            <p className="text-sm text-gray-600">Đã xác nhận</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{getAppointmentStats().completed}</p>
            <p className="text-sm text-gray-600">Hoàn thành</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{getAppointmentStats().cancelled}</p>
            <p className="text-sm text-gray-600">Đã hủy</p>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch hẹn hôm nay</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayAppointments.map((appointment) => {
              const priority = getPriorityBadge(appointment);
              const availableActions = getAvailableActions(appointment);
              
              return (
                <div key={appointment.appointmentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">ID: {appointment.appointmentId}</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(appointment.appointmentStart)} - {formatTime(appointment.appointmentEnd)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${priority.bg} ${priority.text}`}>
                      {priority.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{appointment.reason}</p>
                  <div className="flex justify-between items-center">
                    {getStatusBadge(appointment.status)}
                    <button 
                      onClick={() => handleViewDetails(appointment)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Chi tiết
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  {availableActions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {availableActions.map((action, index) => {
                        const IconComponent = action.icon;
                        const isLoading = actionLoading === `${appointment.appointmentId}-${action.status}`;
                        
                        return (
                          <button
                            key={index}
                            onClick={action.action}
                            disabled={isLoading}
                            className={`flex-1 py-1 px-2 text-xs rounded transition-colors disabled:opacity-50
                              ${action.color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                              ${action.color === 'red' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                              ${action.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                            `}
                            title={action.label}
                          >
                            {isLoading ? (
                              <Loader size={12} className="animate-spin mx-auto" />
                            ) : (
                              <IconComponent size={12} className="mx-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, lý do khám..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('');
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Filter size={18} />
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Bệnh nhân</th>
                <th className="px-6 py-4 text-left font-semibold">Ngày giờ</th>
                <th className="px-6 py-4 text-left font-semibold">Lý do khám</th>
                <th className="px-6 py-4 text-left font-semibold">Độ ưu tiên</th>
                <th className="px-6 py-4 text-center font-semibold">Trạng thái</th>
                <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment, index) => {
                const priority = getPriorityBadge(appointment);
                const availableActions = getAvailableActions(appointment);
                
                return (
                  <tr 
                    key={appointment.appointmentId}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {appointment.appointmentId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">ID: {appointment.patientId}</p>
                          <p className="text-sm text-gray-600">Bệnh nhân</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} />
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} />
                          {formatTime(appointment.appointmentStart)} - {formatTime(appointment.appointmentEnd)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 line-clamp-2">{appointment.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${priority.bg} ${priority.text}`}>
                        {priority.label}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleViewDetails(appointment)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {availableActions.map((action, actionIndex) => {
                          const IconComponent = action.icon;
                          const isLoading = actionLoading === `${appointment.appointmentId}-${action.status}`;
                          
                          return (
                            <button 
                              key={actionIndex}
                              onClick={action.action}
                              disabled={isLoading}
                              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                ${action.color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                                ${action.color === 'red' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                                ${action.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                              `}
                              title={action.label}
                            >
                              {isLoading ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                <IconComponent size={16} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {appointments.length === 0 ? 'Chưa có lịch hẹn nào.' : 'Không tìm thấy lịch hẹn nào phù hợp với tiêu chí tìm kiếm.'}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Chi tiết lịch hẹn</h3>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bệnh nhân</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium text-gray-800">ID: {selectedAppointment.patientId}</p>
                        <p className="text-sm text-gray-600">Bệnh nhân</p>
                      </div>
                    </div>
                    {patientDetails[selectedAppointment.patientId] && (
                      <>
                        <div className="flex items-center gap-3">
                          <Phone className="text-gray-400" size={20} />
                          <span className="text-gray-700">{patientDetails[selectedAppointment.patientId].phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="text-gray-400" size={20} />
                          <span className="text-gray-700">{patientDetails[selectedAppointment.patientId].email || 'Chưa cập nhật'}</span>
                        </div>
                        {patientDetails[selectedAppointment.patientId].address && (
                          <div className="flex items-center gap-3 md:col-span-2">
                            <MapPin className="text-gray-400" size={20} />
                            <span className="text-gray-700">{patientDetails[selectedAppointment.patientId].address}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin lịch hẹn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">ID lịch hẹn</label>
                      <p className="text-gray-800">{selectedAppointment.appointmentId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Ngày khám</label>
                      <p className="text-gray-800">{formatDate(selectedAppointment.appointmentDate)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Giờ bắt đầu</label>
                      <p className="text-gray-800">{formatTime(selectedAppointment.appointmentStart)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Giờ kết thúc</label>
                      <p className="text-gray-800">{formatTime(selectedAppointment.appointmentEnd)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Lý do khám</label>
                      <p className="text-gray-800">{selectedAppointment.reason}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                      {getStatusBadge(selectedAppointment.status)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Độ ưu tiên</label>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(selectedAppointment).bg} ${getPriorityBadge(selectedAppointment).text}`}>
                        {getPriorityBadge(selectedAppointment).label}
                      </span>
                    </div>
                    {selectedAppointment.fee && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Phí khám</label>
                        <p className="text-gray-800">{selectedAppointment.fee.toLocaleString('vi-VN')} VNĐ</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                    Đóng
                  </Button>
                  {getAvailableActions(selectedAppointment).map((action, index) => {
                    const IconComponent = action.icon;
                    const isLoading = actionLoading === `${selectedAppointment.appointmentId}-${action.status}`;
                    
                    return (
                      <Button 
                        key={index}
                        variant={action.color === 'red' ? 'danger' : 'primary'}
                        onClick={action.action}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader size={18} className="animate-spin mr-2" />
                        ) : (
                          <IconComponent size={18} className="mr-2" />
                        )}
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;