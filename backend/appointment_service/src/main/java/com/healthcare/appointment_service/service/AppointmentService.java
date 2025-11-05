package com.healthcare.appointment_service.service;

import com.healthcare.appointment_service.common.AppointmentStatus;
import com.healthcare.appointment_service.common.CodeGeneratorUtils;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.entity.Schedule;
import com.healthcare.appointment_service.repository.AppointmentRepository;
import com.healthcare.appointment_service.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Transactional
    public void createAppointment(String scheduleId,
                                  String patientId,
                                  LocalDate appointmentDate,
                                  Time appointmentStart,
                                  Time appointmentEnd,
                                  String interactedBy,
                                  String reason) {
        // Sau này nếu cần xác thực thì chỉ thêm logic vào đây
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        String doctorId = schedule.getDoctorId();

        validateDoctorExists(doctorId);

        // Kiểm tra xem có bị trùng lịch không
        // Trùng lịch chung bác sĩ
        boolean slotExists = appointmentRepository.existsByScheduleIdAndAppointmentDateAndAppointmentStartLessThanAndAppointmentEndGreaterThan(scheduleId, appointmentDate, appointmentStart, appointmentEnd);
        if(slotExists){
            throw new RuntimeException("Trùng lịch hẹn chung bác sĩ");
        }

        // Trùng lịch khác bác sĩ
        boolean slotExistsWithOtherDoctor = appointmentRepository.existsTimeSlotOverlap(patientId, appointmentDate, appointmentStart, appointmentEnd);
        if(slotExistsWithOtherDoctor){
            throw  new RuntimeException("Trùng lịch hẹn với bác sĩ khác");
        }


        Appointment app = new Appointment();
        app.setAppointmentId(CodeGeneratorUtils.generateCode("app"));
        app.setScheduleId(scheduleId);
        app.setPatientId(patientId);
        app.setAppointmentDate(appointmentDate);
        app.setAppointmentStart(appointmentStart);
        app.setAppointmentEnd(appointmentEnd);
        app.setInteractedBy(interactedBy);
        app.setReason(reason);
        appointmentRepository.save(app);
    }

    private void validateDoctorExists(String doctorId) {
        // Hiện tại chưa làm gì
        // Sau này có thể gọi sang doctor-service để kiểm tra ID
    }

    public List<Appointment> getAllAppointment(){
        return appointmentRepository.findAll();
    }

    @Transactional
    public Appointment cancelAppointment(String appId){
        Appointment oldApp = appointmentRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn muốn cancel"));
        oldApp.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(oldApp);
        return oldApp;
    }

    // Lấy list lịch hẹn của 1 bác sĩ (1 bác sĩ có 1 scheduleId)
    public List<Appointment> getAllAppointmentWithScheduleId(String scheduleId){
        return appointmentRepository.findByScheduleId(scheduleId);
    }

    // Lấy list lịch hẹn của bệnh nhân
    public List<Appointment> getAllAppointmentWithPatientId(String patientId){
        return appointmentRepository.findByPatientId(patientId);
    }


//    @Transactional
//    public void deleteAppointment(String id){
//        appointmentRepository.deleteById(id);
//    }
}
