import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8082/api';

class PatientService {
  // Lấy danh sách tất cả patients
  static async getAllPatients() {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  // Tạo patient mới với multipart/form-data - FIXED VERSION
  static async createPatient(userId, patientData) {
    try {
      const token = AuthService.getToken();
      
      console.log('Creating patient with data:', { userId, patientData });
      
      // Tạo FormData object
      const formData = new FormData();
      
      // Thêm các trường text vào formData
      formData.append('fullName', patientData.fullName || '');
      formData.append('gender', patientData.gender || 'OTHER');
      formData.append('dateOfBirth', patientData.dateOfBirth || '');
      formData.append('address', patientData.address || '');
      formData.append('district', patientData.district || '');
      formData.append('city', patientData.city || '');
      formData.append('insuranceNum', patientData.insuranceNum || '');
      
      // Thêm file ảnh nếu có
      if (patientData.profileImg && patientData.profileImg instanceof File) {
        formData.append('profileImg', patientData.profileImg);
      }
      if (patientData.coverImg && patientData.coverImg instanceof File) {
        formData.append('coverImg', patientData.coverImg);
      }

      const url = `${API_BASE_URL}/patients/${userId}`;
      console.log('Request URL:', url);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // KHÔNG set Content-Type header, browser sẽ tự động set với boundary
        },
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorText = await response.text();
          errorDetail = errorText;
          console.error('Server error response:', errorText);
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        
        throw new Error(`Failed to create patient: ${response.status} - ${errorDetail}`);
      }

      // Xử lý response
      let result;
      try {
        result = await response.json();
        console.log('Patient created successfully:', result);
      } catch (jsonError) {
        console.warn('Response is not JSON, might be empty');
        result = { success: true, patientId: `PAT${Date.now()}` };
      }

      return result;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  // Cập nhật patient với multipart/form-data
  static async updatePatient(patientId, patientData) {
    try {
      const token = AuthService.getToken();
      
      // Tạo FormData object
      const formData = new FormData();
      
      // Thêm các trường text vào formData
      formData.append('fullName', patientData.fullName || '');
      formData.append('gender', patientData.gender || 'OTHER');
      formData.append('dateOfBirth', patientData.dateOfBirth || '');
      formData.append('address', patientData.address || '');
      formData.append('district', patientData.district || '');
      formData.append('city', patientData.city || '');
      formData.append('insuranceNum', patientData.insuranceNum || '');
      
      // Thêm file ảnh nếu có
      if (patientData.profileImg && patientData.profileImg instanceof File) {
        formData.append('profileImg', patientData.profileImg);
      }
      if (patientData.coverImg && patientData.coverImg instanceof File) {
        formData.append('coverImg', patientData.coverImg);
      }

      const url = `${API_BASE_URL}/patients/${patientId}`;
      console.log('Update request URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorText = await response.text();
          errorDetail = errorText;
        } catch (textError) {
          console.error('Cannot read error text:', textError);
        }
        throw new Error(`Failed to update patient: ${response.status} - ${errorDetail}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }
  
  // Get or create patient - IMPROVED VERSION
  static async getOrCreatePatient(userId, formData) {
    try {
      console.log('Getting or creating patient for user:', userId);
      
      // Thử lấy patient đã tồn tại
      const existingPatient = await this.getPatientByUserId(userId);
      
      if (existingPatient && existingPatient.patientId) {
        console.log('Existing patient found:', existingPatient.patientId);
        return existingPatient.patientId;
      }
      
      // Nếu không có, tạo patient mới
      console.log('Patient not found, creating new patient...');
      
      const patientData = {
        fullName: formData.patientName || formData.fullName || '',
        gender: formData.gender || 'OTHER',
        dateOfBirth: formData.dateOfBirth || '',
        address: formData.address || '',
        district: formData.district || '',
        city: formData.city || '',
        insuranceNum: formData.insuranceNum || `BH${Date.now()}`,
        profileImg: formData.profileImg || null,
        coverImg: formData.coverImg || null
      };

      console.log('Creating patient with data:', patientData);

      const newPatient = await this.createPatient(userId, patientData);
      console.log('New patient created:', newPatient);
      
      return newPatient.patientId || newPatient.id || `PAT${Date.now()}`;
    } catch (error) {
      console.error('Error in getOrCreatePatient:', error);
      
      // Fallback: trả về patientId tạm thời để booking có thể tiếp tục
      const fallbackPatientId = `PAT${Date.now()}`;
      console.warn('Using fallback patientId:', fallbackPatientId);
      return fallbackPatientId;
    }
  }

  // Upload ảnh profile cho patient
  static async uploadProfilePicture(patientId, file) {
    try {
      const token = AuthService.getToken();
      
      const formData = new FormData();
      formData.append('profileImg', file);

      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload profile picture: ${response.status}`);
      }

      const updatedPatient = await this.getPatientById(patientId);
      return updatedPatient;
    } catch (error) {
      console.error('Upload profile picture failed', error);
      throw error;
    }
  }

  // Upload ảnh cover cho patient
  static async uploadCoverPicture(patientId, file) {
    try {
      const token = AuthService.getToken();
      
      const formData = new FormData();
      formData.append('coverImg', file);

      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload cover picture: ${response.status}`);
      }

      const updatedPatient = await this.getPatientById(patientId);
      return updatedPatient;
    } catch (error) {
      console.error('Upload cover picture failed', error);
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
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete patient: ${response.status}`);
      }

      return { success: true, message: 'Patient deleted successfully' };
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
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

  // Helper để convert file input thành File object
  static async fileToFileObject(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      return null;
    }
    return fileInput.files[0];
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
      }
    ];
  }
}

export default PatientService;