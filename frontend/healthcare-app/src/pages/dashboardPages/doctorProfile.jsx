import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Briefcase, Edit2, Calendar } from 'lucide-react';
import Button from '../../components/common/button';
import DoctorService from '../../service/doctorService';
import AuthService from '../../service/authService';
import userService from '../../service/userService';

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // THÊM STATE cho user info
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    speciality: '',
    specialityId: '',
    address: '',
    bio: '',
    clinicName: '',
    clinicDescription: '',
    dateOfBirth: '',
    gender: ''
  });

  // Fetch doctor profile and user info
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const userId = AuthService.getUserId();
        
        // Fetch user info (email và phone)
        let userData = null;
        if (userId) {
          try {
            userData = await userService.getUserById(userId);
            setUserInfo(userData);
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }
        
        // Fetch doctor profile
        const profile = await DoctorService.getDoctorProfile(userId);
        setDoctorInfo(profile);
        
        // Lấy tên chuyên khoa nếu có specialityId
        let specialityName = 'Chưa cập nhật';
        if (profile.specialityId) {
          try {
            specialityName = await DoctorService.getSpecialityName(profile.specialityId);
          } catch (error) {
            console.error('Error fetching speciality name:', error);
          }
        }

        // Format date of birth
        const formatDateOfBirth = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString('vi-VN');
        };

        // Format gender
        const formatGender = (gender) => {
          const genderMap = {
            'MALE': 'Nam',
            'FEMALE': 'Nữ',
            'OTHER': 'Khác'
          };
          return genderMap[gender] || gender;
        };

        // Get email và phone từ userData nếu có, nếu không thì từ profile
        const email = userData?.email || AuthService.getCurrentUser()?.email || '';
        const phone = userData?.phone || profile.phone || '';

        setFormData({
          fullName: profile.fullName || '',
          email: email,
          phone: phone,
          speciality: specialityName,
          specialityId: profile.specialityId || '',
          address: `${profile.address || ''}, ${profile.district || ''}, ${profile.city || ''}`.replace(/^,\s*/, ''),
          bio: profile.bio || '',
          clinicName: profile.clinicName || '',
          clinicDescription: profile.clinicDescription || '',
          dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
          gender: formatGender(profile.gender)
        });

      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        alert('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Phân tích địa chỉ thành các phần
      const addressParts = formData.address.split(', ').filter(part => part.trim() !== '');
      const address = addressParts[0] || '';
      const district = addressParts[1] || '';
      const city = addressParts[2] || '';
      
      // Chuẩn bị data để update doctor profile
      const doctorUpdateData = {
        fullName: formData.fullName,
        phone: formData.phone, // Sẽ cập nhật qua user service
        bio: formData.bio,
        clinicName: formData.clinicName,
        clinicDescription: formData.clinicDescription,
        address: address,
        district: district,
        city: city,
        specialityId: doctorInfo.specialityId,
        gender: doctorInfo.gender,
        dateOfBirth: doctorInfo.dateOfBirth
      };

      console.log('Update data before sending:', doctorUpdateData);

      // Update doctor profile
      await DoctorService.updateDoctorProfile(doctorInfo.doctorId, doctorUpdateData);
      
      // Update user info (phone)
      if (userInfo?.userId) {
        const userUpdateData = {
          phone: formData.phone
          // Note: Email thường không được thay đổi, chỉ update phone
        };
        
        await userService.updateUser(userInfo.userId, userUpdateData);
      }
      
      // Refresh data sau khi update
      const userId = AuthService.getUserId();
      
      // Refresh user info
      if (userId) {
        try {
          const updatedUserData = await userService.getUserById(userId);
          setUserInfo(updatedUserData);
        } catch (error) {
          console.error('Error refreshing user info:', error);
        }
      }
      
      // Refresh doctor profile
      const updatedProfile = await DoctorService.getDoctorProfile(userId);
      setDoctorInfo(updatedProfile);
      
      // Cập nhật lại speciality name
      let specialityName = 'Chưa cập nhật';
      if (updatedProfile.specialityId) {
        try {
          specialityName = await DoctorService.getSpecialityName(updatedProfile.specialityId);
        } catch (error) {
          console.error('Error fetching speciality name:', error);
        }
      }

      // Cập nhật formData với dữ liệu mới
      const formatDateOfBirth = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
      };

      const formatGender = (gender) => {
        const genderMap = {
          'MALE': 'Nam',
          'FEMALE': 'Nữ',
          'OTHER': 'Khác'
        };
        return genderMap[gender] || gender;
      };

      setFormData(prev => ({
        ...prev,
        fullName: updatedProfile.fullName || '',
        phone: formData.phone, // Giữ lại số điện thoại mới đã nhập
        bio: updatedProfile.bio || '',
        clinicName: updatedProfile.clinicName || '',
        clinicDescription: updatedProfile.clinicDescription || '',
        address: `${updatedProfile.address || ''}, ${updatedProfile.district || ''}, ${updatedProfile.city || ''}`.replace(/^,\s*/, ''),
        dateOfBirth: formatDateOfBirth(updatedProfile.dateOfBirth),
        gender: formatGender(updatedProfile.gender),
        speciality: specialityName,
        specialityId: updatedProfile.specialityId || ''
      }));
      
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data từ doctorInfo và userInfo gốc
    if (doctorInfo) {
      const formatDateOfBirth = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
      };

      const formatGender = (gender) => {
        const genderMap = {
          'MALE': 'Nam',
          'FEMALE': 'Nữ',
          'OTHER': 'Khác'
        };
        return genderMap[gender] || gender;
      };

      // Get original phone từ userInfo nếu có
      const originalPhone = userInfo?.phone || doctorInfo.phone || '';

      setFormData(prev => ({
        ...prev,
        fullName: doctorInfo.fullName || '',
        phone: originalPhone,
        bio: doctorInfo.bio || '',
        clinicName: doctorInfo.clinicName || '',
        clinicDescription: doctorInfo.clinicDescription || '',
        address: `${doctorInfo.address || ''}, ${doctorInfo.district || ''}, ${doctorInfo.city || ''}`.replace(/^,\s*/, ''),
        dateOfBirth: formatDateOfBirth(doctorInfo.dateOfBirth),
        gender: formatGender(doctorInfo.gender),
        specialityId: doctorInfo.specialityId || ''
      }));
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

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
              <h2 className="text-2xl font-bold text-gray-800">
                {formData.fullName || 'Chưa cập nhật'}
              </h2>
              <p className="text-gray-600">{formData.speciality}</p>
              {formData.clinicName && (
                <p className="text-sm text-blue-600">{formData.clinicName}</p>
              )}
            </div>
          </div>
          {!isEditing ? (
            <Button 
              variant="primary" 
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Edit2 size={18} className="mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField 
            icon={User} 
            label="Họ và tên" 
            name="fullName" 
            value={formData.fullName} 
            isEditing={isEditing} 
            onChange={handleChange} 
          />
          <InfoField 
            icon={Mail} 
            label="Email" 
            name="email" 
            value={formData.email} 
            isEditing={false} // Email không chỉnh sửa được
            onChange={handleChange} 
          />
          <InfoField 
            icon={Phone} 
            label="Số điện thoại" 
            name="phone" 
            value={formData.phone} 
            isEditing={isEditing} 
            onChange={handleChange} 
          />
          <InfoField 
            icon={Award} 
            label="Chuyên khoa" 
            name="speciality" 
            value={formData.speciality} 
            isEditing={false}
            onChange={handleChange} 
          />
          <InfoField 
            icon={Calendar} 
            label="Ngày sinh" 
            name="dateOfBirth" 
            value={formData.dateOfBirth} 
            isEditing={false}
            onChange={handleChange} 
          />
          <InfoField 
            icon={User} 
            label="Giới tính" 
            name="gender" 
            value={formData.gender} 
            isEditing={false}
            onChange={handleChange} 
          />
          <div className="md:col-span-2">
            <InfoField 
              icon={MapPin} 
              label="Tên phòng khám" 
              name="clinicName" 
              value={formData.clinicName} 
              isEditing={isEditing} 
              onChange={handleChange} 
              placeholder="Tên phòng khám"
            />
          </div>
          <div className="md:col-span-2">
            <InfoField 
              icon={MapPin} 
              label="Mô tả phòng khám" 
              name="clinicDescription" 
              value={formData.clinicDescription} 
              isEditing={isEditing} 
              onChange={handleChange} 
              isTextArea={true}
              placeholder="Mô tả về phòng khám..."
            />
          </div>
          <div className="md:col-span-2">
            <InfoField 
              icon={MapPin} 
              label="Địa chỉ" 
              name="address" 
              value={formData.address} 
              isEditing={isEditing} 
              onChange={handleChange} 
              placeholder="Địa chỉ đầy đủ"
            />
          </div>
          <div className="md:col-span-2">
            <InfoField 
              icon={User} 
              label="Giới thiệu bản thân" 
              name="bio" 
              value={formData.bio} 
              isEditing={isEditing} 
              onChange={handleChange} 
              isTextArea={true}
              placeholder="Giới thiệu về bản thân và chuyên môn..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// InfoField component giữ nguyên
const InfoField = ({ 
  icon: Icon, 
  label, 
  name, 
  value, 
  isEditing, 
  onChange, 
  placeholder = "",
  isTextArea = false 
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-blue-600" />
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    {isEditing ? (
      isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      )
    ) : (
      <div className="px-4 py-3 bg-gray-50 rounded-lg min-h-[48px] flex items-center">
        <p className={`text-gray-800 font-medium ${!value ? 'text-gray-400' : ''}`}>
          {value || 'Chưa cập nhật'}
        </p>
      </div>
    )}
  </div>
);

export default DoctorProfile;