package com.healthcare.appointment_service.controller;

import com.healthcare.appointment_service.dto.ChangeScheduleRequest;
import com.healthcare.appointment_service.dto.CreateScheduleRequest;
import com.healthcare.appointment_service.entity.Schedule;
import com.healthcare.appointment_service.feign.dto.ScheduleBySpeciality;
import com.healthcare.appointment_service.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/by-doctor")
    public ResponseEntity<?> getScheduleByDoctorId(@RequestParam String doctorId){
        try{
            Schedule schedule = scheduleService.getScheduleByDoctorId(doctorId);
            return ResponseEntity.ok(schedule);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Lấy lịch làm việc của bác sĩ thất bại" + e.getMessage());
        }
    }
    @GetMapping("/available-slots")
    public ResponseEntity<?> getAvailableSlots(@RequestParam String doctorId, @RequestParam LocalDate date){
        try{
            List<String> list = scheduleService.getAvailableSlots(doctorId, date);
            return ResponseEntity.ok(list);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Lấy lịch khám còn trống thất bại!" + e.getMessage());
        }
    }
    @PostMapping("/create")
    public ResponseEntity<?> createScheduleForDoctor(@RequestBody CreateScheduleRequest request){
        try{
            Schedule newSchedule = scheduleService.createScheduleForDoctor(request.getDoctorId(),
                    request.getWorkingDays(),
                    request.getStartTime(),
                    request.getEndTime(),
                    request.getConsultationFee(),
                    request.getSlotDuration());
            return ResponseEntity.ok(newSchedule);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Tạo lịch làm việc của bác sĩ thất bại" + e.getMessage());
        }
    }
    @PutMapping("/change")
    public ResponseEntity<?> getScheduleByDoctorId(@RequestBody ChangeScheduleRequest request){
        try{
            Schedule changedSchedule = scheduleService.changeSchedule(
                    request.getScheduleId(),
                    request.getWorkingDays(),
                    request.getStartTime(),
                    request.getEndTime(),
                    request.getConsultationFee(),
                    request.getSlotDuration()
            );
            return ResponseEntity.ok(changedSchedule);
        }
        catch (RuntimeException e){
            return ResponseEntity.badRequest().body("Thay đổi lịch làm việc của bác sĩ thất bại" + e.getMessage());
        }
    }

    @GetMapping("/speciality")
    public List<ScheduleBySpeciality> getSheduleBySpeciality(@RequestParam String specialityId, @RequestParam LocalDate date) {
        try {
            List<ScheduleBySpeciality> list = scheduleService.getSheduleBySpeciality(specialityId, date);
            return list;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể lấy thông tin lịch hẹn: " + e.getMessage());
        }
    }
}
