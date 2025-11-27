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

  // Tạo doctor mới với userId trong URL
 // Tạo doctor mới - Phiên bản đã sửa
  // Tạo doctor mới - Phiên bản đã sửa cho phù hợp với backend
  // Tạo doctor mới - Phiên bản debug
  static async createDoctor(doctorData) {
    try {
      const token = AuthService.getToken();
      console.log('🔍 Token:', token ? 'Exists' : 'Missing');
      
      // Tạo FormData object
      const formData = new FormData();
      
      // DEBUG: Log tất cả dữ liệu đầu vào
      console.log('📦 Input doctorData:', doctorData);
      console.log('👤 UserId:', doctorData.userId);
      console.log('🎯 SpecialityId:', doctorData.specialityId);

      // THÊM TẤT CẢ CÁC TRƯỜNG VÀO FormData
      const fields = {
        'userId': doctorData.userId,
        'fullName': doctorData.fullName || '',
        'gender': this.convertGenderToEnglish(doctorData.gender) || 'OTHER',
        'dateOfBirth': this.formatDateToBackend(doctorData.dateOfBirth) || '',
        'address': doctorData.address || '',
        'district': doctorData.district || '',
        'city': doctorData.city || '',
        'specialityId': doctorData.specialityId || '',
        'clinicName': doctorData.clinicName || '',
        'clinicDescription': doctorData.clinicDescription || '',
        'bio': doctorData.bio || ''
      };

      // Thêm các trường vào FormData
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
        console.log(`✅ Added ${key}:`, value);
      });

      // Xử lý file ảnh - QUAN TRỌNG
      console.log('📁 ProfileImg:', doctorData.profileImg);
      console.log('📁 CoverImg:', doctorData.coverImg);

      if (doctorData.profileImg && doctorData.profileImg instanceof File) {
        formData.append('profileImg', doctorData.profileImg);
        console.log('✅ Added profileImg file:', doctorData.profileImg.name);
      } else {
        // Tạo file rỗng nếu không có
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        formData.append('profileImg', emptyFile);
        console.log('⚠️ Added empty profileImg file');
      }

      if (doctorData.coverImg && doctorData.coverImg instanceof File) {
        formData.append('coverImg', doctorData.coverImg);
        console.log('✅ Added coverImg file:', doctorData.coverImg.name);
      } else {
        // Tạo file rỗng nếu không có
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        formData.append('coverImg', emptyFile);
        console.log('⚠️ Added empty coverImg file');
      }

      // DEBUG: Kiểm tra FormData contents
      console.log('🔍 FormData entries:');
      for (let pair of formData.entries()) {
        console.log('  ', pair[0] + ':', pair[1]);
      }

      const url = `${API_BASE_URL}/doctors`;
      console.log('🌐 Sending POST to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // KHÔNG đặt Content-Type khi dùng FormData
        },
        body: formData
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        let errorDetail = '';
        try {
          errorDetail = await response.text();
          console.error('❌ Backend error:', errorDetail);
        } catch (textError) {
          console.error('❌ Cannot read error text:', textError);
        }
        
        // Phân tích lỗi chi tiết hơn
        if (response.status === 400) {
          throw new Error(`Lỗi dữ liệu: ${errorDetail}`);
        } else if (response.status === 401) {
          throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
        } else if (response.status === 500) {
          throw new Error('Lỗi server. Vui lòng thử lại sau.');
        } else {
          throw new Error(`Tạo hồ sơ thất bại: ${response.status} - ${errorDetail}`);
        }
      }

      const result = await response.json();
      console.log('✅ Create doctor success:', result);
      return result;

    } catch (error) {
      console.error('💥 Error in createDoctor:', error);
      throw error;
    }
  }

  // Format data cho update (giữ lại cho các trường hợp cần JSON)
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
    
    if (!gender) return 'OTHER';
    
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

  // Method cũ giữ lại cho tương thích
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
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) return 'Chưa cập nhật';

    const data = await response.json();

    // Tự động detect format
    const name = data?.name || data?.data?.name;

    return name || 'Chưa cập nhật';
  } catch (error) {
    console.error('Error fetching speciality:', error);
    return 'Chưa cập nhật';
  }
}


  // Xóa doctor
  static async deleteDoctor(doctorId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
        method: 'DELETE',
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
      console.error('Error deleting doctor:', error);
      throw error;
    }
  }

  // Lấy doctor theo ID
  static async getDoctorById(doctorId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
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
      console.error('Error fetching doctor by ID:', error);
      throw error;
    }
  }
}

export default DoctorService;