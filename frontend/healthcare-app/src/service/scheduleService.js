// services/scheduleService.js
class ScheduleService {
  static async getDoctorSchedule(doctorId) {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching schedule for doctor:', doctorId);
      
      const response = await fetch(`http://localhost:8081/schedules/by-doctor?doctorId=${doctorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Schedule response status:', response.status);
      console.log('Schedule response ok:', response.ok);

      if (!response.ok) {
        // Nếu response không ok, thử đọc text để xem lỗi
        const errorText = await response.text();
        console.error('Schedule error response:', errorText);
        
        // Nếu là 404 (not found), trả về null thay vì lỗi
        if (response.status === 404) {
          console.log('No schedule found for doctor');
          return null;
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText || 'Không thể lấy lịch làm việc'}`);
      }

      // Kiểm tra content type trước khi parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('Non-JSON response:', text);
        return null;
      }

      const data = await response.json();
      console.log('Schedule data received:', data);
      return data;

    } catch (error) {
      console.error('Error in getDoctorSchedule:', error);
      throw error;
    }
  }

  static async createSchedule(scheduleData) {
    try {
      const token = localStorage.getItem('token');
      console.log('Creating schedule with data:', scheduleData);
      
      const response = await fetch('http://localhost:8081/schedules/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });

      console.log('Create schedule response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Tạo lịch thất bại';
        
        // Thử đọc error message từ response
        try {
          const errorText = await response.text();
          console.error('Create schedule error:', errorText);
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        
        throw new Error(errorMessage);
      }

      // Kiểm tra content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Nếu không phải JSON, trả về success message
        console.log('Schedule created successfully (non-JSON response)');
        return { success: true, message: 'Tạo lịch thành công' };
      }

    } catch (error) {
      console.error('Error in createSchedule:', error);
      throw error;
    }
  }

  static async updateSchedule(scheduleId, scheduleData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });

      console.log('Update schedule response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Cập nhật lịch thất bại';
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
        return { success: true, message: 'Cập nhật lịch thành công' };
      }

    } catch (error) {
      console.error('Error in updateSchedule:', error);
      throw error;
    }
  }

  static async deleteSchedule(scheduleId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete schedule response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Xóa lịch thất bại';
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
        return { success: true, message: 'Xóa lịch thành công' };
      }

    } catch (error) {
      console.error('Error in deleteSchedule:', error);
      throw error;
    }
  }

  static async getDoctorProfile(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/doctors/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin bác sĩ');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getDoctorProfile:', error);
      throw error;
    }
  }
}

export default ScheduleService;