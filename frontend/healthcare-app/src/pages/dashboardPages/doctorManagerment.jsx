import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone } from 'lucide-react';
import Button from '../../components/common/button';

const DoctorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Nguyễn Văn A',
      email: 'nguyenvana@hospital.com',
      phone: '0901234567',
      specialty: 'Tim mạch',
      experience: '10 năm',
      patients: 156,
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Trần Thị B',
      email: 'tranthib@hospital.com',
      phone: '0902345678',
      specialty: 'Nhi khoa',
      experience: '8 năm',
      patients: 203,
      status: 'active'
    },
    {
      id: 3,
      name: 'Dr. Lê Văn C',
      email: 'levanc@hospital.com',
      phone: '0903456789',
      specialty: 'Da liễu',
      experience: '12 năm',
      patients: 189,
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Dr. Phạm Thị D',
      email: 'phamthid@hospital.com',
      phone: '0904567890',
      specialty: 'Thần kinh',
      experience: '15 năm',
      patients: 234,
      status: 'active'
    },
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý bác sĩ</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Thêm bác sĩ mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="">Tất cả chuyên khoa</option>
            <option value="cardiology">Tim mạch</option>
            <option value="pediatrics">Nhi khoa</option>
            <option value="dermatology">Da liễu</option>
            <option value="neurology">Thần kinh</option>
          </select>
          <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="">Trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm nghỉ</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Bác sĩ</th>
              <th className="px-6 py-4 text-left">Liên hệ</th>
              <th className="px-6 py-4 text-left">Chuyên khoa</th>
              <th className="px-6 py-4 text-left">Kinh nghiệm</th>
              <th className="px-6 py-4 text-center">Bệnh nhân</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor, index) => (
              <tr 
                key={doctor.id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 font-semibold text-gray-800">#{doctor.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-blue-600">
                        {doctor.name.split(' ').pop()[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{doctor.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Mail size={14} /> {doctor.email}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Phone size={14} /> {doctor.phone}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {doctor.specialty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{doctor.experience}</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-gray-800">{doctor.patients}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    doctor.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {doctor.status === 'active' ? 'Hoạt động' : 'Tạm nghỉ'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">Hiển thị 1-{filteredDoctors.length} trong tổng số {doctors.length} bác sĩ</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Trước</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">2</button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">3</button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Sau</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;