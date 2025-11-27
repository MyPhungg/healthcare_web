import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone, Loader, RefreshCw } from 'lucide-react';
import Button from '../../components/common/button';
import DoctorService from '../../service/doctorService';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialities, setSpecialities] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const doctorsData = await DoctorService.getAllDoctors();
      setDoctors(doctorsData);
    } catch (err) {
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialities
  const fetchSpecialities = async () => {
    try {
      const specialitiesData = await DoctorService.getSpecialities();
      setSpecialities(specialitiesData);
    } catch (err) {
      console.error('Error fetching specialities:', err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecialities();
  }, []);

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality?.specialityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === 'all' || 
      doctor.speciality?.specialityName === specialtyFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && doctor.isActive) ||
      (statusFilter === 'inactive' && !doctor.isActive);
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  // Handle status change (frontend only - since no API for active/deactive)
  const toggleDoctorStatus = async (doctorId, currentStatus) => {
    try {
      setActionLoading(doctorId);
      
      // Since there's no API for active/deactive, we'll update locally
      // In a real scenario, you might want to call updateDoctorProfile with the new status
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.doctorId === doctorId 
            ? { ...doctor, isActive: !currentStatus }
            : doctor
        )
      );
      
      // Optional: If you want to persist the change, you can call updateDoctorProfile
      // await DoctorService.updateDoctorProfile(doctorId, { isActive: !currentStatus });
      
    } catch (err) {
      setError('Không thể cập nhật trạng thái bác sĩ. Vui lòng thử lại.');
      console.error('Error updating doctor status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete doctor (frontend only)
  const deleteDoctor = async (doctorId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        setActionLoading(doctorId);
        // Since there's no delete API, we'll remove from frontend
        setDoctors(prevDoctors => 
          prevDoctors.filter(doctor => doctor.doctorId !== doctorId)
        );
      } catch (err) {
        setError('Không thể xóa bác sĩ. Vui lòng thử lại.');
        console.error('Error deleting doctor:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Get status display info
  const getStatusInfo = (isActive) => {
    return isActive 
      ? { label: 'Đang hoạt động', color: 'text-green-700', bgColor: 'bg-green-100' }
      : { label: 'Tạm nghỉ', color: 'text-red-700', bgColor: 'bg-red-100' };
  };

  // Format experience text
  const getExperienceText = (yearsOfExperience) => {
    if (!yearsOfExperience) return 'Chưa cập nhật';
    return `${yearsOfExperience} năm kinh nghiệm`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải danh sách bác sĩ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý bác sĩ</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và trạng thái của các bác sĩ trong hệ thống</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchDoctors}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} />
            Làm mới
          </button>
          <Button variant="primary">
            <Plus size={20} className="mr-2" />
            Thêm bác sĩ mới
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button 
            onClick={fetchDoctors}
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
              placeholder="Tìm kiếm theo tên, email hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select 
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="all">Tất cả chuyên khoa</option>
            {specialities.map(spec => (
              <option key={spec.specialityId} value={spec.specialityName}>
                {spec.specialityName}
              </option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm nghỉ</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Bác sĩ</th>
                <th className="px-6 py-4 text-left">Liên hệ</th>
                <th className="px-6 py-4 text-left">Chuyên khoa</th>
                <th className="px-6 py-4 text-left">Kinh nghiệm</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor, index) => {
                const statusInfo = getStatusInfo(doctor.isActive);
                
                return (
                  <tr 
                    key={doctor.doctorId}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      #{doctor.doctorId?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {doctor.fullName ? doctor.fullName.charAt(0).toUpperCase() : 'D'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {doctor.fullName || 'Chưa cập nhật'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {doctor.gender === 'MALE' ? 'Nam' : doctor.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <Mail size={14} /> {doctor.email || 'Chưa cập nhật'}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <Phone size={14} /> {doctor.phone || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {doctor.speciality?.specialityName || 'Chưa cập nhật'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {getExperienceText(doctor.yearsOfExperience)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleDoctorStatus(doctor.doctorId, doctor.isActive)}
                        disabled={actionLoading === doctor.doctorId}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          actionLoading === doctor.doctorId 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : `${statusInfo.bgColor} ${statusInfo.color} cursor-pointer`
                        }`}
                      >
                        {actionLoading === doctor.doctorId ? (
                          <Loader size={12} className="animate-spin inline mr-1" />
                        ) : null}
                        {actionLoading === doctor.doctorId ? 'Đang xử lý...' : statusInfo.label}
                      </button>
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
                          onClick={() => deleteDoctor(doctor.doctorId)}
                          disabled={actionLoading === doctor.doctorId}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
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
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bác sĩ</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Hiển thị 1-{filteredDoctors.length} trong tổng số {doctors.length} bác sĩ
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

export default DoctorManagement;