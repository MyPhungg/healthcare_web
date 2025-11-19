package com.healthcare.appointment_service.feign;

import com.healthcare.appointment_service.feign.dto.PatientResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", contextId = "patientClient")
public interface PatientClient {
    @GetMapping("/api/patients/{id}")
    ResponseEntity<PatientResponse> getById(@PathVariable String id) ;
}
