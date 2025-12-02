import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Calendar, Clock, User, Filter, Edit, Trash2, Eye, Loader, RefreshCw, CheckCircle, XCircle, PlayCircle, AlertCircle, Phone, Mail, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      setUseMockData(false);
      setCurrentPage(1); // Reset to first page when fetching new data
      
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
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = 
        apt.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.appointment?.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.appointment?.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.user?.phone?.includes(searchTerm) ||
        apt.doctor?.user?.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        AppointmentService.formatStatus(apt.appointment?.status) === statusFilter;
      
      const matchesDate = !dateFilter || 
        apt.appointment?.appointmentDate?.includes(dateFilter);
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

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
      const appointment = appointments.find(apt => apt.appointment?.appointmentId === appointmentId);
      if (appointment && !AppointmentService.isStatusTransitionAllowed(appointment.appointment.status, newStatus)) {
        alert(`Không thể chuyển từ ${AppointmentService.getStatusDisplayName(appointment.appointment.status)} sang ${AppointmentService.getStatusDisplayName(newStatus)}`);
        return;
      }

      if (useMockData) {
        // If using mock data, update locally
        setAppointments(prev => 
          prev.map(apt => 
            apt.appointment?.appointmentId === appointmentId 
              ? { 
                  ...apt, 
                  appointment: { ...apt.appointment, status: newStatus } 
                }
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

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      await handleStatusChange(appointmentId, 'CANCELLED');
    }
  };

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleCreateAppointment = () => {
    console.log('Create new appointment');
    // Implement create functionality
  };

  // Get available actions for appointment status
  const getAvailableActions = (appointment) => {
    const actions = [];
    const status = appointment?.appointment?.status;
    
    switch (status) {
      case 'PENDING':
        actions.push(
          { 
            label: 'Xác nhận', 
            action: () => handleStatusChange(appointment.appointment.appointmentId, 'CONFIRMED'), 
            color: 'green',
            icon: CheckCircle
          },
          { 
            label: 'Hủy', 
            action: () => handleStatusChange(appointment.appointment.appointmentId, 'CANCELLED'), 
            color: 'red',
            icon: XCircle
          }
        );
        break;
      case 'CONFIRMED':
        actions.push(
          { 
            label: 'Hoàn thành', 
            action: () => handleStatusChange(appointment.appointment.appointmentId, 'COMPLETED'), 
            color: 'blue',
            icon: PlayCircle
          },
          { 
            label: 'Hủy', 
            action: () => handleStatusChange(appointment.appointment.appointmentId, 'CANCELLED'), 
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

  // Format display name with gender
  const formatDisplayName = (person) => {
    if (!person) return 'N/A';
    
    const gender = person.gender === 'MALE' ? 'Anh' : 'Chị';
    return `${gender} ${person.fullName}`;
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Detail Modal Component
  const DetailModal = ({ appointment, onClose }) => {
    if (!appointment) return null;

    const { appointment: apt, doctor, patient, fee } = appointment;
    const timeDisplay = `${AppointmentService.formatTime(apt.appointmentStart)} - ${AppointmentService.formatTime(apt.appointmentEnd)}`;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Chi tiết lịch hẹn</h2>
              <p className="text-blue-100 text-sm">ID: {apt.appointmentId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Thông tin chung */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Calendar size={18} />
                    Thông tin lịch hẹn
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày:</span>
                      <span className="font-semibold">{AppointmentService.formatDate(apt.appointmentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giờ:</span>
                      <span className="font-semibold">{timeDisplay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lý do:</span>
                      <span className="font-semibold text-right">{apt.reason || 'Không có'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí khám:</span>
                      <span className="font-bold text-blue-600">{fee?.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bác sĩ */}
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <User size={18} />
                    Thông tin bác sĩ
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-semibold">{formatDisplayName(doctor)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chuyên khoa:</span>
                      <span className="font-semibold">{doctor.specialityId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phòng khám:</span>
                      <span className="font-semibold">{doctor.clinicName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-semibold">{doctor.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold">{doctor.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-semibold text-right">
                        {`${doctor.address}, ${doctor.district}, ${doctor.city}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bệnh nhân */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                <User size={18} />
                Thông tin bệnh nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="font-semibold">{formatDisplayName(patient)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày sinh:</span>
                    <span className="font-semibold">{AppointmentService.formatDate(patient.dateOfBirth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giới tính:</span>
                    <span className="font-semibold">{patient.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-semibold">{patient.user?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{patient.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số BHYT:</span>
                    <span className="font-semibold">{patient.insuranceNum || 'Không có'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-semibold text-right">
                    {`${patient.address}, ${patient.district}, ${patient.city}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Lịch sử tương tác */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Lịch sử tương tác</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạo lúc:</span>
                  <span className="font-semibold">
                    {new Date(apt.interactedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Người tạo:</span>
                  <span className="font-semibold">Hệ thống</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            {getAvailableActions(appointment).length > 0 && (
              <div className="flex gap-2">
                {getAvailableActions(appointment).map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`px-4 py-2 text-white bg-${action.color}-500 hover:bg-${action.color}-600 rounded-lg transition-colors flex items-center gap-2`}
                    >
                      <IconComponent size={16} />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
          {/* <Button variant="primary" onClick={handleCreateAppointment} className="text-sm sm:text-base">
            <Plus size={18} className="mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">Tạo lịch hẹn</span>
          </Button> */}
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
            {appointments.filter(a => a.appointment?.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Đã xác nhận</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {appointments.filter(a => a.appointment?.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Hoàn thành</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {appointments.filter(a => a.appointment?.status === 'COMPLETED').length}
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
              placeholder="Tìm kiếm theo ID, tên bệnh nhân, tên bác sĩ, lý do, số điện thoại..."
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

      {/* Pagination Controls - Top */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="5">5 lịch hẹn/trang</option>
            <option value="10">10 lịch hẹn/trang</option>
            <option value="20">20 lịch hẹn/trang</option>
            <option value="50">50 lịch hẹn/trang</option>
          </select>
          <span className="text-sm text-gray-600">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)} trong tổng số {filteredAppointments.length} lịch hẹn
          </span>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              title="Trang đầu"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              title="Trang trước"
            >
              <ChevronLeft size={16} />
            </button>
            
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] h-10 rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              title="Trang sau"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              title="Trang cuối"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {currentAppointments.length === 0 ? (
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
                {currentAppointments.map((appointment, index) => {
                  const { appointment: apt, doctor, patient, fee } = appointment;
                  const timeDisplay = `${AppointmentService.formatTime(apt.appointmentStart)} - ${AppointmentService.formatTime(apt.appointmentEnd)}`;
                  const availableActions = getAvailableActions(appointment);
                  
                  return (
                    <tr 
                      key={apt.appointmentId}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-3 sm:px-4 py-3 font-semibold text-gray-800 text-xs sm:text-sm">
                        <div className="max-w-[80px] sm:max-w-none truncate" title={apt.appointmentId}>
                          {apt.appointmentId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-gray-800 text-xs sm:text-sm truncate" title={patient.fullName}>
                              {patient.fullName || 'Chưa cập nhật'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={patient.user?.phone}>
                            <Phone size={10} className="inline mr-1" />
                            {patient.user?.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="min-w-0">
                          <div className="text-gray-700 text-xs sm:text-sm font-medium truncate mb-1" title={doctor.fullName}>
                            {doctor.fullName || 'Chưa cập nhật'}
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={doctor.clinicName}>
                            <MapPin size={10} className="inline mr-1" />
                            {doctor.clinicName || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Calendar size={12} />
                            <span>{AppointmentService.formatDate(apt.appointmentDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={12} />
                            <span>{timeDisplay}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-gray-700 text-xs sm:text-sm max-w-[150px]">
                        <div className="truncate" title={apt.reason}>
                          {apt.reason || 'Không có'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 font-semibold text-blue-600 text-xs sm:text-sm text-center">
                        {fee ? `${fee.toLocaleString('vi-VN')} VNĐ` : 'Chưa cập nhật'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex justify-center">
                          {getStatusBadge(apt.status)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          <button 
                            onClick={() => handleViewDetail(appointment)}
                            className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={14} />
                          </button>
                          
                          {availableActions.map((action, actionIndex) => {
                            const IconComponent = action.icon;
                            const isLoading = actionLoading === `${apt.appointmentId}-${action.label}`;
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
                          
                          {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                            <button 
                              onClick={() => handleDelete(apt.appointmentId)}
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

      {/* Pagination Controls - Bottom */}
      {filteredAppointments.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm text-gray-600">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)} trong tổng số {filteredAppointments.length} lịch hẹn
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                title="Trang đầu"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                title="Trang trước"
              >
                <ChevronLeft size={16} />
              </button>
              
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] h-10 rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                title="Trang sau"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                title="Trang cuối"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <DetailModal 
          appointment={selectedAppointment} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </div>
  );
};

export default AppointmentManagement;