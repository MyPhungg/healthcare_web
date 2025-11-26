package com.healthcare.chatbot_service.feign;

import com.healthcare.chatbot_service.feign.dto.AppointmentDTO;
import com.healthcare.chatbot_service.feign.dto.CreateAppointmentRequest;
import com.healthcare.chatbot_service.feign.dto.ScheduleBySpeciality;
import com.healthcare.chatbot_service.feign.dto.ScheduleDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@FeignClient(name = "appointment-service")
public interface AppointmentServiceClient {

    @PostMapping("/create")
    public AppointmentDTO createAppointment(@RequestBody CreateAppointmentRequest request);

    @PutMapping("/cancel")
    public AppointmentDTO cancelledAppointment(@RequestParam String appId);

    @GetMapping("/appointments/by-doctor")
    public List<AppointmentDTO> getAllAppointmentWithScheduleId(@RequestParam String scheduleId);

    @GetMapping("/appointments/by-patient")
    public List<AppointmentDTO> getAllAppointmentWithPatientId(@RequestParam String patientId);

    @GetMapping("/schedules/by-doctor")
    public ScheduleDTO getScheduleByDoctorId(@RequestParam String doctorId);

    @GetMapping("/schedules/available-slots")
    public List<String> getAvailableSlots(@RequestParam String doctorId, @RequestParam LocalDate date);

    @GetMapping("/schedules/speciality")
    public List<ScheduleBySpeciality> getSheduleBySpeciality(@RequestParam String specialityId, @RequestParam LocalDate date);
}