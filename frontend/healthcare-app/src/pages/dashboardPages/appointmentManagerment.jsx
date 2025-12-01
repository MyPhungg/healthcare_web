import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, Filter, Edit, Trash2, Eye, Loader, RefreshCw, CheckCircle, XCircle, PlayCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/common/button';
import AppointmentService from '../../service/appointmentService';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      setUseMockData(false);
      
      const appointmentsData = await AppointmentService.getAllAppointments();
      console.log('Fetched appointments:', appointmentsData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('API Error:', err);
      
      // Fallback to mock data if API fails
      setError('Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu để hiển thị.');
      setUseMockData(true);
      const mockAppointments = AppointmentService.getMockAppointments();
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      AppointmentService.formatStatus(apt.status) === statusFilter;
    
    const matchesDate = !dateFilter || 
      apt.appointmentDate?.includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const formattedStatus = AppointmentService.formatStatus(status);
    const config = {
      pending: { 
        label: AppointmentService.getStatusDisplayName(status), 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700',
        icon: Clock
      },
      confirmed: { 
        label: AppointmentService.getStatusDisplayName(status), 
        bg: 'bg-green-100', 
        text: 'text-green-700',
        icon: CheckCircle
      },
      completed: { 
        label: AppointmentService.getStatusDisplayName(status), 
        bg: 'bg-blue-100', 
        text: 'text-blue-700',
        icon: PlayCircle
      },
      cancelled: { 
        label: AppointmentService.getStatusDisplayName(status), 
        bg: 'bg-red-100', 
        text: 'text-red-700',
        icon: XCircle
      }
    };
    
    const { label, bg, text, icon: Icon } = config[formattedStatus] || { 
      label: status, 
      bg: 'bg-gray-100', 
      text: 'text-gray-700',
      icon: Clock
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${bg} ${text}`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  // Handle status change
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setActionLoading(`${appointmentId}-${newStatus}`);
      
      // Check if status transition is allowed
      const appointment = appointments.find(apt => apt.appointmentId === appointmentId);
      if (appointment && !AppointmentService.isStatusTransitionAllowed(appointment.status, newStatus)) {
        alert(`Không thể chuyển từ ${AppointmentService.getStatusDisplayName(appointment.status)} sang ${AppointmentService.getStatusDisplayName(newStatus)}`);
        return;
      }

      if (useMockData) {
        // If using mock data, update locally
        setAppointments(prev => 
          prev.map(apt => 
            apt.appointmentId === appointmentId 
              ? { ...apt, status: newStatus }
              : apt
          )
        );
      } else {
        // Call API to change status
        await AppointmentService.changeAppointmentStatus(appointmentId, newStatus);
        await fetchAppointments(); // Refresh data
      }
      
      console.log(`Appointment ${appointmentId} status changed to: ${newStatus}`);
    } catch (err) {
      setError(`Không thể thay đổi trạng thái: ${err.message}`);
      console.error('Error changing appointment status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (appointmentId) => {
    console.log('Edit appointment:', appointmentId);
    // Implement edit functionality
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      await handleStatusChange(appointmentId, 'CANCELLED');
    }
  };

  const handleView = (appointmentId) => {
    console.log('View appointment:', appointmentId);
    // Implement view functionality
  };

  const handleCreateAppointment = () => {
    console.log('Create new appointment');
    // Implement create functionality
  };

  // Get available actions for appointment status
  const getAvailableActions = (appointment) => {
    const actions = [];
    
    switch (appointment.status) {
      case 'PENDING':
        actions.push(
          { 
            label: 'Xác nhận', 
            action: () => handleStatusChange(appointment.appointmentId, 'CONFIRMED'), 
            color: 'green',
            icon: CheckCircle
          },
          { 
            label: 'Hủy', 
            action: () => handleStatusChange(appointment.appointmentId, 'CANCELLED'), 
            color: 'red',
            icon: XCircle
          }
        );
        break;
      case 'CONFIRMED':
        actions.push(
          { 
            label: 'Hoàn thành', 
            action: () => handleStatusChange(appointment.appointmentId, 'COMPLETED'), 
            color: 'blue',
            icon: PlayCircle
          },
          { 
            label: 'Hủy', 
            action: () => handleStatusChange(appointment.appointmentId, 'CANCELLED'), 
            color: 'red',
            icon: XCircle
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
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải danh sách lịch hẹn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">Quản lý lịch hẹn</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Quản lý và theo dõi tất cả lịch hẹn trong hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={fetchAppointments}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw size={18} />
            <span className="whitespace-nowrap">Làm mới</span>
          </button>
          <Button variant="primary" onClick={handleCreateAppointment} className="text-sm sm:text-base">
            <Plus size={18} className="mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">Tạo lịch hẹn</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3 text-sm sm:text-base">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium break-words">{error}</p>
            {useMockData && (
              <p className="text-sm mt-1">
                Dữ liệu đang được hiển thị từ bộ nhớ tạm. Thao tác sẽ không được lưu lại.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Tổng lịch hẹn</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Chờ xác nhận</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Đã xác nhận</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Hoàn thành</p>
          <p className="text-xl sm:text-2-2xl font-bold text-blue-600">
            {appointments.filter(a => a.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên bệnh nhân, tên bác sĩ, lý do..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
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
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
          />
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('');
            }}
            className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <Filter size={16} />
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Search className="text-gray-400" size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch hẹn</h3>
            <p className="text-gray-500 text-sm sm:text-base">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">ID</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Bệnh nhân</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Bác sĩ</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Ngày giờ</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm">Lý do</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold text-xs sm:text-sm">Giá khám</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold text-xs sm:text-sm">Trạng thái</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold text-xs sm:text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => {
                  const timeDisplay = `${AppointmentService.formatTime(appointment.appointmentStart)} - ${AppointmentService.formatTime(appointment.appointmentEnd)}`;
                  const priceDisplay = appointment.totalPrice ? `${appointment.totalPrice.toLocaleString('vi-VN')} VNĐ` : 'Chưa cập nhật';
                  const availableActions = getAvailableActions(appointment);
                  
                  return (
                    <tr 
                      key={appointment.appointmentId}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-3 sm:px-4 py-3 font-semibold text-gray-800 text-xs sm:text-sm">
                        <div className="max-w-[80px] sm:max-w-none truncate" title={appointment.appointmentId}>
                          {appointment.appointmentId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <User size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-800 text-xs sm:text-sm truncate" title={appointment.patientName}>
                            {appointment.patientName || 'Chưa cập nhật'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-gray-700 text-xs sm:text-sm truncate max-w-[120px]" title={appointment.doctorName}>
                        {appointment.doctorName || 'Chưa cập nhật'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Calendar size={12} />
                            <span>{AppointmentService.formatDate(appointment.appointmentDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={12} />
                            <span>{timeDisplay}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-gray-700 text-xs sm:text-sm max-w-[150px]">
                        <div className="truncate" title={appointment.reason}>
                          {appointment.reason || 'Không có'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 font-semibold text-blue-600 text-xs sm:text-sm text-center">
                        {priceDisplay}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex justify-center">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          <button 
                            onClick={() => handleView(appointment.appointmentId)}
                            className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={14} />
                          </button>
                          
                          {availableActions.map((action, actionIndex) => {
                            const IconComponent = action.icon;
                            const isLoading = actionLoading === `${appointment.appointmentId}-${action.label}`;
                            const colorClass = `bg-${action.color}-500 hover:bg-${action.color}-600`;
                            
                            return (
                              <button 
                                key={actionIndex}
                                onClick={action.action}
                                disabled={isLoading}
                                className={`p-1.5 sm:p-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
                                title={action.label}
                              >
                                {isLoading ? (
                                  <Loader size={14} className="animate-spin" />
                                ) : (
                                  <IconComponent size={14} />
                                )}
                              </button>
                            );
                          })}
                          
                          {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                            <button 
                              onClick={() => handleDelete(appointment.appointmentId)}
                              disabled={actionLoading}
                              className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Hủy lịch"
                            >
                              {actionLoading ? (
                                <Loader size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600 text-center sm:text-left">
        Hiển thị {filteredAppointments.length} trong tổng số {appointments.length} lịch hẹn
      </div>
    </div>
  );
};

export default AppointmentManagement;