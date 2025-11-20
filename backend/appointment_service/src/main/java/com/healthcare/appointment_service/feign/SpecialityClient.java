package com.healthcare.appointment_service.feign;

import com.healthcare.appointment_service.feign.dto.SpecialityDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", contextId = "specialityClient")
public interface SpecialityClient {
    @GetMapping("/api/specialities/{specialityId}")
    public SpecialityDTO getSpecialityById(@PathVariable String specialityId);
}
