// services/appointmentService.js

class AppointmentService {
  static async createAppointment(appointmentData, token) {
    try {
      const response = await fetch(
        'http://localhost:8081/appointments/create',
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

  static async getAppointmentsByPatient(patientId, token) {
    try {
      const response = await fetch(
        `http://localhost:8081/appointments/by-patient?patientId=${patientId}`,
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

  static async cancelAppointment(appointmentId, token) {
    try {
      const response = await fetch(
        `http://localhost:8081/appointments/${appointmentId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel appointment: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw error;
    }
  }
  // services/appointmentService.js

  static async getAppointmentsBySchedule(scheduleId) {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching appointments for schedule:', scheduleId);
      
      const response = await fetch(`http://localhost:8081/appointments/by-doctor?scheduleId=${scheduleId}`, {
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
      console.error('Error in getAppointmentsBySchedule:', error);
      throw error;
    }
  }

  static async cancelAppointment(appointmentId) {
    try {
      const token = localStorage.getItem('token');
      console.log(`Cancelling appointment: ${appointmentId}`);
      
      const response = await fetch(`http://localhost:8081/appointments/cancel?appId=${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Cancel appointment response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Hủy lịch hẹn thất bại';
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
        return await response.json();
      } else {
        return { success: true, message: 'Hủy lịch hẹn thành công' };
      }

    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      throw error;
    }
  }

  static async confirmAppointment(appointmentId) {
    try {
      const token = localStorage.getItem('token');
      console.log(`Confirming appointment: ${appointmentId}`);
      
      // Since there's no direct confirm endpoint, we might need to create one
      // For now, we'll use a custom implementation or check if there's another way
      // This is a placeholder - you'll need to adjust based on your actual API
      const response = await fetch(`http://localhost:8081/appointments/confirm?appId=${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Confirm appointment response status:', response.status);

      if (!response.ok) {
        // If confirm endpoint doesn't exist, we'll handle it gracefully
        if (response.status === 404) {
          console.log('Confirm endpoint not available, appointment status remains PENDING');
          return { success: true, message: 'Lịch hẹn đã được giữ nguyên trạng thái chờ xác nhận' };
        }
        
        let errorMessage = 'Xác nhận lịch hẹn thất bại';
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
        return await response.json();
      } else {
        return { success: true, message: 'Xác nhận lịch hẹn thành công' };
      }

    } catch (error) {
      console.error('Error in confirmAppointment:', error);
      throw error;
    }
  }

  static async completeAppointment(appointmentId) {
    try {
      const token = localStorage.getItem('token');
      console.log(`Completing appointment: ${appointmentId}`);
      
      // Placeholder for complete appointment endpoint
      const response = await fetch(`http://localhost:8081/appointments/complete?appId=${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Complete appointment response status:', response.status);

      if (!response.ok) {
        // If complete endpoint doesn't exist, handle gracefully
        if (response.status === 404) {
          console.log('Complete endpoint not available');
          return { success: true, message: 'Chức năng đánh dấu hoàn thành chưa khả dụng' };
        }
        
        let errorMessage = 'Đánh dấu hoàn thành thất bại';
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
        return await response.json();
      } else {
        return { success: true, message: 'Đánh dấu hoàn thành thành công' };
      }

    } catch (error) {
      console.error('Error in completeAppointment:', error);
      throw error;
    }
  }

  static async getPatientInfo(patientId) {
    try {
      const token = localStorage.getItem('token');
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

  static async getAppointmentInfo(appointmentId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/appointments/info?appointmentId=${appointmentId}`, {
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
      console.error('Error fetching appointment info:', error);
      return null;
    }
  }
}

export default AppointmentService;