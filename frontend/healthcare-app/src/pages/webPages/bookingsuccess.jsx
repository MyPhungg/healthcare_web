// src/pages/webPages/bookingsuccess.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, CreditCard, MapPin } from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    if (location.state) {
      setBookingInfo(location.state);
      console.log('Booking success state:', location.state);
    } else {
      // Nếu không có state, chuyển về trang chủ
      navigate('/');
    }
  }, [location, navigate]);

  if (!bookingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg">Đang tải thông tin...</div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đặt lịch thành công!
            </h1>
            <p className="text-gray-600">
              Lịch hẹn của bạn đã được ghi nhận. Vui lòng kiểm tra email để xem chi tiết.
            </p>
          </div>

          {/* Booking Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Appointment Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày khám</p>
                    <p className="font-semibold">{bookingInfo.appointmentDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ khám</p>
                    <p className="font-semibold">{bookingInfo.appointmentStart} - {bookingInfo.appointmentEnd}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bác sĩ</p>
                    <p className="font-semibold">{bookingInfo.doctorName}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment & Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                    <p className="font-semibold">
                      {bookingInfo.paymentMethod === 'momo' ? 'Ví MoMo' : 'Tiền mặt tại phòng khám'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className={`font-semibold ${
                      bookingInfo.status === 'CONFIRMED' || bookingInfo.paymentStatus === 'paid' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {bookingInfo.status === 'CONFIRMED' || bookingInfo.paymentStatus === 'paid' 
                        ? 'Đã xác nhận' 
                        : 'Chờ xác nhận'}
                    </p>
                  </div>
                </div>

                {bookingInfo.appointmentId && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Mã lịch hẹn</p>
                    <p className="font-mono font-bold text-lg">{bookingInfo.appointmentId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Payment Status */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Tổng thanh toán</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookingInfo.totalPrice?.toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${
                  bookingInfo.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <span className="font-medium">
                    {bookingInfo.paymentStatus === 'paid' 
                      ? 'Đã thanh toán' 
                      : 'Chờ thanh toán'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Hướng dẫn</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                <span>Vui lòng đến phòng khám trước 15 phút để làm thủ tục</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                <span>Mang theo CMND/CCCD và thẻ BHYT (nếu có)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                <span>Kiểm tra email để xem thông tin chi tiết</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Xem lịch hẹn của tôi
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;