import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, MapPin, FileText, CreditCard } from 'lucide-react';
import FormField from '../../components/common/formField';
import Button from '../../components/common/button';
import { useNavigate } from 'react-router-dom';
const Booking = () => {
  // Doctor info (from previous page/route)
  const navigate = useNavigate();
  const doctorInfo = {
    name: 'TS.BS. Long Giang Bình Tân',
    specialty: 'Hiện đang làm việc tại: BV...',
    experience: 'Có kinh nghiệm 10 năm trong ngành',
    location: 'Thành phố Hồ Chí Minh',
    image: '/doctor-placeholder.jpg' // Replace with actual image
  };

  const [formData, setFormData] = useState({
    patientName: '',
    gender: 'male',
    phone: '',
    email: '',
    dateOfBirth: '',
    city: '',
    district: '',
    address: '',
    reason: '',
    appointmentDate: '',
    appointmentTime: '',
    paymentMethod: 'cash'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking data:', formData);
    // TODO: Submit booking
  };

  const pricePerVisit = 300000;
  const total = pricePerVisit;

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Doctor Image */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <User size={64} className="text-gray-400" />
              </div>

              {/* Doctor Details */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {doctorInfo.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{doctorInfo.specialty}</p>
              <p className="text-sm text-gray-600 mb-3">{doctorInfo.experience}</p>
              
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <MapPin size={18} />
                <span className="text-sm">{doctorInfo.location}</span>
              </div>

              {/* Date & Time Selection */}
              <div className="border-t pt-4">
                <FormField
                  as="select"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  placeholder="Chọn ngày"
                  required
                  options={[
                    { value: '2024-01-15', label: 'Thứ 2, 15/01/2024' },
                    { value: '2024-01-16', label: 'Thứ 3, 16/01/2024' },
                    { value: '2024-01-17', label: 'Thứ 4, 17/01/2024' },
                  ]}
                />

                <FormField
                  as="select"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  placeholder="Chọn giờ"
                  required
                  options={[
                    { value: '08:00', label: '8:00 - 9:00' },
                    { value: '09:00', label: '9:00 - 10:00' },
                    { value: '10:00', label: '10:00 - 11:00' },
                    { value: '14:00', label: '14:00 - 15:00' },
                    { value: '15:00', label: '15:00 - 16:00' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thông tin bệnh nhân
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Patient Name */}
                <FormField
                  icon={User}
                  label="Họ và tên người bệnh (Đặt hộ)"
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />

                {/* Gender Selection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <User size={20} className="text-gray-700" />
                    </div>
                    <label className="text-gray-800 font-medium">Giới tính</label>
                  </div>
                  <div className="flex gap-6 pl-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>Nam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>

                {/* Phone */}
                <FormField
                  icon={Phone}
                  label="Số điện thoại"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                />

                {/* Email */}
                <FormField
                  icon={Mail}
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  required
                />

                {/* Date of Birth */}
                <FormField
                  icon={Calendar}
                  label="Ngày tháng năm sinh (dd/mm/yyyy)"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />

                {/* City */}
                <FormField
                  icon={MapPin}
                  label="Chọn tỉnh thành"
                  as="select"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Chọn tỉnh thành"
                  required
                  options={[
                    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
                    { value: 'hanoi', label: 'Hà Nội' },
                    { value: 'danang', label: 'Đà Nẵng' },
                  ]}
                />

                {/* District */}
                <FormField
                  icon={MapPin}
                  label="Chọn Quận/Huyện"
                  as="select"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Chọn quận/huyện"
                  required
                  options={[
                    { value: 'q1', label: 'Quận 1' },
                    { value: 'q2', label: 'Quận 2' },
                    { value: 'q3', label: 'Quận 3' },
                  ]}
                />

                {/* Address */}
                <FormField
                  icon={MapPin}
                  label="Địa chỉ"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi tiết"
                  required
                />

                {/* Reason */}
                <FormField
                  icon={FileText}
                  label="Lý do khám"
                  as="textarea"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                  rows={4}
                />

                {/* Payment Method */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <CreditCard size={20} className="text-gray-700" />
                    </div>
                    <label className="text-gray-800 font-medium">
                      Thanh toán tại cơ sở y tế
                    </label>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg">Giá khám:</span>
                    <span className="text-2xl font-bold">
                      {pricePerVisit.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="border-t border-blue-400 pt-3 flex justify-between items-center">
                    <span className="text-lg">Tổng cộng:</span>
                    <span className="text-3xl font-bold text-yellow-300">
                      {total.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="primary" fullWidth onClick={()=> navigate('/bookingsuccess')}>
                  Đặt lịch ngay
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;