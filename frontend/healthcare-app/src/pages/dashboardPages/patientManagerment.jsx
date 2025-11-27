import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Mail, Phone, Calendar, Loader, RefreshCw, Download, Printer, FileText, Filter, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // THÊM STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientsData = await PatientService.getAllPatients();
      setPatients(patientsData);
      setCurrentPage(1); // Reset về trang 1 khi fetch lại data
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
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === 'all' || 
      PatientService.formatGender(patient.gender) === genderFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && patient.isActive) ||
      (statusFilter === 'inactive' && !patient.isActive);
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  // TÍNH TOÁN PHÂN TRANG
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset về trang 1 khi filter thay đổi
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
    
    if (selectedPatients.length === currentPagePatientIds.length) {
      // Bỏ chọn tất cả trên trang hiện tại
      setSelectedPatients(prev => prev.filter(id => !currentPagePatientIds.includes(id)));
    } else {
      // Chọn tất cả trên trang hiện tại
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
      link.download = 'danh-sach-benh-nhan.pdf';
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
          .page-break { page-break-after: always; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DANH SÁCH BỆNH NHÂN</h1>
        </div>
        <div class="print-date">In ngày: ${new Date().toLocaleDateString('vi-VN')}</div>
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
                <td>${patient.insuranceNum || 'Không'}</td>
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
    printWindow.print();
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
      patient.insuranceNum || 'Không',
      patient.isActive ? 'Đang điều trị' : 'Hoàn thành'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
      ? { label: 'Đang điều trị', color: 'text-green-700', bgColor: 'bg-green-100' }
      : { label: 'Hoàn thành', color: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setStatusFilter('all');
  };

  // Xử lý chuyển trang
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render phân trang
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-1 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-1 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
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
            <UserPlus size={20} className="mr-2" />
            Thêm bệnh nhân
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
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT hoặc mã bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Bộ lọc
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <select 
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang điều trị</option>
                <option value="inactive">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bảo hiểm</label>
              <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="all">Tất cả</option>
                <option value="has">Có bảo hiểm</option>
                <option value="none">Không có bảo hiểm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng / trang</label>
              <select 
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5 bệnh nhân</option>
                <option value={10}>10 bệnh nhân</option>
                <option value={20}>20 bệnh nhân</option>
                <option value={50}>50 bệnh nhân</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentPatients.length > 0 && currentPatients.every(patient => selectedPatients.includes(patient.patientId))}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedPatients.length > 0 
                ? `Đã chọn ${selectedPatients.length} bệnh nhân`
                : 'Chọn trang này'
              }
            </span>
          </div>
          
          {selectedPatients.length > 0 && (
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                Gửi email
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                Gửi SMS
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            CSV
          </button>
          <button
            onClick={printPatientList}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer size={16} />
            In
          </button>
          <button
            onClick={exportToPDF}
            disabled={exportLoading}
            className="flex items-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {exportLoading ? <Loader size={16} className="animate-spin" /> : <FileText size={16} />}
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={currentPatients.length > 0 && currentPatients.every(patient => selectedPatients.includes(patient.patientId))}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded focus:ring-blue-500"
                  />
                </th>
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
              {currentPatients.map((patient, index) => {
                const statusInfo = getStatusInfo(patient.isActive);
                const displayGender = PatientService.formatGender(patient.gender);
                const isSelected = selectedPatients.includes(patient.patientId);
                const globalIndex = startIndex + index;
                
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
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
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
                        {patient.insuranceNum ? patient.insuranceNum : 'Không BH'}
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

      {/* Pagination and Summary */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600">
          <p>
            Hiển thị {currentPatients.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredPatients.length)} 
            trong tổng số {filteredPatients.length} bệnh nhân
            {filteredPatients.length !== patients.length && ` (đã lọc từ ${patients.length} bệnh nhân)`}
          </p>
          <p className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages}
          </p>
        </div>
        
        {totalPages > 1 && renderPagination()}
      </div>
    </div>
  );
};

export default PatientManagement;