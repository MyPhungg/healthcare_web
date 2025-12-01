import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Download, Edit2, FileText, Camera } from 'lucide-react';
import Button from '../../components/common/button';
import PatientService from '../../service/patientService';
import AppointmentService from '../../service/appointmentService';
import userService from '../../service/userService'; // THÊM IMPORT
import AuthService from '../../service/authService'; // THÊM IMPORT

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [userInfo, setUserInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null); // THÊM STATE cho user data

  // Lấy thông tin user bằng userId
  const fetchUserInfo = async (userId) => {
    try {
      const userInfo = await userService.getUserById(userId);
      console.log('User info:', userInfo);
      setUserData(userInfo);
      return userInfo;
    } catch (err) {
      console.error('Error fetching user info:', err);
      // Nếu không lấy được từ API, dùng thông tin từ token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return {
            email: payload.email,
            phone: payload.phone
          };
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError);
        }
      }
      return null;
    }
  };

  // Lấy thông tin patient bằng userId
  const fetchPatientInfo = async () => {
    try {
      const token = AuthService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Lấy userId từ token
      let userId;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub;
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
        throw new Error('Invalid authentication token');
      }

      // Lấy thông tin user từ API
      const userInfo = await fetchUserInfo(userId);
      
      // Lấy thông tin patient
      const patientData = await PatientService.getPatientByUserId(userId, token);
      console.log('Patient data:', patientData);
      
      // Format data để hiển thị - sử dụng email và phone từ userInfo
      setUserInfo({
        patientId: patientData.patientId,
        name: patientData.fullName || 'Chưa có tên',
        phone: userInfo?.phone || 'Chưa có số điện thoại',
        email: userInfo?.email || 'Chưa có email',
        dateOfBirth: patientData.dateOfBirth || 'Chưa có ngày sinh',
        gender: patientData.gender === 'MALE' ? 'Nam' : patientData.gender === 'FEMALE' ? 'Nữ' : 'Khác',
        address: patientData.address || 'Chưa có địa chỉ',
        district: patientData.district || 'Chưa có quận/huyện',
        city: patientData.city || 'Chưa có thành phố',
        insuranceNum: patientData.insuranceNum || 'Chưa có số BHYT',
        avatar: patientData.profileImg || null,
        userId: userId // Thêm userId để dùng cho update
      });

      return patientData.patientId;

    } catch (err) {
      console.error('Error fetching patient info:', err);
      setError(err.message);
      return null;
    }
  };

  // Lấy lịch hẹn của patient
  const fetchAppointments = async (patientId) => {
    try {
      const token = AuthService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const appointmentsData = await AppointmentService.getAppointmentsByPatient(patientId, token);
      console.log('Appointments data:', appointmentsData);
      
      setAppointments(appointmentsData || []);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const patientId = await fetchPatientInfo();
        if (patientId) {
          await fetchAppointments(patientId);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cập nhật thông tin patient và user
  const updatePatientInfo = async (updatedData) => {
    try {
      const token = AuthService.getToken();
      
      if (!token || !userInfo?.patientId) {
        throw new Error('No authentication token found or patient ID missing');
      }

      // Chuyển đổi gender từ frontend sang backend format
      const backendGender = updatedData.gender === 'Nam' ? 'MALE' : updatedData.gender === 'Nữ' ? 'FEMALE' : 'OTHER';

      // Tạo object data để gửi lên service
      const patientUpdateData = {
        fullName: updatedData.name || '',
        gender: backendGender,
        dateOfBirth: updatedData.dateOfBirth || '',
        address: updatedData.address || '',
        district: updatedData.district || '',
        city: updatedData.city || '',
        insuranceNum: updatedData.insuranceNum || '',
        profileImg: updatedData.avatar instanceof File ? updatedData.avatar : null,
        coverImg: null
      };

      console.log('Sending patient update data:', patientUpdateData);

      // Update patient info
      const patientResult = await PatientService.updatePatient(userInfo.patientId, patientUpdateData, token);
      console.log('Patient update successful:', patientResult);

      // Update user info (phone) nếu có thay đổi
      if (userInfo.userId && userData?.phone !== updatedData.phone) {
        try {
          const userUpdateData = {
            phone: updatedData.phone
          };
          
          await userService.updateUser(userInfo.userId, userUpdateData);
          console.log('User phone updated successfully');
        } catch (userError) {
          console.error('Error updating user phone:', userError);
          // Không throw error ở đây để không làm hỏng việc update patient info
        }
      }

      // Refresh data sau khi update
      // Refresh user info
      if (userInfo.userId) {
        try {
          const freshUserData = await fetchUserInfo(userInfo.userId);
          
          // Refresh patient info
          const freshPatientData = await PatientService.getPatientByUserId(userInfo.userId, token);
          
          // Cập nhật lại state
          setUserInfo(prev => ({
            ...prev,
            ...updatedData,
            name: freshPatientData.fullName || updatedData.name,
            phone: freshUserData?.phone || updatedData.phone,
            avatar: updatedData.avatar instanceof File ? 
              (freshPatientData.profileImg || updatedData.avatar) : 
              (updatedData.avatar || freshPatientData.profileImg)
          }));
        } catch (refreshError) {
          console.error('Error refreshing data:', refreshError);
          // Nếu refresh thất bại, vẫn update local state
          setUserInfo(prev => ({
            ...prev,
            ...updatedData,
            avatar: updatedData.avatar instanceof File ? prev.avatar : updatedData.avatar
          }));
        }
      } else {
        // Nếu không có userId, chỉ update local state
        setUserInfo(prev => ({
          ...prev,
          ...updatedData,
          avatar: updatedData.avatar instanceof File ? prev.avatar : updatedData.avatar
        }));
      }
      
      return patientResult;

    } catch (err) {
      console.error('Error updating patient info:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 flex items-center justify-center">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 flex items-center justify-center">
        <div className="text-red-500 text-lg text-center">
          {error}
          <br />
          <Button 
            onClick={() => window.location.reload()} 
            variant="primary" 
            className="mt-4"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-30">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-40 h-40 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50 shadow-2xl overflow-hidden">
                {userInfo?.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={80} className="text-white" />
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl font-bold mb-3">{userInfo?.name || 'Chưa có tên'}</h1>
              <p className="text-lg mb-1">
                <span className="font-medium">SĐT:</span> {userInfo?.phone || 'Chưa có số điện thoại'}
              </p>
              <p className="text-lg">
                <span className="font-medium">E-mail:</span> {userInfo?.email || 'Chưa có email'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full px-6 py-4 text-left font-medium transition-all ${
                  activeTab === 'info'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full px-6 py-4 text-left font-medium transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Lịch sử đặt lịch
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'info' ? (
                <PersonalInfo 
                  userInfo={userInfo} 
                  onUpdatePatient={updatePatientInfo}
                />
              ) : (
                <AppointmentHistory appointments={appointments} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal Info Component - Chỉ cần sửa nhỏ ở phần hiển thị
const PersonalInfo = ({ userInfo, onUpdatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userInfo);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar || null);
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    setFormData(userInfo);
    setAvatarPreview(userInfo?.avatar || null);
    setAvatarFile(null);
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Kiểm tra nếu là email thì không cho chỉnh sửa
    if (name === 'email') {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Chuẩn bị data để gửi, nếu có file ảnh mới thì thêm vào
      const dataToUpdate = {
        ...formData,
        avatar: avatarFile // Gửi file ảnh nếu có
      };

      await onUpdatePatient(dataToUpdate);
      
      setIsEditing(false);
      setAvatarFile(null);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userInfo);
    setAvatarPreview(userInfo?.avatar || null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      try {
        // Tạo URL preview tạm thời
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        setAvatarFile(file);
        
        alert('Ảnh đã được chọn! Nhấn "Lưu thay đổi" để cập nhật.');
      } catch (error) {
        alert('Có lỗi xảy ra khi chọn ảnh: ' + error.message);
        setAvatarPreview(userInfo?.avatar || null);
        setAvatarFile(null);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit2 size={18} className="mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ảnh đại diện</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div 
                className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleAvatarClick}
              >
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <Camera size={32} className="text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-2">
                Nhấn vào ảnh để chọn ảnh mới từ thiết bị của bạn
              </p>
              <p className="text-sm text-gray-500">
                Định dạng hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 5MB
              </p>
              <Button 
                variant="outline" 
                onClick={handleAvatarClick}
                className="mt-3"
              >
                <Download size={16} className="mr-2" />
                Chọn ảnh
              </Button>
              {avatarFile && (
                <p className="mt-2 text-green-600 text-sm">
                  ✓ Đã chọn ảnh mới. Nhấn "Lưu thay đổi" để cập nhật.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          icon={User}
          label="Họ và tên"
          value={formData?.name || ''}
          name="name"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={Phone}
          label="Số điện thoại"
          value={formData?.phone || ''}
          name="phone"
          isEditing={isEditing} // Bây giờ có thể chỉnh sửa
          onChange={handleChange}
        />
        <InfoField
          icon={Mail}
          label="Email"
          value={formData?.email || ''}
          name="email"
          type="email"
          isEditing={false} // Email không chỉnh sửa được
          onChange={handleChange}
          disabled={true}
        />
        <InfoField
          icon={Calendar}
          label="Ngày sinh"
          value={formData?.dateOfBirth || ''}
          name="dateOfBirth"
          type="date"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={User}
          label="Giới tính"
          value={formData?.gender || ''}
          name="gender"
          isEditing={isEditing}
          onChange={handleChange}
          as="select"
          options={[
            { value: 'Nam', label: 'Nam' },
            { value: 'Nữ', label: 'Nữ' },
            { value: 'Khác', label: 'Khác' }
          ]}
        />
        <InfoField
          icon={MapPin}
          label="Thành phố"
          value={formData?.city || ''}
          name="city"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={MapPin}
          label="Quận/Huyện"
          value={formData?.district || ''}
          name="district"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <InfoField
            icon={MapPin}
            label="Địa chỉ"
            value={formData?.address || ''}
            name="address"
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <InfoField
            icon={FileText}
            label="Số BHYT"
            value={formData?.insuranceNum || ''}
            name="insuranceNum"
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ 
  icon: Icon, 
  label, 
  value, 
  name, 
  type = 'text', 
  isEditing, 
  onChange,
  as = 'input',
  options = [],
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-600" />
        <label className="text-sm font-semibold text-gray-600">{label}</label>
      </div>
      {isEditing && !disabled ? (
        as === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
          />
        )
      ) : (
        <div className={`px-4 py-3 rounded-lg ${disabled ? 'bg-gray-100' : 'bg-gray-50'}`}>
          <p className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>
            {value || 'Chưa có thông tin'}
          </p>
        </div>
      )}
    </div>
  );
};

// Appointment History Component (giữ nguyên)
const AppointmentHistory = ({ appointments }) => {
  const getStatusBadge = (status) => {
    const config = {
      pending: { 
        label: 'Chờ xác nhận', 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border-yellow-300' 
      },
      confirmed: { 
        label: 'Đã xác nhận', 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        border: 'border-green-300' 
      },
      cancelled: { 
        label: 'Đã hủy', 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-300' 
      },
      completed: { 
        label: 'Đã hoàn thành', 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        border: 'border-blue-300' 
      }
    };

    const statusLower = status?.toLowerCase();
    const { label, bg, text, border } = config[statusLower] || config.pending;

    return (
      <span className={`px-3 py-1.5 rounded border-2 font-medium text-sm ${bg} ${text} ${border}`}>
        {label}
      </span>
    );
  };

  // Format thời gian từ 12:30:00 -> 12:30
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  // Format ngày từ 2025-12-03 -> 03/12/2025
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format datetime từ 2025-12-01T07:12:11 -> 01/12/2025 07:12
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Chưa có';
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  // Format tiền VNĐ
  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
        Lịch sử đặt lịch
      </h2>

      <div className="space-y-6">
        {appointments.map((appointment, index) => (
          <div 
            key={appointment.appointment?.appointmentId || index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Lịch hẹn: {appointment.appointment?.appointmentId || 'N/A'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Mã lịch: {appointment.appointment?.scheduleId || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(appointment.appointment?.status)}
                <p className="text-sm text-gray-500 mt-2">
                  Ngày đặt: {formatDateTime(appointment.appointment?.interactedAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Thông tin khám</p>
                <div className="space-y-1">
                  <p className="text-gray-800">
                    <span className="font-medium">Ngày khám:</span> {formatDate(appointment.appointment?.appointmentDate)}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Giờ khám:</span> {formatTime(appointment.appointment?.appointmentStart)} - {formatTime(appointment.appointment?.appointmentEnd)}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Lý do:</span> {appointment.appointment?.reason || 'Không có lý do'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Thông tin bác sĩ</p>
                <div className="space-y-1">
                  <p className="text-gray-800 font-medium">{appointment.doctor?.fullName || 'Đang cập nhật'}</p>
                  <p className="text-gray-600 text-sm">{appointment.doctor?.specialityId || 'Chưa có chuyên khoa'}</p>
                  <p className="text-gray-600 text-sm">{appointment.doctor?.clinicName || 'Chưa có phòng khám'}</p>
                  <p className="text-gray-600 text-sm">
                    {appointment.doctor?.city && `${appointment.doctor?.city}`}
                    {appointment.doctor?.district && `, ${appointment.doctor?.district}`}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Chi phí & Thông tin khác</p>
                <div className="space-y-1">
                  <p className="text-blue-600 font-semibold text-lg">
                    {formatCurrency(appointment.fee)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Mã bác sĩ:</span> {appointment.doctor?.doctorId || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Mã bệnh nhân:</span> {appointment.appointment?.patientId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {appointment.doctor?.bio && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">Thông tin thêm về bác sĩ:</p>
                <p className="text-gray-700 text-sm">{appointment.doctor.bio}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Chưa có lịch hẹn nào</p>
          <p className="text-gray-400 mt-2">Hãy đặt lịch hẹn đầu tiên của bạn</p>
        </div>
      )}
    </div>
  );
};

export default Profile;