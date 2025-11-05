package com.healthcare.appointment_service.controller;

import com.healthcare.appointment_service.dto.CreateAppointmentRequest;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    @Autowired
    AppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentRequest request) {
        try {
            appointmentService.createAppointment(
                    request.getScheduleId(),
                    request.getPatientId(),
                    request.getAppointmentDate(),
                    request.getAppointmentStart(),
                    request.getAppointmentEnd(),
                    request.getInteractedBy(),
                    request.getReason()
            );
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cancel")
    public ResponseEntity<?> cancelledAppointment(@RequestParam String appId){
        try{
            appointmentService.cancelAppointment(appId);
            return ResponseEntity.ok("Hủy lịch thành công");
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Hủy lịch thất bại! "+ e.getMessage());
        }
    }

    @GetMapping("/by-doctor")
    public ResponseEntity<?> getAllAppointmentWithScheduleId(@RequestParam String scheduleId){
        try{
            List<Appointment> list = appointmentService.getAllAppointmentWithScheduleId(scheduleId);
            return ResponseEntity.ok(list);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Không thể lấy danh sách lịch hẹn của bác sĩ" + e.getMessage());
        }
    }

    @GetMapping("/by-patient")
    public ResponseEntity<?> getAllAppointmentWithPatientId(@RequestParam String patientId){
        try{
            List<Appointment> list = appointmentService.getAllAppointmentWithPatientId(patientId);
            return ResponseEntity.ok(list);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Không thể lấy danh sách lịch hẹn của bệnh nhân" + e.getMessage());
        }
    }
}
