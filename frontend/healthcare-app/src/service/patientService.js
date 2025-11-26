// services/patientService.js

class PatientService {
  static async getPatientByUserId(userId, token) {
    try {
      const response = await fetch(
        `http://localhost:8082/api/patients/by-userId/${userId}`,
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
      console.error('Error getting patient:', error);
      throw error;
    }
  }

  static async createPatient(userId, patientData, token) {
    try {
      const response = await fetch(
        `http://localhost:8082/api/patients/${userId}`,
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

      return await response.json();
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  static async getOrCreatePatient(userId, formData, token) {
    try {
      // Thử lấy patient đã tồn tại
      const existingPatient = await this.getPatientByUserId(userId, token);
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

      const newPatient = await this.createPatient(userId, patientData, token);
      console.log('New patient created:', newPatient.patientId);
      return newPatient.patientId;
    }
  }

  static async updatePatient(patientId, patientData, token) {
    try {
      const response = await fetch(
        `http://localhost:8082/api/patients/${patientId}`,
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

      return await response.json();
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }
}

export default PatientService;