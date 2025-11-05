import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, Briefcase, Edit2 } from 'lucide-react';
import Button from '../../components/common/button';

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Dr. Nguyễn Văn A',
    email: 'doctor@hospital.com',
    phone: '0901234567',
    specialty: 'Tim mạch',
    experience: '10 năm',
    education: 'Đại học Y Hà Nội',
    address: '123 Đường ABC, Quận 1, TP.HCM'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h1>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={48} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-gray-600">{formData.specialty}</p>
              <p className="text-sm text-gray-500">{formData.experience} kinh nghiệm</p>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} className="mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
              <Button variant="primary" onClick={handleSave}>Lưu</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField icon={Mail} label="Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
          <InfoField icon={Phone} label="Số điện thoại" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
          <InfoField icon={Award} label="Chuyên khoa" name="specialty" value={formData.specialty} isEditing={isEditing} onChange={handleChange} />
          <InfoField icon={Briefcase} label="Kinh nghiệm" name="experience" value={formData.experience} isEditing={isEditing} onChange={handleChange} />
          <InfoField icon={Award} label="Học vấn" name="education" value={formData.education} isEditing={isEditing} onChange={handleChange} />
          <div className="md:col-span-2">
            <InfoField icon={MapPin} label="Địa chỉ" name="address" value={formData.address} isEditing={isEditing} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, name, value, isEditing, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-blue-600" />
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    {isEditing ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    ) : (
      <div className="px-4 py-3 bg-gray-50 rounded-lg">
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    )}
  </div>
);

export default DoctorProfile;