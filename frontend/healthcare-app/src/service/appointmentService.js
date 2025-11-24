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
}

export default AppointmentService;