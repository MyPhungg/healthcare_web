import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  MoreVertical,
  User,
  UserCheck,
  UserX,
  Loader,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import UserService from '../../service/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
      setCurrentPage(1); // Reset về trang 1 khi fetch lại data
    } catch (err) {
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm);
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const allCurrentPageSelected = currentUsers.length > 0 && 
    currentUsers.every(user => selectedUsers.includes(user.userId));
  const someCurrentPageSelected = currentUsers.length > 0 && 
    currentUsers.some(user => selectedUsers.includes(user.userId));

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Handle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all on current page
  const toggleSelectAll = () => {
    const currentPageUserIds = currentUsers.map(user => user.userId);
    
    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedUsers(prev => prev.filter(id => !currentPageUserIds.includes(id)));
    } else {
      // Select all on current page
      setSelectedUsers(prev => {
        const newSelection = [...prev];
        currentPageUserIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedUsers([]);
  };

  // Handle user status change
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(userId);
      if (currentStatus) {
        await UserService.deactivateUser(userId);
      } else {
        await UserService.activateUser(userId);
      }
      // Refresh the users list
      await fetchUsers();
    } catch (err) {
      setError('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại.');
      console.error('Error updating user status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete user
  const deleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        setActionLoading(userId);
        // Note: You might need to implement delete API
        // await UserService.deleteUser(userId);
        // For now, let's use deactivate
        await UserService.deactivateUser(userId);
        await fetchUsers();
      } catch (err) {
        setError('Không thể xóa người dùng. Vui lòng thử lại.');
        console.error('Error deleting user:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Handle bulk deactivate
  const handleBulkDeactivate = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa ${selectedUsers.length} người dùng đã chọn?`)) {
      try {
        setActionLoading('bulk');
        const promises = selectedUsers.map(userId => UserService.deactivateUser(userId));
        await Promise.all(promises);
        await fetchUsers();
        setSelectedUsers([]); // Clear selections after bulk action
      } catch (err) {
        setError('Không thể vô hiệu hóa người dùng đã chọn. Vui lòng thử lại.');
        console.error('Error bulk deactivating users:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Get role display info
  const getRoleInfo = (role) => {
    const roleInfo = {
      ADMIN: { label: 'Quản trị viên', color: 'bg-red-100 text-red-800 border-red-200' },
      DOCTOR: { label: 'Bác sĩ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      PATIENT: { label: 'Bệnh nhân', color: 'bg-green-100 text-green-800 border-green-200' }
    };
    return roleInfo[role] || { label: role, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  // Get status display info
  const getStatusInfo = (isActive) => {
    return isActive 
      ? { 
          label: 'Đang hoạt động', 
          color: 'text-green-700', 
          bgColor: 'bg-green-100',
          border: 'border-green-200',
          icon: UserCheck
        }
      : { 
          label: 'Ngừng hoạt động', 
          color: 'text-red-700', 
          bgColor: 'bg-red-100',
          border: 'border-red-200',
          icon: UserX
        };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate pagination buttons with ellipsis
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">Quản lý Người dùng</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw size={18} />
            <span className="whitespace-nowrap">Làm mới</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3 text-sm sm:text-base">
          <UserX size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium break-words">{error}</p>
            <button 
              onClick={fetchUsers}
              className="text-sm underline hover:text-red-800 mt-1"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Tổng người dùng</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Đang hoạt động</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {users.filter(u => u.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Bác sĩ</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'DOCTOR').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">Bệnh nhân</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'PATIENT').length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="DOCTOR">Bác sĩ</option>
            <option value="PATIENT">Bệnh nhân</option>
          </select>
          <select
            className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:block">Hiển thị:</span>
            <select
              className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 người dùng</option>
              <option value={10}>10 người dùng</option>
              <option value={20}>20 người dùng</option>
              <option value={50}>50 người dùng</option>
            </select>
          </div>
        </div>
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
              {selectedUsers.length > 0 
                ? `Đã chọn ${selectedUsers.length} người dùng`
                : 'Chọn trang này'
              }
            </span>
          </div>
          
          {selectedUsers.length > 0 && (
            <button 
              onClick={handleBulkDeactivate}
              disabled={actionLoading === 'bulk'}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'bulk' ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <UserX size={14} />
              )}
              <span>Vô hiệu hóa ({selectedUsers.length})</span>
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          Hiển thị {currentUsers.length > 0 ? startIndex + 1 : 0}-{endIndex} trong tổng số {filteredUsers.length} người dùng
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {selectedUsers.length} người dùng được chọn
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
                <th className="px-4 py-3 text-left font-semibold text-sm">Người dùng</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Vai trò</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Trạng thái</th>
                <th className="px-4 py-3 text-left font-semibold text-sm">Ngày tạo</th>
                <th className="px-4 py-3 text-center font-semibold text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
                    <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => {
                  const roleInfo = getRoleInfo(user.role);
                  const statusInfo = getStatusInfo(user.isActive);
                  const StatusIcon = statusInfo.icon;
                  const isSelected = selectedUsers.includes(user.userId);
                  const globalIndex = startIndex + index;
                  
                  return (
                    <tr 
                      key={user.userId} 
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        globalIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleUserSelection(user.userId)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="text-blue-600" size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-800 text-sm truncate" title={user.username}>
                              {user.username}
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={user.email}>
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 truncate" title={user.phone}>
                              {user.phone || 'Chưa cập nhật'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleUserStatus(user.userId, user.isActive)}
                          disabled={actionLoading === user.userId}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.border} ${
                            actionLoading === user.userId ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                          }`}
                          title={actionLoading === user.userId ? 'Đang xử lý...' : `Nhấn để ${user.isActive ? 'vô hiệu hóa' : 'kích hoạt'}`}
                        >
                          {actionLoading === user.userId ? (
                            <Loader size={10} className="animate-spin" />
                          ) : (
                            <StatusIcon size={10} />
                          )}
                          {actionLoading === user.userId ? 'Đang xử lý...' : statusInfo.label}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-1">
                          <button 
                            className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteUser(user.userId)}
                            disabled={actionLoading === user.userId}
                            className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                          >
                            <Trash2 size={14} />
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
            <p>
              Trang {currentPage} / {totalPages} • 
              Hiển thị {currentUsers.length > 0 ? startIndex + 1 : 0}-{endIndex} của {filteredUsers.length} người dùng
              {filteredUsers.length !== users.length && ` (đã lọc từ ${users.length} người dùng)`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
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
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page === '...' ? <MoreHorizontal size={16} /> : page}
                </button>
              ))}
              
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
            
            {/* Go to Page Input */}
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
        </div>
      )}
    </div>
  );
};

export default UserManagement;