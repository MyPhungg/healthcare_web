package com.healthcare.appointment_service.controller;

import com.healthcare.appointment_service.common.AppointmentStatus;
import com.healthcare.appointment_service.dto.AppointmentInfo;
import com.healthcare.appointment_service.dto.AppointmentResponse;
import com.healthcare.appointment_service.dto.CreateAppointmentRequest;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.feign.dto.ScheduleBySpeciality;
import com.healthcare.appointment_service.service.AppointmentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

//    @PreAuthorize("hasAnyAuthority('ADMIN','DOCTOR', 'PATIENT')")
    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentRequest request,
                                               HttpServletRequest req) {
        try {
            String token = req.getHeader("Authorization");
            Appointment newApp = appointmentService.createAppointment(
                    request.getScheduleId(),
                    request.getPatientId(),
                    request.getAppointmentDate(),
                    request.getAppointmentStart(),
                    request.getAppointmentEnd(),
                    request.getInteractedBy(),
                    request.getReason(),
                    token
            );
            return ResponseEntity.ok(newApp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cancel")
    public ResponseEntity<?> cancelledAppointment(@RequestParam String appId, HttpServletRequest req){
        try{
            String token = req.getHeader("Authorization");
            Appointment app = appointmentService.cancelAppointment(appId, token);
            return ResponseEntity.ok("Hủy lịch thành công");
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Hủy lịch thất bại! "+ e.getMessage());
        }
    }

    @GetMapping("/by-doctor")
    public ResponseEntity<?> getAllAppointmentWithScheduleId(@RequestParam String scheduleId){
        try{
            List<AppointmentResponse> list = appointmentService.getAllAppointmentWithScheduleId(scheduleId);
            return ResponseEntity.ok(list);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Không thể lấy danh sách lịch hẹn của bác sĩ" + e.getMessage());
        }
    }

    @GetMapping("/by-patient")
    public ResponseEntity<?> getAllAppointmentWithPatientId(@RequestParam String patientId){
        try{
            List<AppointmentResponse> list = appointmentService.getAllAppointmentWithPatientId(patientId);
            return ResponseEntity.ok(list);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Không thể lấy danh sách lịch hẹn của bệnh nhân" + e.getMessage());
        }
    }
    @GetMapping("/info")
    public AppointmentInfo getAppointmentInfo(@RequestParam String appointmentId) {
        try {
            AppointmentInfo info = appointmentService.getAppointmentInfo(appointmentId);
            return info;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể lấy thông tin lịch hẹn: " + e.getMessage());
        }
    }

    @PutMapping("/change")
    public ResponseEntity<?> changeStatusAppointment(@RequestParam String appId, @RequestParam AppointmentStatus status){
        try {
            Appointment app = appointmentService.changeStatusAppointment(appId, status);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể đổi trạng thái lịch hẹn: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllAppointment(){
        try {
            List<Appointment> list = appointmentService.getAllAppointment();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể lấy danh sách lịch hẹn: " + e.getMessage());
        }
    }
}
