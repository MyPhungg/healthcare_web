// services/bookingService.js
import PatientService from './patientService';
import AppointmentService from './appointmentService';

class BookingService {
  static async createBooking(userId, formData, scheduleData, doctorInfo, token) {
    try {
      // Step 1: Lấy hoặc tạo patient
      const patientId = await PatientService.getOrCreatePatient(userId, formData, token);
      
      // Step 2: Tạo appointment
      const appointmentData = {
        scheduleId: scheduleData?.scheduleId || 'sch30000001',
        patientId: patientId,
        appointmentDate: formData.appointmentDate,
        appointmentStart: formData.appointmentTime + ':00',
        appointmentEnd: this.calculateEndTime(formData.appointmentTime, scheduleData?.slotDuration || 30),
        interactedBy: userId,
        reason: formData.reason || 'Khám bệnh theo lịch hẹn'
      };

      const appointmentResult = await AppointmentService.createAppointment(appointmentData, token);

      return {
        patientId,
        appointmentId: appointmentResult.appointmentId || `appt${Date.now()}`,
        appointmentDate: formData.appointmentDate,
        appointmentStart: formData.appointmentTime,
        appointmentEnd: this.calculateEndTime(formData.appointmentTime, scheduleData?.slotDuration || 30),
        reason: formData.reason,
        status: 'PENDING',
        doctorName: doctorInfo.name,
        totalPrice: doctorInfo.price
      };
    } catch (error) {
      console.error('Error in booking service:', error);
      throw error;
    }
  }

  static calculateEndTime(startTime, slotDuration = 30) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours);
    endTime.setMinutes(minutes + slotDuration);
    return endTime.toTimeString().slice(0, 8);
  }
}

export default BookingService;