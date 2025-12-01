// services/paymentService.js
import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8081';

class PaymentService {
  // Tạo thanh toán MoMo - Cập nhật theo BE
  static async createMomoPayment(appointmentId, amount, patientName, doctorName, appointmentDate, appointmentTime) {
    try {
      const token = AuthService.getToken();
      
      const paymentRequest = {
        appointmentId: appointmentId,
        amount: amount, // BE sẽ lấy amount từ schedule
        patientName: patientName,
        orderInfo: `Thanh toán lịch hẹn với ${doctorName} vào ${appointmentDate} ${appointmentTime}`,
        extraData: JSON.stringify({
          patientName: patientName,
          doctorName: doctorName,
          appointmentDate: appointmentDate,
          appointmentTime: appointmentTime
        })
      };

      console.log('Creating MoMo payment request:', paymentRequest);

      const response = await fetch(`${API_BASE_URL}/api/payment/momo/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('MoMo payment error response:', errorText);
        throw new Error(`Không thể tạo thanh toán: ${errorText}`);
      }

      const result = await response.json();
      console.log('MoMo payment response:', result);
      
      return result;
    } catch (error) {
      console.error('Error creating MoMo payment:', error);
      throw error;
    }
  }

  // Lấy trạng thái appointment
  static async getAppointmentStatus(appointmentId) {
    try {
      const token = AuthService.getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/payment/appointment/${appointmentId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể lấy trạng thái: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting appointment status:', error);
      throw error;
    }
  }

  // Hủy appointment
  static async cancelAppointment(appointmentId) {
    try {
      const token = AuthService.getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/payment/appointment/${appointmentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể hủy lịch hẹn: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Đơn giản hóa: chỉ lưu 1 pending payment
  static savePendingPayment(paymentData) {
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
  }

  static getPendingPayment() {
    const payment = localStorage.getItem('pendingPayment');
    return payment ? JSON.parse(payment) : null;
  }

  static clearPendingPayment() {
    localStorage.removeItem('pendingPayment');
  }
  // Thêm vào PaymentService.js (cuối class)
static hasPendingPayment() {
  const payment = this.getPendingPayment();
  if (!payment) return false;
  
  // Kiểm tra nếu đã quá 30 phút
  const now = Date.now();
  const paymentTime = payment.timestamp || 0;
  const thirtyMinutes = 30 * 60 * 1000;
  
  if (now - paymentTime > thirtyMinutes) {
    this.clearPendingPayment();
    return false;
  }
  
  return true;
}
}

export default PaymentService;