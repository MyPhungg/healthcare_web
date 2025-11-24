// services/authService.js

class AuthService {
  static async register(userData) {
    try {
      const response = await fetch('http://localhost:8082/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const response = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
  static getUserId() {
    const user = this.getCurrentUser();
    return user?.userId || localStorage.getItem('userId') || null;
  }

  // Helper function để chuyển hướng theo role
  static getRedirectPathByRole(role) {
    const rolePaths = {
      'DOCTOR': '/doctor/dashboard',
      'ADMIN': '/dashboard',
      'PATIENT': '/home'
    };
    return rolePaths[role] || '/home';
  }
   static async checkDoctorProfileExists(userId) {
    try {
      const token = this.getToken();
      console.log('Checking doctor profile for user:', userId);
      
      const response = await fetch(`http://localhost:8082/api/doctors/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Doctor profile check response status:', response.status);
      
      if (response.ok) {
        const doctorData = await response.json();
        console.log('Doctor profile exists:', doctorData);
        return true;
      } else if (response.status === 404) {
        console.log('Doctor profile not found (404)');
        return false;
      } else {
        console.log('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error checking doctor profile:', error);
      return false;
    }
  }
}


export default AuthService;