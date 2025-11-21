import React from 'react';
import Button from '../common/button'; 
import { MapPin, Calendar, Clock } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const DoctorScheduleCard = ({ doctor, selectedDate }) => {
  const navigate = useNavigate();
  
  // THÊM DEBUG
  console.log('=== DoctorScheduleCard Debug ===');
  console.log('Doctor data:', doctor);
  console.log('Selected date:', selectedDate);
  
  // Kiểm tra doctor có tồn tại không
  if (!doctor) {
    console.error('Doctor data is undefined or null');
    return (
      <div className="bg-white p-6 mb-6 rounded-xl shadow-lg border border-gray-100">
        <div className="text-red-500">Lỗi: Không có dữ liệu bác sĩ</div>
      </div>
    );
  }

  // Lấy data từ structure thực tế
  const doctorInfo = doctor.doctorDTO || doctor;
  const timeSlots = doctor.list || []; // Danh sách giờ khám

  // Format data từ API - THÊM FALLBACK VALUES
  const {
    doctorId = 'N/A',
    fullName = 'Chưa có thông tin',
    gender = '',
    specialityName = doctorInfo.speciality?.name || 'Chưa có thông tin',
    clinicDescription = '',
    address = 'Chưa có địa chỉ',
    district = '',
    city = 'Chưa có thành phố',
    clinicName = 'Chưa có tên phòng khám',
    price = 0,
    bio = ''
  } = doctorInfo;

  console.log('Doctor info:', doctorInfo);
  console.log('Time slots:', timeSlots);

  // Format ngày
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Ngày không hợp lệ';
    }
  };

  return (
    <div className="bg-white p-6 mb-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Thông tin Bác sĩ */}
        <div className="md:w-1/2 flex gap-4 pr-6 border-r border-gray-200">
          <div className="w-28 h-28 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden self-start flex items-center justify-center">
            {/* Avatar - có thể thêm ảnh từ API nếu có */}
            <span className="text-gray-500 text-sm">Ảnh</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-600 mb-1">
              {fullName ? `BS. ${fullName}` : 'BS. Chưa có tên'}
            </h3>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Bác sĩ chuyên khoa {specialityName}
            </p>
            <p className="text-sm text-gray-500 mb-2 italic">
              {bio || clinicDescription || 'Chuyên khám và tư vấn bệnh lý'}
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-1 text-red-500" />
              <span>Địa điểm: {city}</span>
            </div>
            {/* THÊM THÔNG TIN DEBUG */}
            <div className="mt-2 text-xs text-gray-400">
              ID: {doctorId} | Slots: {timeSlots?.length || 0}
            </div>
          </div>
        </div>

        {/* Lịch khám và Đặt lịch */}
        <div className="md:w-1/2 pl-6">
          
          {/* Ngày khám */}
          <div className="flex flex-col mb-4">
            <span className="font-semibold text-gray-700 flex items-center mb-1">
              <Calendar size={16} className="mr-1 text-teal-500"/>
              Ngày
            </span>
            <div className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center">
              {formatDate(selectedDate)}
            </div>
          </div>
          
          {/* Giờ khám */}
          <div className="flex flex-col w-full mb-4">
            <span className="font-semibold text-gray-700 flex items-center mb-1">
              <Clock size={16} className="mr-1 text-teal-500"/>
              Giờ khám
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.length > 0 ? (
                timeSlots.map((timeSlot, index) => (
                  <div 
                    key={index}
                    className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center cursor-pointer hover:bg-blue-100 transition duration-150"
                  >
                    {timeSlot}
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-2 px-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg text-sm text-center">
                  Không có lịch khám cho ngày này
                </div>
              )}
            </div>
          </div>
          
          {/* Địa chỉ phòng khám */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1 font-medium">Địa chỉ chi tiết:</p>
            <p className="text-base font-medium text-gray-800">
              {clinicName} - {address}, {district}, {city}
            </p>
            <div className="h-px w-full bg-gray-200 mt-2 mb-3"></div>
          </div>
          
          {/* Giá khám và Đặt lịch */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-lg font-bold text-red-600">
              Giá khám: {price ? `${price.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}
            </div>
            
            <Button 
              variant="primary" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => navigate(`/booking?doctorId=${doctorId}&date=${selectedDate}`)}
              disabled={timeSlots.length === 0}
            >
              {timeSlots.length > 0 ? 'Đặt lịch ngay' : 'Không có lịch'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorScheduleCard;