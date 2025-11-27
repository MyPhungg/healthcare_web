import AuthService from './authService';

const API_BASE_URL = 'http://localhost:8082/api';

class DoctorService {
  // Lấy danh sách tất cả doctors
  static async getAllDoctors() {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/doctors`, {
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
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  // Lấy thông tin doctor theo userId
  static async getDoctorProfile(userId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/doctors/user/${userId}`, {
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

  // Lấy danh sách chuyên khoa
  static async getSpecialities() {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/specialities`, {
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
      console.error('Error fetching specialities:', error);
      throw error;
    }
  }

  // Các method cũ giữ nguyên
  static formatUpdateData(data) {
    const formatted = { ...data };
    
    // Format gender từ tiếng Việt sang English
    if (formatted.gender) {
      formatted.gender = this.convertGenderToEnglish(formatted.gender);
    } else {
      formatted.gender = 'OTHER';
    }
    
    // Format dateOfBirth từ dd/MM/yyyy sang yyyy-MM-dd
    if (formatted.dateOfBirth) {
      formatted.dateOfBirth = this.formatDateToBackend(formatted.dateOfBirth);
    }
    
    // Đảm bảo các field string không null
    const stringFields = ['fullName', 'phone', 'bio', 'clinicName', 'clinicDescription', 'address','specialityId' ,'district', 'city'];
    stringFields.forEach(field => {
      if (formatted[field] === null || formatted[field] === undefined) {
        formatted[field] = '';
      }
    });

    return formatted;
  }

  static convertGenderToEnglish(gender) {
    const genderMap = {
      'nam': 'MALE',
      'nữ': 'FEMALE', 
      'nam giới': 'MALE',
      'nữ giới': 'FEMALE',
      'khác': 'OTHER',
      'other': 'OTHER',
      'male': 'MALE',
      'female': 'FEMALE'
    };
    
    const normalizedGender = gender.toLowerCase().trim();
    return genderMap[normalizedGender] || 'OTHER';
  }

  static formatDateToBackend(dateString) {
    if (!dateString) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    
    return dateString;
  }

  static async updateDoctorProfile(doctorId, updateData) {
    try {
      const token = AuthService.getToken();
      const formattedData = this.formatUpdateData(updateData);

      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateDoctorProfile:', error);
      throw error;
    }
  }

  static async getSpecialityName(specialityId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/specialities/${specialityId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const speciality = await response.json();
        return speciality.specialityName || 'Chưa cập nhật';
      }
      return 'Chưa cập nhật';
    } catch (error) {
      console.error('Error fetching speciality:', error);
      return 'Chưa cập nhật';
    }
  }
}

export default DoctorService;