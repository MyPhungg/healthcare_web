import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8081';

class AppointmentService {
  // Lấy tất cả appointments
  static async getAllAppointments() {
    try {
      const token = AuthService.getToken();
      console.log('Fetching all appointments...');
      
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Appointments response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Không thể lấy danh sách lịch hẹn';
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Appointments data received:', data);
        return data;
      } else {
        const text = await response.text();
        console.warn('Non-JSON response:', text);
        return [];
      }

    } catch (error) {
      console.error('Error in getAllAppointments:', error);
      throw error;
    }
  }
  static async getAppointmentsBySchedule(scheduleId) {
    try {
      const token = AuthService.getToken();
      console.log('Fetching appointments for schedule:', scheduleId);
      
      const response = await fetch(`${API_BASE_URL}/appointments/by-schedule?scheduleId=${scheduleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Appointments by schedule response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Không thể lấy danh sách lịch hẹn theo lịch trình';
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Appointments by schedule data received:', data);
        return data;
      } else {
        const text = await response.text();
        console.warn('Non-JSON response:', text);
        return [];
      }

    } catch (error) {
      console.error('Error in getAppointmentsBySchedule:', error);
      throw error;
    }
  }

  // Lấy appointments theo doctor
  static async getAppointmentsByDoctor(doctorId) {
    try {
      const token = AuthService.getToken();
      console.log('Fetching appointments for doctor:', doctorId);
      
      const response = await fetch(`${API_BASE_URL}/appointments/by-doctor?doctorId=${doctorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Appointments response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Không thể lấy danh sách lịch hẹn';
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Appointments data received:', data);
        return data;
      } else {
        const text = await response.text();
        console.warn('Non-JSON response:', text);
        return [];
      }

    } catch (error) {
      console.error('Error in getAppointmentsByDoctor:', error);
      throw error;
    }
  }

  // Lấy appointments theo patient
  static async getAppointmentsByPatient(patientId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/appointments/by-patient?patientId=${patientId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  }

  // Tạo appointment mới
  static async createAppointment(appointmentData) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/appointments/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(appointmentData)
        }
      );

      let result;
      const responseText = await response.text();
      
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Appointment response is not JSON:', responseText);
          const appointmentIdMatch = responseText.match(/"appointmentId":"([^"]+)"/);
          if (appointmentIdMatch) {
            result = { appointmentId: appointmentIdMatch[1] };
          } else {
            result = { success: true };
          }
        }
      } else {
        result = { success: true };
      }

      if (!response.ok) {
        throw new Error(`Failed to create appointment: ${response.status}`);
      }

      console.log('Appointment created:', result);
      return result;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async changeAppointmentStatus(appointmentId, status) {
    try {
      const token = AuthService.getToken();
      console.log(`Changing appointment ${appointmentId} status to: ${status}`);
      
      const response = await fetch(
        `${API_BASE_URL}/appointments/change?appId=${appointmentId}&status=${status}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Change status response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Không thể thay đổi trạng thái lịch hẹn thành ${status}`;
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Appointment status changed:', result);
        return result;
      } else {
        return { success: true, message: `Đã thay đổi trạng thái thành ${status}` };
      }

    } catch (error) {
      console.error('Error in changeAppointmentStatus:', error);
      throw error;
    }
  }
  static async confirmAppointment(appointmentId) {
    return this.changeAppointmentStatus(appointmentId, 'CONFIRMED');
  }

  static async completeAppointment(appointmentId) {
    return this.changeAppointmentStatus(appointmentId, 'COMPLETED');
  }

  static async cancelAppointment(appointmentId) {
    return this.changeAppointmentStatus(appointmentId, 'CANCELLED');
  }

  static async pendingAppointment(appointmentId) {
    return this.changeAppointmentStatus(appointmentId, 'PENDING');
  }

  // ... các method khác giữ nguyên ...

  // Format status với đầy đủ các trạng thái
  static formatStatus(status) {
    const statusMap = {
      'PENDING': 'pending',
      'CONFIRMED': 'confirmed', 
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || status.toLowerCase();
  }

  // Get status display name
  static getStatusDisplayName(status) {
    const statusNames = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusNames[status] || status;
  }

  // Check if status transition is allowed
  static isStatusTransitionAllowed(currentStatus, newStatus) {
    const allowedTransitions = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [], // Không thể thay đổi sau khi hoàn thành
      'CANCELLED': []  // Không thể thay đổi sau khi hủy
    };
    
    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // Lấy thông tin patient
  static async getPatientInfo(patientId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`http://localhost:8082/api/patients/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching patient info:', error);
      return null;
    }
  }

  // Lấy thông tin doctor
  static async getDoctorInfo(doctorId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`http://localhost:8082/api/doctors/${doctorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      return null;
    }
  }

  // Format date
  static formatDate(dateString) {
    if (!dateString) return 'Chưa cập nhật';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VI');
    } catch (error) {
      return dateString;
    }
  }

  // Format time
  static formatTime(timeString) {
    if (!timeString) return '';
    return timeString.slice(0, 5); // Lấy HH:MM
  }

  // Format status
  static formatStatus(status) {
    const statusMap = {
      'PENDING': 'pending',
      'CONFIRMED': 'confirmed', 
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || status.toLowerCase();
  }

  // Mock data để test UI
  static getMockAppointments() {
    return [
      {
        appointmentId: 'APT001',
        patientId: 'PAT001',
        doctorId: 'DOC001',
        patientName: 'Nguyễn Văn A',
        doctorName: 'Dr. Trần Thị B',
        appointmentDate: '2025-11-20',
        appointmentStart: '09:00',
        appointmentEnd: '09:30',
        specialty: 'Tim mạch',
        reason: 'Khám tổng quát',
        status: 'CONFIRMED',
        totalPrice: 300000
      },
      {
        appointmentId: 'APT002',
        patientId: 'PAT002',
        doctorId: 'DOC002',
        patientName: 'Lê Thị C',
        doctorName: 'Dr. Phạm Văn D',
        appointmentDate: '2025-11-21',
        appointmentStart: '10:00',
        appointmentEnd: '10:30',
        specialty: 'Nhi khoa',
        reason: 'Tiêm phòng',
        status: 'PENDING',
        totalPrice: 200000
      }
    ];
  }
}

export default AppointmentService;