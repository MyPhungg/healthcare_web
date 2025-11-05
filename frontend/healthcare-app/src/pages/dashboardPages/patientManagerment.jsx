import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone, Calendar } from 'lucide-react';
import Button from '../../components/common/button';

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      dateOfBirth: '15/03/1990',
      gender: 'Nam',
      address: 'Quận 1, TP.HCM',
      lastVisit: '20/11/2025',
      totalVisits: 5,
      status: 'active'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0902345678',
      dateOfBirth: '22/07/1985',
      gender: 'Nữ',
      address: 'Quận 3, TP.HCM',
      lastVisit: '18/11/2025',
      totalVisits: 12,
      status: 'active'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0903456789',
      dateOfBirth: '10/12/1995',
      gender: 'Nam',
      address: 'Quận 5, TP.HCM',
      lastVisit: '15/10/2025',
      totalVisits: 3,
      status: 'inactive'
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý bệnh nhân</h1>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          Thêm bệnh nhân mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="">Giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="">Trạng thái</option>
            <option value="active">Đang điều trị</option>
            <option value="inactive">Đã hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Bệnh nhân</th>
              <th className="px-6 py-4 text-left">Liên hệ</th>
              <th className="px-6 py-4 text-left">Ngày sinh</th>
              <th className="px-6 py-4 text-left">Giới tính</th>
              <th className="px-6 py-4 text-left">Địa chỉ</th>
              <th className="px-6 py-4 text-center">Lần khám</th>
              <th className="px-6 py-4 text-center">Lần cuối</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              <tr 
                key={patient.id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 font-semibold text-gray-800">#{patient.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-green-600">
                        {patient.name.split(' ').pop()[0]}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">{patient.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Mail size={14} /> {patient.email}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Phone size={14} /> {patient.phone}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{patient.dateOfBirth}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    patient.gender === 'Nam' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-pink-100 text-pink-700'
                  }`}>
                    {patient.gender}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{patient.address}</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-gray-800">{patient.totalVisits}</span>
                </td>
                <td className="px-6 py-4 text-center text-gray-700">{patient.lastVisit}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    patient.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {patient.status === 'active' ? 'Đang điều trị' : 'Hoàn thành'}
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
        <p className="text-gray-600">Hiển thị 1-{filteredPatients.length} trong tổng số {patients.length} bệnh nhân</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Trước</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">2</button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Sau</button>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;