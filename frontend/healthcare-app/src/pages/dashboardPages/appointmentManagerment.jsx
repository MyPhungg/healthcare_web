import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, Filter, Edit, Trash2, Eye, Loader, RefreshCw, AlertCircle } from 'lucide-react';
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
      AppointmentService.formatDate(apt.appointmentDate) === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const formattedStatus = AppointmentService.formatStatus(status);
    const config = {
      pending: { label: 'Chờ xác nhận', bg: 'bg-yellow-100', text: 'text-yellow-700' },
      confirmed: { label: 'Đã xác nhận', bg: 'bg-green-100', text: 'text-green-700' },
      completed: { label: 'Hoàn thành', bg: 'bg-blue-100', text: 'text-blue-700' },
      cancelled: { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-700' }
    };
    
    const { label, bg, text } = config[formattedStatus] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700' };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>{label}</span>;
  };

  const handleEdit = async (appointmentId) => {
    console.log('Edit appointment:', appointmentId);
    // Implement edit functionality
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      try {
        setActionLoading(appointmentId);
        
        if (useMockData) {
          // If using mock data, just remove from frontend
          setAppointments(prev => prev.filter(apt => apt.appointmentId !== appointmentId));
        } else {
          // Call API to cancel appointment
          await AppointmentService.cancelAppointment(appointmentId);
          await fetchAppointments();
        }
        
        console.log('Appointment cancelled:', appointmentId);
      } catch (err) {
        setError('Không thể hủy lịch hẹn. Vui lòng thử lại.');
        console.error('Error cancelling appointment:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleView = (appointmentId) => {
    console.log('View appointment:', appointmentId);
    // Implement view functionality
  };

  const handleConfirm = async (appointmentId) => {
    try {
      setActionLoading(appointmentId);
      await AppointmentService.confirmAppointment(appointmentId);
      await fetchAppointments();
      console.log('Appointment confirmed:', appointmentId);
    } catch (err) {
      setError('Không thể xác nhận lịch hẹn. Vui lòng thử lại.');
      console.error('Error confirming appointment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      setActionLoading(appointmentId);
      await AppointmentService.completeAppointment(appointmentId);
      await fetchAppointments();
      console.log('Appointment completed:', appointmentId);
    } catch (err) {
      setError('Không thể đánh dấu hoàn thành. Vui lòng thử lại.');
      console.error('Error completing appointment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateAppointment = () => {
    console.log('Create new appointment');
    // Implement create functionality
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải danh sách lịch hẹn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý lịch hẹn</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả lịch hẹn trong hệ thống</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} />
            Làm mới
          </button>
          <Button variant="primary" onClick={handleCreateAppointment}>
            <Plus size={20} className="mr-2" />
            Tạo lịch hẹn mới
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            {useMockData && (
              <p className="text-sm mt-1">
                Dữ liệu đang được hiển thị từ bộ nhớ tạm. Thao tác sẽ không được lưu lại.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Tổng lịch hẹn</p>
          <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Chờ xác nhận</p>
          <p className="text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Đã xác nhận</p>
          <p className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Hoàn thành</p>
          <p className="text-2xl font-bold text-blue-600">
            {appointments.filter(a => a.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên bệnh nhân, tên bác sĩ, lý do..."
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
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch hẹn</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Bệnh nhân</th>
                  <th className="px-6 py-4 text-left font-semibold">Bác sĩ</th>
                  <th className="px-6 py-4 text-left font-semibold">Chuyên khoa</th>
                  <th className="px-6 py-4 text-left font-semibold">Ngày khám</th>
                  <th className="px-6 py-4 text-left font-semibold">Giờ khám</th>
                  <th className="px-6 py-4 text-left font-semibold">Lý do</th>
                  <th className="px-6 py-4 text-left font-semibold">Giá khám</th>
                  <th className="px-6 py-4 text-center font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => {
                  const timeDisplay = `${AppointmentService.formatTime(appointment.appointmentStart)} - ${AppointmentService.formatTime(appointment.appointmentEnd)}`;
                  const priceDisplay = appointment.totalPrice ? `${appointment.totalPrice.toLocaleString('vi-VN')} VNĐ` : 'Chưa cập nhật';
                  
                  return (
                    <tr 
                      key={appointment.appointmentId}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {appointment.appointmentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={18} className="text-gray-400" />
                          <span className="font-medium text-gray-800">
                            {appointment.patientName || 'Chưa cập nhật'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {appointment.doctorName || 'Chưa cập nhật'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {appointment.specialty || 'Chưa cập nhật'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} />
                          {AppointmentService.formatDate(appointment.appointmentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} />
                          {timeDisplay}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate" title={appointment.reason}>
                        {appointment.reason || 'Không có'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {priceDisplay}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleView(appointment.appointmentId)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          {appointment.status === 'PENDING' && (
                            <button 
                              onClick={() => handleConfirm(appointment.appointmentId)}
                              disabled={actionLoading === appointment.appointmentId}
                              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Xác nhận"
                            >
                              {actionLoading === appointment.appointmentId ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                '✓'
                              )}
                            </button>
                          )}
                          {appointment.status === 'CONFIRMED' && (
                            <button 
                              onClick={() => handleComplete(appointment.appointmentId)}
                              disabled={actionLoading === appointment.appointmentId}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Hoàn thành"
                            >
                              {actionLoading === appointment.appointmentId ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                '✓'
                              )}
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(appointment.appointmentId)}
                            disabled={actionLoading === appointment.appointmentId}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Hủy lịch"
                          >
                            {actionLoading === appointment.appointmentId ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
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
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị {filteredAppointments.length} trong tổng số {appointments.length} lịch hẹn
      </div>
    </div>
  );
};

export default AppointmentManagement;