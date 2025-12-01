// src/pages/webPages/paymentCallBack.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, AlertCircle, RefreshCw } from 'lucide-react';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [appointmentStatus, setAppointmentStatus] = useState('PENDING');

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Debug: Log tất cả params
        console.log('=== MoMo Callback Params ===');
        const params = {};
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }
        console.log('Full params:', params);

        // Lấy các param chính
        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');
        const momoMessage = searchParams.get('message');
        
        if (!orderId) {
          setStatus('error');
          setMessage('Không tìm thấy mã lịch hẹn');
          return;
        }

        // Lấy thông tin từ localStorage
        const pendingPayment = localStorage.getItem('pendingPayment');
        let paymentData = null;
        
        if (pendingPayment) {
          try {
            paymentData = JSON.parse(pendingPayment);
            setAppointmentInfo(paymentData);
          } catch (e) {
            console.error('Error parsing payment data:', e);
          }
        }

        // Kiểm tra kết quả thanh toán từ MoMo
        const isSuccess = resultCode === '0' || resultCode === '00' || resultCode === '000';
        
        if (isSuccess) {
          // THANH TOÁN THÀNH CÔNG TRÊN MOMO
          setStatus('success');
          setMessage('Thanh toán thành công! Đang xác nhận lịch hẹn...');
          
          // QUAN TRỌNG: Gọi API confirm appointment
          await confirmAppointment(orderId);
          
          // Sau đó kiểm tra trạng thái
          const updatedStatus = await checkAppointmentStatus(orderId);
          setAppointmentStatus(updatedStatus);
          
          // Xóa pending payment
          localStorage.removeItem('pendingPayment');
          
        } else {
          // THANH TOÁN THẤT BẠI
          setStatus('failed');
          setMessage(`Thanh toán không thành công. ${momoMessage || 'Vui lòng thử lại.'}`);
          
          // Tự động hủy appointment
          setTimeout(async () => {
            await cancelAppointment(orderId);
          }, 3000);
          
          localStorage.removeItem('pendingPayment');
        }
        
      } catch (error) {
        console.error('Error processing payment callback:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xử lý thanh toán.');
      }
    };

    processPaymentCallback();
  }, [searchParams]);

  // Hàm confirm appointment - GỌI KHI THANH TOÁN THÀNH CÔNG
  const confirmAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/appointments/change?appId=${appointmentId}&status=CONFIRMED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Appointment confirmed successfully');
        return true;
      } else {
        console.log('Failed to confirm appointment, but MoMo payment succeeded');
        return false;
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      return false;
    }
  };

  // Hàm kiểm tra trạng thái appointment từ BE
  const checkAppointmentStatus = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/appointments/${appointmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Appointment status from BE:', data.status);
        return data.status || 'PENDING';
      }
    } catch (error) {
      console.error('Error checking appointment status:', error);
    }
    return 'PENDING';
  };

  // Hàm hủy appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8081/api/payment/appointment/${appointmentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Appointment cancelled');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  // Countdown cho redirect
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            redirectToSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [status]);

  const redirectToSuccess = () => {
    const pendingPayment = localStorage.getItem('pendingPayment');
    let paymentData = null;
    
    if (pendingPayment) {
      try {
        paymentData = JSON.parse(pendingPayment);
      } catch (e) {
        console.error('Error parsing payment data:', e);
      }
    }
    
    // Tạo đối tượng booking info đầy đủ
    const bookingSuccessData = {
      appointmentId: searchParams.get('orderId') || paymentData?.appointmentId,
      patientId: paymentData?.patientId,
      doctorName: paymentData?.doctorName || 'Bác sĩ',
      appointmentDate: paymentData?.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentStart: paymentData?.appointmentStart || '00:00',
      appointmentEnd: paymentData?.appointmentEnd || '00:30',
      reason: paymentData?.reason || 'Khám bệnh',
      status: appointmentStatus, // Sử dụng status từ BE
      totalPrice: paymentData?.totalPrice || searchParams.get('amount') || 0,
      paymentMethod: 'momo',
      paymentStatus: 'paid',
      paymentAmount: searchParams.get('amount'),
      paymentResultCode: searchParams.get('resultCode'),
      message: 'Thanh toán MoMo thành công'
    };
    
    console.log('Redirecting with data:', bookingSuccessData);
    
    navigate('/bookingsuccess', {
      state: bookingSuccessData
    });
  };

  const handleManualRedirect = () => {
    redirectToSuccess();
  };

  const handleRetryPayment = () => {
    navigate('/booking');
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Đang xác nhận thanh toán...
            </h2>
            <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              ✅ Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {/* Hiển thị trạng thái appointment */}
            <div className={`p-3 rounded-lg mb-6 ${
              appointmentStatus === 'CONFIRMED' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {appointmentStatus === 'CONFIRMED' ? (
                  <>
                    <CheckCircle size={20} />
                    <span className="font-medium">Lịch hẹn đã được xác nhận</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span className="font-medium">Đang chờ xác nhận lịch hẹn...</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <p><span className="font-medium">Mã lịch hẹn:</span> {searchParams.get('orderId')}</p>
                <p><span className="font-medium">Số tiền:</span> {(searchParams.get('amount') || 0).toLocaleString('vi-VN')} đ</p>
                <p><span className="font-medium">Trạng thái MoMo:</span> Thành công</p>
                <p><span className="font-medium">Trạng thái lịch hẹn:</span> {appointmentStatus}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Tự động chuyển hướng trong <span className="font-bold text-blue-600">{countdown}</span> giây...
            </p>
            
            <button
              onClick={handleManualRedirect}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Xem chi tiết lịch hẹn ngay
            </button>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              ❌ Thanh toán không thành công
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-red-700 font-medium">Thông báo</p>
                  <p className="text-xs text-red-600 mt-1">
                    • Lịch hẹn đã tự động bị hủy<br/>
                    • Bạn có thể đặt lịch lại<br/>
                    • Nếu đã thanh toán, vui lòng liên hệ hỗ trợ
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetryPayment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                Đặt lịch lại
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              ⚠️ Đã xảy ra lỗi
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                Xem lịch hẹn của tôi
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentCallback;