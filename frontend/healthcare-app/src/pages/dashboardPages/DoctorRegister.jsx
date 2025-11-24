import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, FileText, Building } from 'lucide-react';
import InputComp from '../../components/common/inputComp';
import Button from '../../components/common/button';
import AuthService from '../../service/authService';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'MALE',
    dateOfBirth: '',
    address: '',
    district: '',
    city: '',
    specialityId: '',
    clinicName: '',
    clinicDescription: '',
    bio: '',
    profileImg: null,
    coverImg: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [specialities, setSpecialities] = useState([]);

  // Lấy danh sách chuyên khoa từ API
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const token = AuthService.getToken();
        const response = await fetch('http://localhost:8082/api/specialities', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSpecialities(data);
        }
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    fetchSpecialities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error khi user nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Quận/huyện là bắt buộc';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Thành phố là bắt buộc';
    }

    if (!formData.specialityId) {
      newErrors.specialityId = 'Chuyên khoa là bắt buộc';
    }

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Tên phòng khám là bắt buộc';
    }

    if (!formData.clinicDescription.trim()) {
      newErrors.clinicDescription = 'Mô tả phòng khám là bắt buộc';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Giới thiệu bản thân là bắt buộc';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const token = AuthService.getToken();
      const userId = AuthService.getUserId();

      if (!token || !userId) {
        throw new Error('Không tìm thấy thông tin xác thực');
      }

      // Chuẩn bị data để gửi lên API
      const doctorData = {
        userId: userId,
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        district: formData.district,
        city: formData.city,
        specialityId: formData.specialityId,
        clinicName: formData.clinicName,
        clinicDescription: formData.clinicDescription,
        bio: formData.bio,
        profileImg: formData.profileImg,
        coverImg: formData.coverImg
      };

      console.log('Gửi dữ liệu bác sĩ:', doctorData);

      const response = await fetch('http://localhost:8082/api/doctors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Tạo hồ sơ bác sĩ thất bại: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Tạo hồ sơ bác sĩ thành công:', result);

      // Chuyển hướng đến trang bác sĩ sau khi thành công
      navigate('/doctor');

    } catch (error) {
      console.error('Lỗi tạo hồ sơ bác sĩ:', error);
      setErrors({ submit: error.message || 'Có lỗi xảy ra khi tạo hồ sơ bác sĩ' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-40">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Đăng Ký Thông Tin Bác Sĩ
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Vui lòng cung cấp đầy đủ thông tin để hoàn tất hồ sơ bác sĩ của bạn
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cá nhân */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputComp
                label="Họ và tên"
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên đầy đủ"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                icon={User}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>

              <InputComp
                label="Ngày sinh"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
                icon={Calendar}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chuyên khoa
                </label>
                <select
                  name="specialityId"
                  value={formData.specialityId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Chọn chuyên khoa</option>
                  {specialities.map(spec => (
                    <option key={spec.specialityId} value={spec.specialityId}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {errors.specialityId && (
                  <p className="text-red-500 text-sm mt-1">{errors.specialityId}</p>
                )}
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputComp
                label="Địa chỉ"
                type="text"
                name="address"
                placeholder="Số nhà, đường"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                icon={MapPin}
                required
              />

              <InputComp
                label="Quận/Huyện"
                type="text"
                name="district"
                placeholder="Quận/Huyện"
                value={formData.district}
                onChange={handleInputChange}
                error={errors.district}
                icon={MapPin}
                required
              />

              <InputComp
                label="Thành phố"
                type="text"
                name="city"
                placeholder="Thành phố"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                icon={MapPin}
                required
              />
            </div>

            {/* Thông tin phòng khám */}
            <div className="space-y-6">
              <InputComp
                label="Tên phòng khám"
                type="text"
                name="clinicName"
                placeholder="Tên phòng khám"
                value={formData.clinicName}
                onChange={handleInputChange}
                error={errors.clinicName}
                icon={Building}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả phòng khám
                </label>
                <textarea
                  name="clinicDescription"
                  value={formData.clinicDescription}
                  onChange={handleInputChange}
                  placeholder="Mô tả về phòng khám, dịch vụ cung cấp..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  required
                />
                {errors.clinicDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.clinicDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới thiệu bản thân
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Kinh nghiệm, chuyên môn, thành tích..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  required
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
              </div>
            </div>

            {/* Upload ảnh (tùy chọn) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <input
                  type="file"
                  name="profileImg"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh bìa
                </label>
                <input
                  type="file"
                  name="coverImg"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Lỗi submit */}
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {errors.submit}
              </div>
            )}

            {/* Nút submit */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="large"
                disabled={isLoading}
                className="min-w-48"
              >
                {isLoading ? 'Đang xử lý...' : 'Hoàn Tất Đăng Ký'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;