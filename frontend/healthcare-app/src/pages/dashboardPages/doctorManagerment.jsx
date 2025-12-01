import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone, Loader, RefreshCw, MapPin, Calendar, Award, Activity, AlertCircle, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from '../../components/common/button';
import DoctorService from '../../service/doctorService';
import UserService from '../../service/userService';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialities, setSpecialities] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch doctors from API
  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching doctors...');
      const doctorsData = await DoctorService.getAllDoctors();
      console.log('Doctors data:', doctorsData);
      
      // Create speciality map for lookup
      const specialityMap = {};
      specialities.forEach(spec => {
        specialityMap[spec.specialityId] = spec;
      });
      
      // Enhanced doctors data with speciality info AND user details
      const enhancedDoctors = await Promise.all(
        doctorsData.map(async (doctor) => {
          try {
            // Fetch user details from UserService if userId exists
            let userDetails = null;
            if (doctor.userId) {
              userDetails = await UserService.getUserById(doctor.userId);
            }
            
            const specialityInfo = specialityMap[doctor.specialityId] || {
              name: 'Chưa xác định',
              description: 'Chưa có mô tả'
            };
            
            return {
              ...doctor,
              email: userDetails?.email || doctor.user?.email || 'Chưa cập nhật',
              phone: userDetails?.phone || doctor.user?.phone || 'Chưa cập nhật',
              isActive: doctor.user?.isActive !== undefined ? doctor.user.isActive : true,
              yearsOfExperience: calculateYearsOfExperience(doctor.dateOfBirth),
              specialityName: specialityInfo.name,
              specialityDescription: specialityInfo.description,
              // Include all user details if available
              user: userDetails ? { ...doctor.user, ...userDetails } : doctor.user
            };
          } catch (userError) {
            console.error(`Error fetching user details for userId ${doctor.userId}:`, userError);
            // Fallback to existing data if user fetch fails
            const specialityInfo = specialityMap[doctor.specialityId] || {
              name: 'Chưa xác định',
              description: 'Chưa có mô tả'
            };
            
            return {
              ...doctor,
              email: doctor.user?.email || 'Chưa cập nhật',
              phone: doctor.user?.phone || 'Chưa cập nhật',
              isActive: doctor.user?.isActive !== undefined ? doctor.user.isActive : true,
              yearsOfExperience: calculateYearsOfExperience(doctor.dateOfBirth),
              specialityName: specialityInfo.name,
              specialityDescription: specialityInfo.description
            };
          }
        })
      );
      
      setDoctors(enhancedDoctors);
    } catch (err) {
      setError(`Không thể tải danh sách bác sĩ: ${err.message}`);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialities
  const fetchSpecialities = async () => {
    try {
      console.log('Fetching specialities...');
      const specialitiesData = await DoctorService.getSpecialities();
      console.log('Specialities data:', specialitiesData);
      setSpecialities(specialitiesData);
    } catch (err) {
      console.error('Error fetching specialities:', err);
    }
  };

  // Calculate years of experience based on date of birth
  const calculateYearsOfExperience = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    try {
      const birthYear = new Date(dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      const estimatedGraduationYear = birthYear + 26; // Assume graduation at age 26
      const experience = Math.max(0, currentYear - estimatedGraduationYear);
      return experience;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  useEffect(() => {
    if (specialities.length > 0) {
      fetchDoctors();
    }
  }, [specialities]);

  // Filter doctors based on search and filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = 
        doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone?.includes(searchTerm);
      
      const matchesSpecialty = specialtyFilter === 'all' || 
        doctor.specialityId === specialtyFilter;
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && doctor.isActive) ||
        (statusFilter === 'inactive' && !doctor.isActive);
      
      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [doctors, searchTerm, specialtyFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredDoctors.length);
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  // Handle status change
  const toggleDoctorStatus = async (doctorId, currentStatus) => {
    try {
      setActionLoading(doctorId);
      
      // In a real app, you would call an API here
      // For now, we'll update locally
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.doctorId === doctorId 
            ? { 
                ...doctor, 
                isActive: !currentStatus,
                user: { ...doctor.user, isActive: !currentStatus }
              }
            : doctor
        )
      );
      
      console.log(`Doctor ${doctorId} status changed to: ${!currentStatus}`);
    } catch (err) {
      setError('Không thể cập nhật trạng thái bác sĩ. Vui lòng thử lại.');
      console.error('Error updating doctor status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete doctor
  const deleteDoctor = async (doctorId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        setActionLoading(doctorId);
        // In a real app, you would call an API here
        // For now, we'll remove from frontend
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

  // Handle view doctor details
  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  // Get status display info
  const getStatusInfo = (isActive) => {
    return isActive 
      ? { 
          label: 'Đang hoạt động', 
          color: 'text-green-700', 
          bgColor: 'bg-green-100',
          icon: Activity
        }
      : { 
          label: 'Tạm nghỉ', 
          color: 'text-red-700', 
          bgColor: 'bg-red-100',
          icon: Activity
        };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };

  // Format gender display
  const getGenderDisplay = (gender) => {
    const genderMap = {
      'MALE': 'Nam',
      'FEMALE': 'Nữ',
      'OTHER': 'Khác'
    };
    return genderMap[gender] || 'Chưa cập nhật';
  };

  // Format address
  const formatAddress = (doctor) => {
    const parts = [];
    if (doctor.address) parts.push(doctor.address);
    if (doctor.district) parts.push(doctor.district);
    if (doctor.city) parts.push(doctor.city);
    return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật';
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    if (totalPages <= maxVisibleButtons) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // First 3 pages, ellipsis, last page
        for (let i = 1; i <= 4; i++) {
          buttons.push(i);
        }
        buttons.push('...');
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // First page, ellipsis, last 4 pages
        buttons.push(1);
        buttons.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // First page, ellipsis, current page and neighbors, ellipsis, last page
        buttons.push(1);
        buttons.push('...');
        buttons.push(currentPage - 1);
        buttons.push(currentPage);
        buttons.push(currentPage + 1);
        buttons.push('...');
        buttons.push(totalPages);
      }
    }
    
    return buttons;
  };

  // Doctor Details Modal
  const DoctorDetailsModal = () => {
    if (!selectedDoctor) return null;

    const statusInfo = getStatusInfo(selectedDoctor.isActive);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Chi tiết bác sĩ</h2>
              <p className="text-gray-600 text-sm">ID: {selectedDoctor.doctorId}</p>
            </div>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Award size={18} />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Họ và tên</p>
                      <p className="font-semibold text-gray-800">{selectedDoctor.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Giới tính</p>
                      <p className="font-semibold text-gray-800">{getGenderDisplay(selectedDoctor.gender)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày sinh</p>
                      <p className="font-semibold text-gray-800">{formatDate(selectedDoctor.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số năm kinh nghiệm</p>
                      <p className="font-semibold text-gray-800">{selectedDoctor.yearsOfExperience} năm</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Mail size={18} />
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedDoctor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Số điện thoại</p>
                        <p className="font-medium">{selectedDoctor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Địa chỉ</p>
                        <p className="font-medium">{formatAddress(selectedDoctor)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Award size={18} />
                    Thông tin chuyên môn
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Chuyên khoa</p>
                      <p className="font-semibold text-blue-600">{selectedDoctor.specialityName}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedDoctor.specialityDescription}</p>
                    </div>
                    {selectedDoctor.bio && (
                      <div>
                        <p className="text-sm text-gray-600">Giới thiệu</p>
                        <p className="text-gray-700">{selectedDoctor.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Clinic Info & Status */}
              <div className="space-y-6">
                {/* Clinic Info */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Phòng khám</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Tên phòng khám</p>
                      <p className="font-semibold">{selectedDoctor.clinicName || 'Không có'}</p>
                    </div>
                    {selectedDoctor.clinicDescription && (
                      <div>
                        <p className="text-sm text-gray-600">Mô tả</p>
                        <p className="text-gray-700 text-sm">{selectedDoctor.clinicDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Account Info */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <StatusIcon size={18} />
                    Trạng thái & Tài khoản
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    {selectedDoctor.user && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Username:</span>
                          <span className="font-medium">{selectedDoctor.user.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Vai trò:</span>
                          <span className="font-medium">{selectedDoctor.user.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Ngày tạo:</span>
                          <span className="font-medium">{formatDate(selectedDoctor.user.createdAt)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Images */}
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh</h3>
                  <div className="space-y-3">
                    {selectedDoctor.profileImg && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Ảnh đại diện:</p>
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow">
                          <img 
                            src={selectedDoctor.profileImg} 
                            alt={selectedDoctor.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {selectedDoctor.coverImg && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Ảnh bìa:</p>
                        <div className="h-32 rounded-lg overflow-hidden border-2 border-white shadow">
                          <img 
                            src={selectedDoctor.coverImg} 
                            alt={`${selectedDoctor.fullName} cover`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Đóng
            </Button>
            <Button variant="primary">
              <Edit2 size={16} className="mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>
    );
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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">Quản lý bác sĩ</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Quản lý thông tin và trạng thái của các bác sĩ trong hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              fetchSpecialities();
              fetchDoctors();
            }}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw size={18} />
            <span className="whitespace-nowrap">Làm mới</span>
          </button>
          <Button variant="primary" className="text-sm sm:text-base">
            <Plus size={18} className="mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">Thêm bác sĩ mới</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3 text-sm sm:text-base">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium break-words">{error}</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, phòng khám hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
          </div>
          <select 
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="all">Tất cả chuyên khoa</option>
            {specialities.map(spec => (
              <option key={spec.specialityId} value={spec.specialityId}>
                {spec.name}
              </option>
            ))}
          </select>
          <select 
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm nghỉ</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Tổng số bác sĩ</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{doctors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Đang hoạt động</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {doctors.filter(d => d.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Số chuyên khoa</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {[...new Set(doctors.map(d => d.specialityId))].length}
          </p>
        </div>
        {/* <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Kinh nghiệm trung bình</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {doctors.length > 0 
              ? Math.round(doctors.reduce((sum, d) => sum + d.yearsOfExperience, 0) / doctors.length)
              : 0} năm
          </p>
        </div> */}
      </div>

      {/* Results and Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="text-sm text-gray-600">
          Hiển thị {startIndex + 1}-{endIndex} trong tổng số {filteredDoctors.length} bác sĩ
          {searchTerm && (
            <span className="text-blue-600 ml-2">
              (kết quả tìm kiếm: "{searchTerm}")
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className="px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="5">5 bác sĩ</option>
            <option value="10">10 bác sĩ</option>
            <option value="20">20 bác sĩ</option>
            <option value="50">50 bác sĩ</option>
          </select>
        </div>
      </div>

      {/* Doctors Table - Fixed overflow */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-sm">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Bác sĩ</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Liên hệ</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Chuyên khoa</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Phòng khám</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Trạng thái</th>
                <th className="px-4 py-3 text-center font-semibold text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="text-gray-400" size={20} />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Không tìm thấy bác sĩ</h3>
                    <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map((doctor, index) => {
                  const statusInfo = getStatusInfo(doctor.isActive);
                  
                  return (
                    <tr 
                      key={doctor.doctorId}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800 text-sm">
                        <div className="truncate max-w-[100px]" title={doctor.doctorId}>
                          #{doctor.doctorId?.slice(-6) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {doctor.profileImg ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
                              <img 
                                src={doctor.profileImg} 
                                alt={doctor.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-semibold text-blue-600 text-sm">
                                {doctor.fullName ? doctor.fullName.charAt(0).toUpperCase() : 'B'}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 text-sm truncate" title={doctor.fullName}>
                              {doctor.fullName || 'Chưa cập nhật'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {getGenderDisplay(doctor.gender)} • {doctor.yearsOfExperience} năm kinh nghiệm
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1 text-sm text-gray-700 truncate">
                            <Mail size={12} className="flex-shrink-0" />
                            <span className="truncate" title={doctor.email}>{doctor.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-700 truncate">
                            <Phone size={12} className="flex-shrink-0" />
                            <span className="truncate" title={doctor.phone}>{doctor.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 min-w-0">
                        <div className="min-w-0">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-1 truncate max-w-full">
                            {doctor.specialityName || 'Chưa xác định'}
                          </span>
                          <p className="text-xs text-gray-500 truncate" title={doctor.specialityDescription}>
                            {doctor.specialityDescription?.substring(0, 20)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 min-w-0">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate" title={doctor.clinicName}>
                            {doctor.clinicName || 'Không có'}
                          </p>
                          <p className="text-xs text-gray-500 truncate" title={doctor.clinicDescription}>
                            {doctor.clinicDescription?.substring(0, 60)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleDoctorStatus(doctor.doctorId, doctor.isActive)}
                          disabled={actionLoading === doctor.doctorId}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-1 ${
                            actionLoading === doctor.doctorId 
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : `${statusInfo.bgColor} ${statusInfo.color} cursor-pointer hover:opacity-90`
                          }`}
                          title={actionLoading === doctor.doctorId ? 'Đang xử lý...' : `Nhấn để ${doctor.isActive ? 'tạm nghỉ' : 'kích hoạt'}`}
                        >
                          {actionLoading === doctor.doctorId ? (
                            <Loader size={10} className="animate-spin" />
                          ) : null}
                          {actionLoading === doctor.doctorId ? 'Đang xử lý...' : statusInfo.label}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleViewDoctor(doctor)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteDoctor(doctor.doctorId)}
                            disabled={actionLoading === doctor.doctorId}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages} • Hiển thị {startIndex + 1}-{endIndex} của {filteredDoctors.length} bác sĩ
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Page Number Buttons */}
            {getPaginationButtons().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                disabled={page === '...'}
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page === '...' ? <MoreHorizontal size={16} /> : page}
              </button>
            ))}
            
            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Đến trang:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= totalPages) {
                  handlePageChange(value);
                }
              }}
              className="w-16 px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-sm"
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {showDetailsModal && <DoctorDetailsModal />}
    </div>
  );
};

export default DoctorManagement;