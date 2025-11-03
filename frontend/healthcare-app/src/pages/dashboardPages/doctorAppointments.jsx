import React, { useState } from 'react';
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
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock4
} from 'lucide-react';
import Button from '../../components/common/button';

const DoctorAppointment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    {
      id: 'BS0000012',
      patientName: 'Nguyễn Văn A',
      patientAge: 35,
      patientGender: 'Nam',
      patientPhone: '0123 456 789',
      patientEmail: 'nguyenvana@email.com',
      patientAddress: '123 Đường ABC, Quận 1, TP.HCM',
      date: '20/11/2025',
      time: '09:00 - 09:30',
      duration: '30 phút',
      specialty: 'Tim mạch',
      reason: 'Khám tổng quát, đau ngực',
      symptoms: 'Đau ngực trái, khó thở khi vận động',
      status: 'confirmed',
      price: '300,000 VNĐ',
      priority: 'normal'
    },
    {
      id: 'BS0000013',
      patientName: 'Lê Thị C',
      patientAge: 28,
      patientGender: 'Nữ',
      patientPhone: '0987 654 321',
      patientEmail: 'lethic@email.com',
      patientAddress: '456 Đường XYZ, Quận 2, TP.HCM',
      date: '21/11/2025',
      time: '10:00 - 10:30',
      duration: '30 phút',
      specialty: 'Tim mạch',
      reason: 'Tái khám huyết áp',
      symptoms: 'Huyết áp không ổn định, chóng mặt',
      status: 'pending',
      price: '200,000 VNĐ',
      priority: 'high'
    },
    {
      id: 'BS0000014',
      patientName: 'Hoàng Văn E',
      patientAge: 45,
      patientGender: 'Nam',
      patientPhone: '0901 234 567',
      patientEmail: 'hoangvane@email.com',
      patientAddress: '789 Đường DEF, Quận 3, TP.HCM',
      date: '18/11/2025',
      time: '14:00 - 14:45',
      duration: '45 phút',
      specialty: 'Tim mạch',
      reason: 'Theo dõi sau phẫu thuật',
      symptoms: 'Ổn định, cần theo dõi định kỳ',
      status: 'completed',
      price: '250,000 VNĐ',
      priority: 'normal'
    },
    {
      id: 'BS0000015',
      patientName: 'Trần Thị G',
      patientAge: 52,
      patientGender: 'Nữ',
      patientPhone: '0912 345 678',
      patientEmail: 'tranthig@email.com',
      patientAddress: '321 Đường GHI, Quận 5, TP.HCM',
      date: '19/11/2025',
      time: '15:00 - 15:30',
      duration: '30 phút',
      specialty: 'Tim mạch',
      reason: 'Tư vấn dinh dưỡng',
      symptoms: 'Thừa cân, cholesterol cao',
      status: 'cancelled',
      price: '400,000 VNĐ',
      priority: 'low'
    },
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { 
        label: 'Chờ xác nhận', 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        icon: Clock4 
      },
      confirmed: { 
        label: 'Đã xác nhận', 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        icon: CheckCircle 
      },
      completed: { 
        label: 'Hoàn thành', 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        icon: CheckCircle 
      },
      cancelled: { 
        label: 'Đã hủy', 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        icon: XCircle 
      }
    };
    const { label, bg, text, icon: Icon } = config[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} flex items-center gap-1`}>
        <Icon size={14} />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      high: { label: 'Cao', bg: 'bg-red-100', text: 'text-red-700' },
      normal: { label: 'Bình thường', bg: 'bg-blue-100', text: 'text-blue-700' },
      low: { label: 'Thấp', bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    const { label, bg, text } = config[priority];
    return <span className={`px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>{label}</span>;
  };

  const handleConfirmAppointment = (appointmentId) => {
    console.log('Confirm appointment:', appointmentId);
    alert('Đã xác nhận lịch hẹn!');
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      console.log('Cancel appointment:', appointmentId);
      alert('Đã hủy lịch hẹn!');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const todayAppointments = appointments.filter(apt => apt.date === '20/11/2025');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lịch hẹn của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý lịch hẹn khám bệnh</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary">
            <Calendar size={20} className="mr-2" />
            Lịch làm việc
          </Button>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch hẹn hôm nay</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{appointment.patientName}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
                {getPriorityBadge(appointment.priority)}
              </div>
              <p className="text-sm text-gray-700 mb-2">{appointment.reason}</p>
              <div className="flex justify-between items-center">
                {getStatusBadge(appointment.status)}
                <button 
                  onClick={() => handleViewDetails(appointment)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên bệnh nhân..."
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
              {filteredAppointments.map((appointment, index) => (
                <tr 
                  key={appointment.id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">{appointment.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.patientAge} tuổi</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} />
                        {appointment.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{appointment.reason}</p>
                    <p className="text-sm text-gray-600 mt-1">{appointment.symptoms}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getPriorityBadge(appointment.priority)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleViewDetails(appointment)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {appointment.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Xác nhận"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            title="Hủy lịch"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy lịch hẹn nào phù hợp với tiêu chí tìm kiếm.
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
                        <p className="font-medium text-gray-800">{selectedAppointment.patientName}</p>
                        <p className="text-sm text-gray-600">{selectedAppointment.patientAge} tuổi, {selectedAppointment.patientGender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <span className="text-gray-700">{selectedAppointment.patientPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <span className="text-gray-700">{selectedAppointment.patientEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gray-400" size={20} />
                      <span className="text-gray-700">{selectedAppointment.patientAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin lịch hẹn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Ngày khám</label>
                      <p className="text-gray-800">{selectedAppointment.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Giờ khám</label>
                      <p className="text-gray-800">{selectedAppointment.time}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Lý do khám</label>
                      <p className="text-gray-800">{selectedAppointment.reason}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Triệu chứng</label>
                      <p className="text-gray-800">{selectedAppointment.symptoms}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                      {getStatusBadge(selectedAppointment.status)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Độ ưu tiên</label>
                      {getPriorityBadge(selectedAppointment.priority)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                    Đóng
                  </Button>
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <Button variant="primary" onClick={() => handleConfirmAppointment(selectedAppointment.id)}>
                        <CheckCircle size={18} className="mr-2" />
                        Xác nhận lịch hẹn
                      </Button>
                      <Button variant="danger" onClick={() => handleCancelAppointment(selectedAppointment.id)}>
                        <XCircle size={18} className="mr-2" />
                        Hủy lịch hẹn
                      </Button>
                    </>
                  )}
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