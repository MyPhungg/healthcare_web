package com.healthcare.appointment_service.controller;

import com.healthcare.appointment_service.common.DayOffStatus;
import com.healthcare.appointment_service.dto.CreateDayOffRequest;
import com.healthcare.appointment_service.entity.DayOff;
import com.healthcare.appointment_service.service.DayOffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dayoffs")
public class DayOffController {
    @Autowired
    public DayOffService dayOffService;

    @GetMapping("/by-doctor")
    public ResponseEntity<?> getAllDayOffByDoctorIdAndStatus(@RequestParam String doctorId){
        try{
            List<DayOff> list = dayOffService.getAllDayOffByDoctorIdAndStatus(doctorId, DayOffStatus.ENABLED);
            return ResponseEntity.ok(list);
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lấy danh sách ngày nghỉ thất bại! " + e.getMessage());
        }
    }
    @PostMapping("/create")
    public ResponseEntity<?> createDayOff(@RequestBody CreateDayOffRequest request){
        try{
            DayOff dayOff = dayOffService.createDayOff(request.getDoctorId(),
                    request.getDateOff(),
                    request.getReason(),
                    request.getCreatedBy());
            return ResponseEntity.ok(dayOff);
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Tạo ngày nghỉ thất bại! " + e.getMessage());
        }
    }

    @PutMapping("/cancel")
    public ResponseEntity<?> cancelDayOff(@RequestParam String dayOffId){
        try{
            DayOff dayOff = dayOffService.cancelDayOff(dayOffId);
            return ResponseEntity.ok(dayOff);
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Hủy ngày nghỉ thất bại! " + e.getMessage());
        }
    }
}
