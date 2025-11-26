package com.healthcare.user_service.controller;

import com.healthcare.user_service.dto.PatientResponse;
import com.healthcare.user_service.entity.Patient;
import com.healthcare.user_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
//import com.healthcare.user_service.dto.PatientResponse

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private static final Logger logger = LoggerFactory.getLogger(PatientController.class);

    @GetMapping
    public List<Patient> getAll() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getById(@PathVariable String id) {
        try {
            return patientService.getPatientById(id)
                    .map(patientService::toResponse)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching patient with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/by-userId/{userId}")
    public ResponseEntity<PatientResponse> getPatientByUserId(@PathVariable String userId)
    {
        try
        {
            Optional<Patient> patient = patientService.getParientByUserId(userId);
            if (patient.isPresent()) {
            PatientResponse response = patientService.toResponse(patient.get());
            return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e)
        {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{userId}")
    public Patient create(@PathVariable String userId,
                          @RequestParam String fullName,
                          @RequestParam Patient.Gender gender,
                          @RequestParam String dateOfBirth,
                          @RequestParam String address,
                          @RequestParam String district,
                          @RequestParam String city,
                          @RequestParam String insuranceNum,
                          @RequestPart(value = "profileImg", required = false) MultipartFile profileImg,
                          @RequestPart(value = "coverImg", required = false) MultipartFile coverImg) {
        return patientService.createPatient(userId,
                fullName,
                gender,
                dateOfBirth,
                address,
                district,
                city,
                insuranceNum,
                profileImg,
                coverImg);
    }

    @PutMapping("/{patientId}")
    public Patient update(@PathVariable String patientId,
                          @RequestParam String fullName,
                          @RequestParam Patient.Gender gender,
                          @RequestParam String dateOfBirth,
                          @RequestParam String address,
                          @RequestParam String district,
                          @RequestParam String city,
                          @RequestParam String insuranceNum,
                          @RequestPart(value = "profileImg", required = false) MultipartFile profileImg,
                          @RequestPart(value = "coverImg", required = false) MultipartFile coverImg) {
        return patientService.updatePatient(patientId,
                fullName,
                gender,
                dateOfBirth,
                address,
                district,
                city,
                insuranceNum,
                profileImg,
                coverImg);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        patientService.deletePatient(id);
    }


}

