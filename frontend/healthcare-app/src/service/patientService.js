import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8082/api';

class PatientService {
  // Lấy danh sách tất cả patients
  static async getAllPatients() {
    try {
      const token = AuthService.getToken();
      console.log('Fetching patients with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Đọc response dưới dạng text trước để debug
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Thử parse JSON
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed patients data:', data);
        return data;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Problematic response text:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  // Lấy patient theo userId
  static async getPatientByUserId(userId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/patients/by-userId/${userId}`,
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

      const responseText = await response.text();
      console.log('Raw response for user patient:', responseText);
      
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error getting patient:', error);
      throw error;
    }
  }

  // Lấy patient theo patientId
  static async getPatientById(patientId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  // Tạo patient mới
  static async createPatient(userId, patientData) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/patients/${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patientData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create patient: ${response.status}`);
      }

      const responseText = await response.text();
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  // Cập nhật patient
  static async updatePatient(patientId, patientData) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patientData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update patient: ${response.status}`);
      }

      const responseText = await response.text();
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  // Xóa patient
  static async deletePatient(patientId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete patient: ${response.status}`);
      }

      // DELETE request có thể không trả về body
      if (response.status === 204) {
        return { success: true };
      }

      const responseText = await response.text();
      if (responseText) {
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid JSON response from server');
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  // Get or create patient
  static async getOrCreatePatient(userId, formData) {
    try {
      const token = AuthService.getToken();
      // Thử lấy patient đã tồn tại
      const existingPatient = await this.getPatientByUserId(userId);
      console.log('Existing patient found:', existingPatient.patientId);
      return existingPatient.patientId;
    } catch (error) {
      // Nếu không có, tạo patient mới
      console.log('Patient not found, creating new patient...');
      
      const patientData = {
        fullName: formData.patientName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        district: formData.district,
        city: formData.city,
        insuranceNum: formData.insuranceNum || `BH${Date.now()}`,
        profileImg: null,
        coverImg: null
      };

      const newPatient = await this.createPatient(userId, patientData);
      console.log('New patient created:', newPatient.patientId);
      return newPatient.patientId;
    }
  }

  // Format date for display
  static formatDate(dateString) {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VI');
    } catch (error) {
      return dateString;
    }
  }

  // Format gender for display
  static formatGender(gender) {
    const genderMap = {
      'MALE': 'Nam',
      'FEMALE': 'Nữ',
      'OTHER': 'Khác'
    };
    return genderMap[gender] || gender || 'Chưa cập nhật';
  }

  // Tạo mock data tạm thời để test UI
  static getMockPatients() {
    return [
      {
        patientId: 'PAT001',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        dateOfBirth: '1990-03-15',
        gender: 'MALE',
        address: '123 Đường Lê Lợi',
        district: 'Quận 1',
        city: 'TP.HCM',
        insuranceNum: 'BH123456',
        isActive: true
      },
      {
        patientId: 'PAT002',
        fullName: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0902345678',
        dateOfBirth: '1985-07-22',
        gender: 'FEMALE',
        address: '456 Đường Nguyễn Huệ',
        district: 'Quận 3',
        city: 'TP.HCM',
        insuranceNum: null,
        isActive: true
      },
      {
        patientId: 'PAT003',
        fullName: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0903456789',
        dateOfBirth: '1995-12-10',
        gender: 'MALE',
        address: '789 Đường Pasteur',
        district: 'Quận 5',
        city: 'TP.HCM',
        insuranceNum: 'BH789012',
        isActive: false
      }
    ];
  }
}

export default PatientService;