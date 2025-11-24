import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Download, Edit2, FileText } from 'lucide-react';
import Button from '../../components/common/button';
import PatientService from '../../service/patientService';
import AppointmentService from '../../service/appointmentService';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [userInfo, setUserInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy userId từ token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Lấy thông tin patient bằng userId
  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();
      
      if (!token || !userId) {
        throw new Error('No authentication token found');
      }

      const patientData = await PatientService.getPatientByUserId(userId, token);
      console.log('Patient data:', patientData);
      
      // Format data để hiển thị
      setUserInfo({
        patientId: patientData.patientId,
        name: patientData.fullName || 'Chưa có tên',
        phone: patientData.user?.phone || 'Chưa có số điện thoại',
        email: patientData.user?.email || 'Chưa có email',
        dateOfBirth: patientData.dateOfBirth || 'Chưa có ngày sinh',
        gender: patientData.gender === 'MALE' ? 'Nam' : patientData.gender === 'FEMALE' ? 'Nữ' : 'Chưa có',
        address: patientData.address || 'Chưa có địa chỉ',
        district: patientData.district || 'Chưa có quận/huyện',
        city: patientData.city || 'Chưa có thành phố',
        insuranceNum: patientData.insuranceNum || 'Chưa có số BHYT',
        avatar: patientData.profileImg || null
      });

      return patientData.patientId; // Trả về patientId để fetch appointments

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
      
      // Format appointments data
      const formattedAppointments = appointmentsData.map(appointment => ({
        id: appointment.appointmentId,
        doctorName: appointment.doctorName || 'Đang cập nhật',
        time: `${appointment.appointmentStart?.substring(0, 5) || ''} - ${appointment.appointmentEnd?.substring(0, 5) || ''}`,
        price: appointment.consultationFee ? `${appointment.consultationFee.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
        bookingDate: new Date(appointment.interactedAt).toLocaleDateString('vi-VN'),
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('vi-VN') : 'Chưa có',
        status: appointment.status?.toLowerCase() || 'pending',
        reason: appointment.reason || 'Không có lý do'
      }));

      setAppointments(formattedAppointments);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]); // Set empty array nếu có lỗi
    }
  };

  // Fetch data khi component mount
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

      // Chuẩn bị data để gửi lên API
      const patientUpdateData = {
        fullName: updatedData.name,
        gender: updatedData.gender === 'Nam' ? 'MALE' : updatedData.gender === 'Nữ' ? 'FEMALE' : 'OTHER',
        dateOfBirth: updatedData.dateOfBirth,
        address: updatedData.address,
        district: updatedData.district,
        city: updatedData.city,
        insuranceNum: updatedData.insuranceNum,
        profileImg: updatedData.avatar,
        coverImg: null
      };

      const result = await PatientService.updatePatient(userInfo.patientId, patientUpdateData, token);
      console.log('Update successful:', result);
      
      // Cập nhật lại thông tin local
      setUserInfo(prev => ({
        ...prev,
        ...updatedData
      }));
      
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
      {/* Header với gradient xanh */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50 shadow-2xl">
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

            {/* User Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl font-bold mb-3">{userInfo?.name || 'Chưa có tên'}</h1>
              <p className="text-lg mb-1">
                <span className="font-medium">SĐT:</span> {userInfo?.phone || 'Chưa có số điện thoại'}
              </p>
              <p className="text-lg">
                <span className="font-medium">E-mail:</span> {userInfo?.email || 'Chưa có email'}
              </p>
            </div>

            {/* Upload Button */}
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2">
              <Download size={20} />
              Tải ảnh lên
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
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

          {/* Main Content */}
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

  useEffect(() => {
    setFormData(userInfo);
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
      await onUpdatePatient(formData);
      setIsEditing(false);
      // Có thể thêm thông báo thành công ở đây
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userInfo);
    setIsEditing(false);
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
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={Mail}
          label="Email"
          value={formData?.email || ''}
          name="email"
          type="email"
          isEditing={isEditing}
          onChange={handleChange}
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
            { value: 'Nữ', label: 'Nữ' }
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
  options = []
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-600" />
        <label className="text-sm font-semibold text-gray-600">{label}</label>
      </div>
      {isEditing ? (
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
        <div className="px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-gray-800 font-medium">{value || 'Chưa có thông tin'}</p>
        </div>
      )}
    </div>
  );
};

// Appointment History Component
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

      {/* Table */}
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
                <td className="px-4 py-4 text-gray-700">{appointment.doctorName}</td>
                <td className="px-4 py-4 text-gray-700">{appointment.time}</td>
                <td className="px-4 py-4 text-blue-600 font-semibold">{appointment.price}</td>
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

      {/* Empty State */}
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