import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Download, Edit2, FileText } from 'lucide-react';
import Button from '../../components/common/button';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');

  const userInfo = {
    name: 'Mỹ nữ gạch ống',
    phone: '0909350908',
    email: 'caiqqgido123cl@gmail.com',
    dateOfBirth: '15/03/1990',
    gender: 'Nữ',
    address: '123 Đường ABC, Quận 1',
    city: 'TP. Hồ Chí Minh',
    avatar: null
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-30">
      {/* Header với gradient xanh */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50 shadow-2xl">
                {userInfo.avatar ? (
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
              <h1 className="text-4xl font-bold mb-3">{userInfo.name}</h1>
              <p className="text-lg mb-1">
                <span className="font-medium">SĐT:</span> {userInfo.phone}
              </p>
              <p className="text-lg">
                <span className="font-medium">E-mail:</span> {userInfo.email}
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
                <PersonalInfo userInfo={userInfo} />
              ) : (
                <AppointmentHistory />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal Info Component
const PersonalInfo = ({ userInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userInfo);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Saving:', formData);
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
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          icon={User}
          label="Họ và tên"
          value={formData.name}
          name="name"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={Phone}
          label="Số điện thoại"
          value={formData.phone}
          name="phone"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={Mail}
          label="Email"
          value={formData.email}
          name="email"
          type="email"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={Calendar}
          label="Ngày sinh"
          value={formData.dateOfBirth}
          name="dateOfBirth"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={User}
          label="Giới tính"
          value={formData.gender}
          name="gender"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <InfoField
          icon={MapPin}
          label="Thành phố"
          value={formData.city}
          name="city"
          isEditing={isEditing}
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <InfoField
            icon={MapPin}
            label="Địa chỉ"
            value={formData.address}
            name="address"
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value, name, type = 'text', isEditing, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-600" />
        <label className="text-sm font-semibold text-gray-600">{label}</label>
      </div>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
        />
      ) : (
        <div className="px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-gray-800 font-medium">{value}</p>
        </div>
      )}
    </div>
  );
};

// Appointment History Component
const AppointmentHistory = () => {
  const appointments = [
    {
      id: 'BS0000012',
      doctorName: 'LGBT',
      time: '9:00 - 9:30 AM',
      price: '300,000 VNĐ',
      bookingDate: '20/11/2025',
      appointmentDate: '18/01/2025',
      status: 'pending',
      reason: 'Tầm soát'
    },
    {
      id: 'BS0000013',
      doctorName: 'TS.BS Nguyễn Văn A',
      time: '14:00 - 14:30 PM',
      price: '500,000 VNĐ',
      bookingDate: '15/11/2025',
      appointmentDate: '20/11/2025',
      status: 'confirmed',
      reason: 'Khám tổng quát'
    },
    {
      id: 'BS0000011',
      doctorName: 'BS. Trần Thị B',
      time: '10:00 - 10:30 AM',
      price: '400,000 VNĐ',
      bookingDate: '10/10/2025',
      appointmentDate: '15/10/2025',
      status: 'completed',
      reason: 'Tái khám'
    }
  ];

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      completed: { label: 'Completed', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
    };

    const { label, bg, text, border } = config[status] || config.pending;

    return (
      <select className={`px-3 py-1.5 rounded border-2 font-medium text-sm ${bg} ${text} ${border} cursor-pointer`}>
        <option value={status}>{label}</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
        <option value="completed">Completed</option>
      </select>
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
              <th className="px-4 py-3 text-left font-semibold">ID bác sĩ</th>
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