import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone, Calendar, Loader, RefreshCw } from 'lucide-react';
import Button from '../../components/common/button';
import PatientService from '../../service/patientService';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientsData = await PatientService.getAllPatients();
      setPatients(patientsData);
    } catch (err) {
      setError('Không thể tải danh sách bệnh nhân. Vui lòng thử lại.');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients based on search and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === 'all' || 
      PatientService.formatGender(patient.gender) === genderFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && patient.isActive) ||
      (statusFilter === 'inactive' && !patient.isActive);
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  // Handle delete patient
  const deletePatient = async (patientId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        setActionLoading(patientId);
        await PatientService.deletePatient(patientId);
        await fetchPatients();
      } catch (err) {
        setError('Không thể xóa bệnh nhân. Vui lòng thử lại.');
        console.error('Error deleting patient:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Get status display info
  const getStatusInfo = (isActive) => {
    return isActive 
      ? { label: 'Đang điều trị', color: 'text-green-700', bgColor: 'bg-green-100' }
      : { label: 'Hoàn thành', color: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải danh sách bệnh nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý bệnh nhân</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và hồ sơ bệnh nhân trong hệ thống</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchPatients}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} />
            Làm mới
          </button>
          <Button variant="primary">
            <Plus size={20} className="mr-2" />
            Thêm bệnh nhân mới
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button 
            onClick={fetchPatients}
            className="ml-2 underline hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select 
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="all">Tất cả giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <select 
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang điều trị</option>
            <option value="inactive">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Bệnh nhân</th>
                <th className="px-6 py-4 text-left">Liên hệ</th>
                <th className="px-6 py-4 text-left">Ngày sinh</th>
                <th className="px-6 py-4 text-left">Giới tính</th>
                <th className="px-6 py-4 text-left">Địa chỉ</th>
                <th className="px-6 py-4 text-center">Bảo hiểm</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => {
                const statusInfo = getStatusInfo(patient.isActive);
                const displayGender = PatientService.formatGender(patient.gender);
                
                return (
                  <tr 
                    key={patient.patientId}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      #{patient.patientId?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-green-600">
                            {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : 'P'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {patient.fullName || 'Chưa cập nhật'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {patient.dateOfBirth ? PatientService.formatDate(patient.dateOfBirth) : 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <Mail size={14} /> {patient.email || 'Chưa cập nhật'}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <Phone size={14} /> {patient.phone || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {PatientService.formatDate(patient.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        displayGender === 'Nam' 
                          ? 'bg-blue-100 text-blue-700' 
                          : displayGender === 'Nữ'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {displayGender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="max-w-xs">
                        {patient.address ? (
                          <>
                            <p className="text-sm">{patient.address}</p>
                            {patient.district && patient.city && (
                              <p className="text-xs text-gray-500">
                                {patient.district}, {patient.city}
                              </p>
                            )}
                          </>
                        ) : (
                          'Chưa cập nhật'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.insuranceNum 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {patient.insuranceNum ? 'Có BH' : 'Không BH'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusInfo.bgColor
                      } ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deletePatient(patient.patientId)}
                          disabled={actionLoading === patient.patientId}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
                        >
                          {actionLoading === patient.patientId ? (
                            <Loader size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
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

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bệnh nhân</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Hiển thị 1-{filteredPatients.length} trong tổng số {patients.length} bệnh nhân
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Trước
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;