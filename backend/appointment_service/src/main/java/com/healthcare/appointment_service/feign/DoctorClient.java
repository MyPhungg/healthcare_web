package com.healthcare.appointment_service.feign;

import com.healthcare.appointment_service.feign.dto.DoctorDTO;
import com.healthcare.appointment_service.feign.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", contextId = "doctorClient")
public interface DoctorClient {
    @GetMapping("/api/doctors/{doctorId}")
    DoctorDTO getDoctorById(
            @PathVariable("doctorId") String doctorId,
            @RequestHeader("Authorization") String token  // <-- truyền token
    );
    @GetMapping("/api/doctors/userId/{doctorId}")
    String getUserIdByDoctorId(
            @PathVariable("doctorId") String doctorId,
            @RequestHeader("Authorization") String token  // <-- truyền token
    );
}
