import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../../components/common/button';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

//   useEffect(() => {
//     // Nếu không có dữ liệu booking, chuyển về trang chủ
//     if (!bookingData) {
//       navigate('/');
//     }
//   }, [bookingData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 mt-20">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Lịch hẹn đã được đặt
        </h1>
        <p className="text-xl text-blue-600 mb-8">
          Cảm ơn vì đã sử dụng dịch vụ.
        </p>

        {/* Booking Details (Optional) */}
        {bookingData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">
              Thông tin lịch hẹn:
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Bác sĩ:</span>{' '}
                {bookingData.doctorName}
              </p>
              <p>
                <span className="font-medium">Bệnh nhân:</span>{' '}
                {bookingData.patientName}
              </p>
              <p>
                <span className="font-medium">Ngày khám:</span>{' '}
                {bookingData.appointmentDate}
              </p>
              <p>
                <span className="font-medium">Giờ khám:</span>{' '}
                {bookingData.appointmentTime}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{' '}
                {bookingData.phone}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/profile')}
          >
            Xem lịch hẹn của tôi
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/home')}
          >
            Về trang chủ
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Thông tin chi tiết đã được gửi đến email của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;