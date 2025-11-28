import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Download, Edit2, FileText, Camera } from 'lucide-react';
import Button from '../../components/common/button';
import PatientService from '../../service/patientService';
import AppointmentService from '../../service/appointmentService';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [userInfo, setUserInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin user từ token
  const getUserInfoFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId || payload.sub,
        email: payload.email,
        phone: payload.phone
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Lấy thông tin patient bằng userId
  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const userFromToken = getUserInfoFromToken();
      
      if (!token || !userFromToken) {
        throw new Error('No authentication token found');
      }

      const patientData = await PatientService.getPatientByUserId(userFromToken.userId, token);
      console.log('Patient data:', patientData);
      
      // Format data để hiển thị - lấy email và phone từ token
      setUserInfo({
        patientId: patientData.patientId,
        name: patientData.fullName || 'Chưa có tên',
        phone: userFromToken.phone || 'Chưa có số điện thoại', // Lấy từ token
        email: userFromToken.email || 'Chưa có email', // Lấy từ token
        dateOfBirth: patientData.dateOfBirth || 'Chưa có ngày sinh',
        gender: patientData.gender === 'MALE' ? 'Nam' : patientData.gender === 'FEMALE' ? 'Nữ' : 'Khác',
        address: patientData.address || 'Chưa có địa chỉ',
        district: patientData.district || 'Chưa có quận/huyện',
        city: patientData.city || 'Chưa có thành phố',
        insuranceNum: patientData.insuranceNum || 'Chưa có số BHYT',
        avatar: patientData.profileImg || null
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
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const appointmentsData = await AppointmentService.getAppointmentsByPatient(patientId, token);
      console.log('Appointments data:', appointmentsData);
      
      const formattedAppointments = appointmentsData.map(appointment => ({
        id: appointment.appointmentId,
        doctorId: appointment.doctorId || 'Đang cập nhật',
        time: `${appointment.appointmentStart?.substring(0, 5) || ''} - ${appointment.appointmentEnd?.substring(0, 5) || ''}`,
        fee: appointment.fee ? `${appointment.fee.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
        bookingDate: new Date(appointment.interactedAt).toLocaleDateString('vi-VN'),
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('vi-VN') : 'Chưa có',
        status: appointment.status?.toLowerCase() || 'pending',
        reason: appointment.reason || 'Không có lý do'
      }));

      setAppointments(formattedAppointments);

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

  // Cập nhật thông tin patient
  const updatePatientInfo = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !userInfo?.patientId) {
        throw new Error('No authentication token found or patient ID missing');
      }

      // Chuyển đổi gender từ frontend sang backend format
      const backendGender = updatedData.gender === 'Nam' ? 'MALE' : updatedData.gender === 'Nữ' ? 'FEMALE' : 'OTHER';

      // Tạo object data để gửi lên service - KHÔNG gửi email và phone
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

      console.log('Sending update data:', patientUpdateData);

      const result = await PatientService.updatePatient(userInfo.patientId, patientUpdateData, token);
      console.log('Update successful:', result);
      
      // Cập nhật lại thông tin local
      if (updatedData.avatar instanceof File) {
        // Fetch lại thông tin patient để lấy URL ảnh mới từ server
        const userFromToken = getUserInfoFromToken();
        const freshPatientData = await PatientService.getPatientByUserId(userFromToken.userId, token);
        
        setUserInfo(prev => ({
          ...prev,
          ...updatedData,
          avatar: freshPatientData.profileImg // Lấy URL ảnh mới từ server
        }));
      } else {
        // Nếu không có ảnh mới, update bình thường
        setUserInfo(prev => ({
          ...prev,
          ...updatedData
        }));
      }
      
      return result;

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

// Personal Info Component
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          isEditing={false} // Luôn disable, chỉ hiển thị
          onChange={handleChange}
          disabled={true}
        />
        <InfoField
          icon={Mail}
          label="Email"
          value={formData?.email || ''}
          name="email"
          type="email"
          isEditing={false} // Luôn disable, chỉ hiển thị
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
      pending: { label: 'Chờ xác nhận', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      confirmed: { label: 'Đã xác nhận', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      cancelled: { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      completed: { label: 'Đã hoàn thành', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
    };

    const { label, bg, text, border } = config[status] || config.pending;

    return (
      <span className={`px-3 py-1.5 rounded border-2 font-medium text-sm ${bg} ${text} ${border}`}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">
        Lịch sử đặt lịch
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">ID lịch hẹn</th>
              <th className="px-4 py-3 text-left font-semibold">Tên bác sĩ</th>
              <th className="px-4 py-3 text-left font-semibold">Giờ khám</th>
              <th className="px-4 py-3 text-left font-semibold">Giá khám</th>
              <th className="px-4 py-3 text-left font-semibold">Ngày khám</th>
              <th className="px-4 py-3 text-left font-semibold">Lý do khám</th>
              <th className="px-4 py-3 text-left font-semibold">Ngày đặt</th>
              <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr 
                key={appointment.id}
                className={`border-b hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-4 font-medium text-gray-800">{appointment.id}</td>
                <td className="px-4 py-4 text-gray-700">{appointment.doctorId}</td>
                <td className="px-4 py-4 text-gray-700">{appointment.time}</td>
                <td className="px-4 py-4 text-blue-600 font-semibold">{appointment.fee}</td>
                <td className="px-4 py-4 text-gray-700">{appointment.appointmentDate}</td>
                <td className="px-4 py-4 text-gray-700">{appointment.reason}</td>
                <td className="px-4 py-4 text-gray-700">{appointment.bookingDate}</td>
                <td className="px-4 py-4">
                  {getStatusBadge(appointment.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Chưa có lịch hẹn nào</p>
        </div>
      )}
    </div>
  );
};

export default Profile;