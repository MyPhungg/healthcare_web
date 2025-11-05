import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Eye,
  MessageCircle,
  Plus,
  Stethoscope,
  Activity,
  Clock
} from 'lucide-react';
import Button from '../../components/common/button';

const DoctorPatient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    {
      id: 'BN0000123',
      name: 'Nguyễn Văn A',
      age: 35,
      gender: 'Nam',
      phone: '0123 456 789',
      email: 'nguyenvana@email.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      bloodType: 'A+',
      height: '175 cm',
      weight: '70 kg',
      lastVisit: '15/11/2025',
      nextAppointment: '20/11/2025',
      status: 'active',
      conditions: ['Cao huyết áp', 'Tim mạch'],
      medications: ['Aspirin', 'Metoprolol'],
      allergies: ['Penicillin'],
      totalVisits: 12,
      notes: 'Bệnh nhân cần theo dõi huyết áp hàng ngày'
    },
    {
      id: 'BN0000124',
      name: 'Lê Thị C',
      age: 28,
      gender: 'Nữ',
      phone: '0987 654 321',
      email: 'lethic@email.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      bloodType: 'O+',
      height: '162 cm',
      weight: '55 kg',
      lastVisit: '10/11/2025',
      nextAppointment: '21/11/2025',
      status: 'active',
      conditions: ['Rối loạn nhịp tim'],
      medications: ['Amiodarone'],
      allergies: ['Không'],
      totalVisits: 8,
      notes: 'Theo dõi nhịp tim định kỳ'
    },
    {
      id: 'BN0000125',
      name: 'Hoàng Văn E',
      age: 45,
      gender: 'Nam',
      phone: '0901 234 567',
      email: 'hoangvane@email.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      bloodType: 'B+',
      height: '180 cm',
      weight: '85 kg',
      lastVisit: '05/11/2025',
      nextAppointment: 'Không',
      status: 'inactive',
      conditions: ['Sau phẫu thuật tim'],
      medications: ['Warfarin', 'Lisinopril'],
      allergies: ['Ibuprofen'],
      totalVisits: 25,
      notes: 'Ổn định sau phẫu thuật, cần tái khám 6 tháng'
    },
    {
      id: 'BN0000126',
      name: 'Trần Thị G',
      age: 52,
      gender: 'Nữ',
      phone: '0912 345 678',
      email: 'tranthig@email.com',
      address: '321 Đường GHI, Quận 5, TP.HCM',
      bloodType: 'AB+',
      height: '158 cm',
      weight: '68 kg',
      lastVisit: '01/11/2025',
      nextAppointment: 'Không',
      status: 'inactive',
      conditions: ['Mỡ máu cao', 'Tiểu đường type 2'],
      medications: ['Metformin', 'Atorvastatin'],
      allergies: ['Sulfa'],
      totalVisits: 15,
      notes: 'Cần kiểm soát chế độ ăn và đường huyết'
    },
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Đang điều trị', bg: 'bg-green-100', text: 'text-green-700' },
      inactive: { label: 'Ngừng điều trị', bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    const { label, bg, text } = config[status];
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>{label}</span>;
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCreateAppointment = (patientId) => {
    console.log('Create appointment for:', patientId);
    alert('Tạo lịch hẹn mới cho bệnh nhân!');
  };

  const handleSendMessage = (patientId) => {
    console.log('Send message to:', patientId);
    alert('Gửi tin nhắn cho bệnh nhân!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bệnh nhân của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin bệnh nhân</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary">
            <Plus size={20} className="mr-2" />
            Thêm bệnh nhân
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng bệnh nhân</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{patients.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang điều trị</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {patients.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lượt khám T11</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">24</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Stethoscope className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khám hôm nay</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên, số điện thoại..."
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
            <option value="active">Đang điều trị</option>
            <option value="inactive">Ngừng điều trị</option>
          </select>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Filter size={18} />
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Patient Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.age} tuổi, {patient.gender}</p>
                  </div>
                </div>
                {getStatusBadge(patient.status)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} />
                  {patient.email}
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-500 font-medium">Mã BN</label>
                  <p className="text-gray-800 font-semibold">{patient.id}</p>
                </div>
                <div>
                  <label className="block text-gray-500 font-medium">Nhóm máu</label>
                  <p className="text-gray-800">{patient.bloodType}</p>
                </div>
                <div>
                  <label className="block text-gray-500 font-medium">Lượt khám</label>
                  <p className="text-gray-800">{patient.totalVisits}</p>
                </div>
                <div>
                  <label className="block text-gray-500 font-medium">Khám gần nhất</label>
                  <p className="text-gray-800">{patient.lastVisit}</p>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-gray-500 font-medium text-sm mb-2">Chẩn đoán</label>
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.map((condition, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => handleViewDetails(patient)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Chi tiết
                </button>
                <button 
                  onClick={() => handleCreateAppointment(patient.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Lịch hẹn
                </button>
                <button 
                  onClick={() => handleSendMessage(patient.id)}
                  className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  title="Nhắn tin"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy bệnh nhân</h3>
          <p className="text-gray-500">Không có bệnh nhân nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Hồ sơ bệnh nhân</h3>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Thông tin cá nhân</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Họ tên:</span>
                        <span className="font-medium">{selectedPatient.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Tuổi/Giới tính:</span>
                        <span className="font-medium">{selectedPatient.age} tuổi, {selectedPatient.gender}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Số điện thoại:</span>
                        <span className="font-medium">{selectedPatient.phone}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedPatient.email}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Địa chỉ:</span>
                        <span className="font-medium text-right">{selectedPatient.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Thông tin y tế</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Nhóm máu:</span>
                        <span className="font-medium">{selectedPatient.bloodType}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Chiều cao/Cân nặng:</span>
                        <span className="font-medium">{selectedPatient.height} / {selectedPatient.weight}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Lượt khám:</span>
                        <span className="font-medium">{selectedPatient.totalVisits}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Khám gần nhất:</span>
                        <span className="font-medium">{selectedPatient.lastVisit}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Trạng thái:</span>
                        {getStatusBadge(selectedPatient.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Chẩn đoán</h4>
                    <div className="space-y-2">
                      {selectedPatient.conditions.map((condition, index) => (
                        <div key={index} className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Thuốc đang dùng</h4>
                    <div className="space-y-2">
                      {selectedPatient.medications.map((med, index) => (
                        <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                          {med}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Dị ứng</h4>
                    <div className="space-y-2">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <div key={index} className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg text-sm">
                          {allergy}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Ghi chú</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedPatient.notes}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                    Đóng
                  </Button>
                  <Button variant="primary" onClick={() => handleCreateAppointment(selectedPatient.id)}>
                    <Calendar size={18} className="mr-2" />
                    Tạo lịch hẹn
                  </Button>
                  <Button variant="secondary" onClick={() => handleSendMessage(selectedPatient.id)}>
                    <MessageCircle size={18} className="mr-2" />
                    Nhắn tin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatient;