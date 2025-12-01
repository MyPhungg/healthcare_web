import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  Loader, 
  RefreshCw, 
  Download, 
  Printer, 
  FileText, 
  Filter, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Users,
  Activity,
  Shield,
  MapPin,
  X,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/button';
import PatientService from '../../service/patientService';
import UserService from '../../service/userService';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [userInfoMap, setUserInfoMap] = useState({}); // Map userId -> user info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [userLoading, setUserLoading] = useState({}); // Track user loading state
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching patients...');
      const patientsData = await PatientService.getAllPatients();
      console.log('Patients data:', patientsData);
      
      // Add default values for missing data
      const enhancedPatients = patientsData.map(patient => ({
        ...patient,
        dateOfBirth: patient.dateOfBirth || '',
        address: patient.address || '',
        district: patient.district || '',
        city: patient.city || '',
        insuranceNum: patient.insuranceNum || '',
        gender: patient.gender || 'OTHER',
        // Email and phone will be fetched from user service
        email: 'Đang tải...',
        phone: 'Đang tải...'
      }));
      
      setPatients(enhancedPatients);
      setCurrentPage(1);
      
      // Fetch user info for each patient
      await fetchUsersInfo(enhancedPatients);
      
    } catch (err) {
      setError(`Không thể tải danh sách bệnh nhân: ${err.message}`);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user info for patients
  const fetchUsersInfo = async (patientsList) => {
    try {
      const userPromises = patientsList.map(async (patient) => {
        try {
          // Check if patient has userId
          if (!patient.userId) {
            console.warn(`Patient ${patient.patientId} has no userId`);
            return { 
              patientId: patient.patientId, 
              user: null 
            };
          }

          // Set loading state for this user
          setUserLoading(prev => ({
            ...prev,
            [patient.patientId]: true
          }));

          // Fetch user info
          const userData = await UserService.getUserById(patient.userId);
          console.log(`User data for patient ${patient.patientId}:`, userData);
          
          return { 
            patientId: patient.patientId, 
            user: userData 
          };
        } catch (error) {
          console.error(`Error fetching user for patient ${patient.patientId}:`, error);
          return { 
            patientId: patient.patientId, 
            user: null,
            error: error.message 
          };
        } finally {
          // Clear loading state
          setUserLoading(prev => ({
            ...prev,
            [patient.patientId]: false
          }));
        }
      });

      const userResults = await Promise.allSettled(userPromises);
      
      // Create user info map
      const newUserInfoMap = {};
      const updatedPatients = [...patientsList];
      
      userResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { patientId, user, error } = result.value;
          
          if (user) {
            newUserInfoMap[patientId] = {
              email: user.email || 'Chưa cập nhật',
              phone: user.phone || 'Chưa cập nhật',
              isActive: user.isActive !== undefined ? user.isActive : true,
              username: user.username || '',
              role: user.role || 'PATIENT'
            };
            
            // Update patient data with user info
            const patientIndex = updatedPatients.findIndex(p => p.patientId === patientId);
            if (patientIndex !== -1) {
              updatedPatients[patientIndex] = {
                ...updatedPatients[patientIndex],
                email: user.email || 'Chưa cập nhật',
                phone: user.phone || 'Chưa cập nhật',
                isActive: user.isActive !== undefined ? user.isActive : true
              };
            }
          } else {
            newUserInfoMap[patientId] = {
              email: 'Không thể tải',
              phone: 'Không thể tải',
              isActive: true,
              error: error || 'Không thể tải thông tin'
            };
          }
        }
      });
      
      setUserInfoMap(newUserInfoMap);
      setPatients(updatedPatients);
      
    } catch (err) {
      console.error('Error fetching users info:', err);
    }
  };

  // Get patient info with user data
  const getPatientWithUserInfo = (patient) => {
    const userInfo = userInfoMap[patient.patientId] || {};
    const isLoading = userLoading[patient.patientId];
    
    return {
      ...patient,
      email: isLoading ? 'Đang tải...' : (userInfo.email || patient.email || 'Chưa cập nhật'),
      phone: isLoading ? 'Đang tải...' : (userInfo.phone || patient.phone || 'Chưa cập nhật'),
      isActive: userInfo.isActive !== undefined ? userInfo.isActive : (patient.isActive !== undefined ? patient.isActive : true),
      userError: userInfo.error
    };
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    return patients.map(patient => getPatientWithUserInfo(patient)).filter(patient => {
      const matchesSearch = 
        patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.insuranceNum?.includes(searchTerm);
      
      const matchesGender = genderFilter === 'all' || 
        PatientService.formatGender(patient.gender) === genderFilter;
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && patient.isActive) ||
        (statusFilter === 'inactive' && !patient.isActive);
      
      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [patients, userInfoMap, userLoading, searchTerm, genderFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPatients.length);
  const currentPatients = filteredPatients.slice(startIndex, endIndex);
  const allCurrentPageSelected = currentPatients.length > 0 && 
    currentPatients.every(patient => selectedPatients.includes(patient.patientId));
  const someCurrentPageSelected = currentPatients.length > 0 && 
    currentPatients.some(patient => selectedPatients.includes(patient.patientId));

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter, statusFilter]);

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

  // Handle select/deselect all patients on current page
  const toggleSelectAll = () => {
    const currentPagePatientIds = currentPatients.map(p => p.patientId);
    
    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedPatients(prev => prev.filter(id => !currentPagePatientIds.includes(id)));
    } else {
      // Select all on current page
      setSelectedPatients(prev => {
        const newSelection = [...prev];
        currentPagePatientIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Handle select/deselect individual patient
  const togglePatientSelection = (patientId) => {
    setSelectedPatients(prev => 
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedPatients([]);
  };

  // Refresh user info for a specific patient
  const refreshPatientUserInfo = async (patientId) => {
    const patient = patients.find(p => p.patientId === patientId);
    if (patient && patient.userId) {
      try {
        setUserLoading(prev => ({ ...prev, [patientId]: true }));
        const userData = await UserService.getUserById(patient.userId);
        
        setUserInfoMap(prev => ({
          ...prev,
          [patientId]: {
            email: userData.email || 'Chưa cập nhật',
            phone: userData.phone || 'Chưa cập nhật',
            isActive: userData.isActive !== undefined ? userData.isActive : true
          }
        }));
        
        // Update patient in patients array
        setPatients(prev => prev.map(p => 
          p.patientId === patientId 
            ? { 
                ...p, 
                email: userData.email || 'Chưa cập nhật',
                phone: userData.phone || 'Chưa cập nhật',
                isActive: userData.isActive !== undefined ? userData.isActive : true
              }
            : p
        ));
        
      } catch (error) {
        console.error(`Error refreshing user info for patient ${patientId}:`, error);
      } finally {
        setUserLoading(prev => ({ ...prev, [patientId]: false }));
      }
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8082/api/reports/patients', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tạo báo cáo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `danh-sach-benh-nhan-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError('Không thể xuất báo cáo PDF. Vui lòng thử lại.');
      console.error('Error exporting PDF:', err);
    } finally {
      setExportLoading(false);
    }
  };

  // Print patient list
  const printPatientList = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Danh sách bệnh nhân</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .header h1 { margin: 0; color: #333; }
          .print-date { text-align: right; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f8f9fa; border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold; }
          td { border: 1px solid #ddd; padding: 10px; }
          .total { margin-top: 20px; font-weight: bold; text-align: right; }
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DANH SÁCH BỆNH NHÂN</h1>
          <p>Hệ thống quản lý bệnh viện</p>
        </div>
        <div class="print-date">In ngày: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã BN</th>
              <th>Họ tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Bảo hiểm</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPatients.map((patient, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${patient.patientId || 'N/A'}</td>
                <td>${patient.fullName || 'Chưa cập nhật'}</td>
                <td>${PatientService.formatGender(patient.gender)}</td>
                <td>${PatientService.formatDate(patient.dateOfBirth)}</td>
                <td>${patient.phone || 'Chưa cập nhật'}</td>
                <td>${patient.email || 'Chưa cập nhật'}</td>
                <td>${patient.address ? `${patient.address}, ${patient.district}, ${patient.city}` : 'Chưa cập nhật'}</td>
                <td>${patient.insuranceNum || 'Không có'}</td>
                <td>${patient.isActive ? 'Đang điều trị' : 'Hoàn thành'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">Tổng số: ${filteredPatients.length} bệnh nhân</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Mã BN', 'Họ tên', 'Giới tính', 'Ngày sinh', 'SĐT', 'Email', 'Địa chỉ', 'Bảo hiểm', 'Trạng thái'];
    const csvData = filteredPatients.map(patient => [
      patient.patientId || '',
      patient.fullName || '',
      PatientService.formatGender(patient.gender),
      PatientService.formatDate(patient.dateOfBirth),
      patient.phone || '',
      patient.email || '',
      patient.address ? `${patient.address}, ${patient.district}, ${patient.city}` : '',
      patient.insuranceNum || 'Không có',
      patient.isActive ? 'Đang điều trị' : 'Hoàn thành'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-benh-nhan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get status display info
  const getStatusInfo = (isActive) => {
    return isActive 
      ? { 
          label: 'Đang điều trị', 
          color: 'text-green-700', 
          bgColor: 'bg-green-100',
          border: 'border-green-200'
        }
      : { 
          label: 'Hoàn thành', 
          color: 'text-blue-700', 
          bgColor: 'bg-blue-100',
          border: 'border-blue-200'
        };
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setStatusFilter('all');
  };

  // Handle page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Calculate statistics
  const statistics = useMemo(() => {
    const patientsWithUserInfo = patients.map(patient => getPatientWithUserInfo(patient));
    const total = patientsWithUserInfo.length;
    const active = patientsWithUserInfo.filter(p => p.isActive).length;
    const male = patientsWithUserInfo.filter(p => p.gender === 'MALE').length;
    const female = patientsWithUserInfo.filter(p => p.gender === 'FEMALE').length;
    const withInsurance = patientsWithUserInfo.filter(p => p.insuranceNum).length;
    
    return {
      total,
      active,
      male,
      female,
      withInsurance,
      avgAge: 'N/A'
    };
  }, [patients, userInfoMap]);

  // Format address for display
  const formatAddress = (patient) => {
    const parts = [];
    if (patient.address) parts.push(patient.address);
    if (patient.district) parts.push(patient.district);
    if (patient.city) parts.push(patient.city);
    return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật';
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return PatientService.formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải danh sách bệnh nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">Quản lý bệnh nhân</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Quản lý thông tin và hồ sơ bệnh nhân trong hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={fetchPatients}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw size={18} />
            <span className="whitespace-nowrap">Làm mới</span>
          </button>
          <Button variant="primary" className="text-sm sm:text-base">
            <UserPlus size={18} className="mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">Thêm bệnh nhân</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3 text-sm sm:text-base">
          <Activity size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium break-words">{error}</p>
            <button 
              onClick={fetchPatients}
              className="text-sm underline hover:text-red-800 mt-1"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Tổng số</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{statistics.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Đang điều trị</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{statistics.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Nam</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{statistics.male}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Nữ</p>
          <p className="text-xl sm:text-2xl font-bold text-pink-600">{statistics.female}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Có BHYT</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{statistics.withInsurance}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Độ tuổi TB</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">{statistics.avgAge}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT, mã BN hoặc số BHYT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <Filter size={16} />
            <span className="whitespace-nowrap">Bộ lọc</span>
            {showFilters && <X size={14} className="ml-1" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                <select 
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="all">Tất cả giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select 
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang điều trị</option>
                  <option value="inactive">Hoàn thành</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng / trang</label>
                <select 
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5 bệnh nhân</option>
                  <option value={10}>10 bệnh nhân</option>
                  <option value={20}>20 bệnh nhân</option>
                  <option value={50}>50 bệnh nhân</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allCurrentPageSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = someCurrentPageSelected && !allCurrentPageSelected;
                }
              }}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-600">
              {selectedPatients.length > 0 
                ? `Đã chọn ${selectedPatients.length} bệnh nhân`
                : 'Chọn trang này'
              }
            </span>
          </div>
          
          {selectedPatients.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <span>Hành động</span>
                <ChevronRight size={14} className={`transform transition-transform ${showBulkActions ? 'rotate-90' : ''}`} />
              </button>
              
              {showBulkActions && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
                    Gửi email thông báo
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Gửi tin nhắn SMS
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 rounded-b-lg border-t border-gray-200">
                    Xóa đã chọn
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Xuất CSV"
          >
            <Download size={16} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={printPatientList}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="In danh sách"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">In</span>
          </button>
          <button
            onClick={exportToPDF}
            disabled={exportLoading}
            className="flex items-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Xuất PDF"
          >
            {exportLoading ? <Loader size={16} className="animate-spin" /> : <FileText size={16} />}
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {selectedPatients.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {selectedPatients.length} bệnh nhân được chọn
            </span>
          </div>
          <button
            onClick={clearSelections}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Bỏ chọn tất cả
          </button>
        </div>
      )}

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {currentPatients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bệnh nhân</h3>
            <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allCurrentPageSelected}
                      ref={input => {
                        if (input) {
                          input.indeterminate = someCurrentPageSelected && !allCurrentPageSelected;
                        }
                      }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded focus:ring-blue-500 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Bệnh nhân</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Liên hệ</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Thông tin</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Bảo hiểm</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient, index) => {
                  const statusInfo = getStatusInfo(patient.isActive);
                  const displayGender = PatientService.formatGender(patient.gender);
                  const isSelected = selectedPatients.includes(patient.patientId);
                  const globalIndex = startIndex + index;
                  const isLoadingUser = userLoading[patient.patientId];
                  const hasUserError = patient.userError;
                  
                  return (
                    <tr 
                      key={patient.patientId}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        globalIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePatientSelection(patient.patientId)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-800 text-sm">
                        <div className="truncate max-w-[100px]" title={patient.patientId}>
                          #{patient.patientId?.slice(-6) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="font-semibold text-green-600 text-sm">
                              {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : 'B'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate" title={patient.fullName}>
                              {patient.fullName || 'Chưa cập nhật'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDisplayDate(patient.dateOfBirth)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1 text-sm truncate">
                            <Mail size={12} className={`flex-shrink-0 ${isLoadingUser ? 'text-gray-400' : hasUserError ? 'text-red-400' : 'text-gray-400'}`} />
                            <div className="flex items-center gap-1 truncate">
                              <span 
                                className={`truncate ${hasUserError ? 'text-red-600' : 'text-gray-700'}`} 
                                title={patient.email}
                              >
                                {patient.email}
                              </span>
                              {isLoadingUser && (
                                <Loader size={10} className="animate-spin text-blue-500" />
                              )}
                              {hasUserError && (
                                <AlertCircle size={10} className="text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm truncate">
                            <Phone size={12} className={`flex-shrink-0 ${isLoadingUser ? 'text-gray-400' : hasUserError ? 'text-red-400' : 'text-gray-400'}`} />
                            <div className="flex items-center gap-1 truncate">
                              <span 
                                className={`truncate ${hasUserError ? 'text-red-600' : 'text-gray-700'}`} 
                                title={patient.phone}
                              >
                                {patient.phone}
                              </span>
                              {!isLoadingUser && hasUserError && (
                                <button
                                  onClick={() => refreshPatientUserInfo(patient.patientId)}
                                  className="text-xs text-blue-600 hover:text-blue-800 ml-1"
                                  title="Thử lại"
                                >
                                  Thử lại
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              displayGender === 'Nam' 
                                ? 'bg-blue-100 text-blue-700' 
                                : displayGender === 'Nữ'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {displayGender}
                            </span>
                          </div>
                          <div className="flex items-start gap-1 text-xs text-gray-500 truncate">
                            <MapPin size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
                            <span className="truncate" title={formatAddress(patient)}>
                              {formatAddress(patient)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {patient.insuranceNum ? (
                          <div className="flex items-center gap-1" title={patient.insuranceNum}>
                            <Shield size={14} className="text-green-600" />
                            <span className="text-xs text-green-700 truncate max-w-[100px]">
                              {patient.insuranceNum}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Không có</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.border}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-1">
                          <button 
                            className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="p-1.5 sm:p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => deletePatient(patient.patientId)}
                            disabled={actionLoading === patient.patientId}
                            className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                          >
                            {actionLoading === patient.patientId ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
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

      {/* Pagination and Summary */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600">
            <p>
              Hiển thị {currentPatients.length > 0 ? startIndex + 1 : 0}-{endIndex} 
              trong tổng số {filteredPatients.length} bệnh nhân
              {filteredPatients.length !== patients.length && ` (đã lọc từ ${patients.length} bệnh nhân)`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
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
                  onClick={() => typeof page === 'number' ? goToPage(page) : null}
                  disabled={page === '...'}
                  className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : page === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page === '...' ? <MoreHorizontal size={16} /> : page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
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
            
            {/* Go to Page Input */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trang:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= totalPages) {
                    goToPage(value);
                  }
                }}
                className="w-16 px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;