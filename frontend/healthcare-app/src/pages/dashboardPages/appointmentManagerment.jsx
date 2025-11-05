import React, { useState } from 'react';
import { Search, Plus, Calendar, Clock, User, Filter, Edit, Trash2, Eye } from 'lucide-react';
import Button from '../../components/common/button';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const appointments = [
    {
      id: 'BS0000012',
      patientName: 'Nguyễn Văn A',
      doctorName: 'Dr. Trần Thị B',
      date: '20/11/2025',
      time: '09:00 - 09:30',
      specialty: 'Tim mạch',
      reason: 'Khám tổng quát',
      status: 'confirmed',
      price: '300,000 VNĐ'
    },
    {
      id: 'BS0000013',
      patientName: 'Lê Thị C',
      doctorName: 'Dr. Phạm Văn D',
      date: '21/11/2025',
      time: '10:00 - 10:30',
      specialty: 'Nhi khoa',
      reason: 'Tiêm phòng',
      status: 'pending',
      price: '200,000 VNĐ'
    },
    {
      id: 'BS0000014',
      patientName: 'Hoàng Văn E',
      doctorName: 'Dr. Nguyễn F',
      date: '18/11/2025',
      time: '14:00 - 14:30',
      specialty: 'Da liễu',
      reason: 'Tái khám',
      status: 'completed',
      price: '250,000 VNĐ'
    },
    {
      id: 'BS0000015',
      patientName: 'Trần Thị G',
      doctorName: 'Dr. Lê H',
      date: '19/11/2025',
      time: '15:00 - 15:30',
      specialty: 'Thần kinh',
      reason: 'Tư vấn',
      status: 'cancelled',
      price: '400,000 VNĐ'
    },
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Chờ xác nhận', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
      confirmed: { label: 'Đã xác nhận', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      completed: { label: 'Hoàn thành', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
      cancelled: { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
    };
    const { label, bg, text } = config[status];
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>{label}</span>;
  };

  const handleEdit = (appointmentId) => {
    console.log('Edit appointment:', appointmentId);
    // Implement edit functionality
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      console.log('Delete appointment:', appointmentId);
      // Implement delete functionality
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý lịch hẹn</h1>
        <Button variant="primary" onClick={handleCreateAppointment}>
          <Plus size={20} className="mr-2" />
          Tạo lịch hẹn mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Tổng lịch hẹn</p>
          <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Chờ xác nhận</p>
          <p className="text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Đã xác nhận</p>
          <p className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Hoàn thành</p>
          <p className="text-2xl font-bold text-blue-600">
            {appointments.filter(a => a.status === 'completed').length}
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
              placeholder="Tìm kiếm theo ID, tên bệnh nhân, tên bác sĩ..."
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
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy lịch hẹn nào phù hợp với tiêu chí tìm kiếm.
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
                {filteredAppointments.map((appointment, index) => (
                  <tr 
                    key={appointment.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">{appointment.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-gray-400" />
                        <span className="font-medium text-gray-800">{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{appointment.doctorName}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {appointment.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} />
                        {appointment.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} />
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate" title={appointment.reason}>
                      {appointment.reason}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{appointment.price}</td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleView(appointment.id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(appointment.id)}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(appointment.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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