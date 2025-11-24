import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../../components/common/button';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Nhận dữ liệu từ booking page qua state
  const bookingData = location.state || {};

  useEffect(() => {
    // Nếu không có dữ liệu booking, chuyển hướng sau 5 giây
    if (!bookingData.appointmentId) {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate]);

  if (!bookingData.appointmentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">❓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin đặt lịch</h2>
          <p className="text-gray-600 mb-6">Đang chuyển về trang chủ...</p>
          <Button
            variant="primary"
            onClick={() => navigate('/home')}
            fullWidth
          >
            Về trang chủ ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 mt-30">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Đặt lịch thành công!
          </h1>
          <p className="text-gray-600">
            Lịch hẹn của bạn đã được ghi nhận.
          </p>
        </div>

        {/* Basic Booking Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">Thông tin lịch hẹn:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đặt lịch:</span>
              <span className="font-medium">{bookingData.appointmentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày khám:</span>
              <span className="font-medium">{bookingData.appointmentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giờ khám:</span>
              <span className="font-medium">
                {bookingData.appointmentStart?.substring(0, 5)}
              </span>
            </div>
            {bookingData.doctorName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Bác sĩ:</span>
                <span className="font-medium">{bookingData.doctorName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Simple Notes */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Vui lòng đến trước 15 phút. Mang theo CMND/CCCD.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/profile')}
          >
            Xem lịch hẹn
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/home')}
          >
            Về trang chủ
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Mọi thắc mắc vui lòng liên hệ: 1900-1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;