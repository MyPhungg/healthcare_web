package com.healthcare.user_service.controller;

import com.healthcare.user_service.dto.DoctorDTO;
import com.healthcare.user_service.dto.DoctorRequest;
import com.healthcare.user_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;


    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@RequestParam String userId,
                                                  @RequestParam String fullName,
                                                  @RequestParam String gender,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
                                                  @RequestParam String address,
                                                  @RequestParam String district,
                                                  @RequestParam String city,
                                                  @RequestParam String specialityId,
                                                  @RequestParam String clinicName,
                                                  @RequestParam String clinicDescription,
                                                  @RequestParam String bio,
                                                  @RequestParam MultipartFile profileImg,
                                                  @RequestParam MultipartFile coverImg)
    {
        DoctorDTO createdDoctor = doctorService.createDoctor(userId,
                fullName,
                gender,
                dateOfBirth,
                address,
                district,
                city,
                specialityId,
                clinicName,
                clinicDescription,
                bio,
                profileImg,
                coverImg);
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }
//    @PreAuthorize("hasRole('ADMIN) or @userSecurity.isOwnProfile(authentication, #doctorId)")
    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable String doctorId)
    {
        DoctorDTO doctor = doctorService.getDoctorById(doctorId);
        return ResponseEntity.ok(doctor);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<DoctorDTO> getDoctorByUserId(@PathVariable String userId) { // THÊM API này
        DoctorDTO doctor = doctorService.getDoctorByUserId(userId);
        return ResponseEntity.ok(doctor);
    }
    @GetMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() { // THÊM API này
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }
    @GetMapping("/speciality")
    public ResponseEntity<List<DoctorDTO>> getDoctorBySpeciality(@RequestParam String specialityId, @RequestParam LocalDate date)
    {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpeciality(specialityId);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<DoctorDTO>> getDoctorByCity(@PathVariable String city)
    {
        List<DoctorDTO> doctors = doctorService.getDoctorsByCity(city);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctorByName(@RequestParam String name)
    {
        List<DoctorDTO> doctors = doctorService.searchDoctorsByName(name);
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<DoctorDTO> updateDoctor(
         @PathVariable String doctorId,
         @RequestParam String fullName,
         @RequestParam String gender,
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
         @RequestParam String address,
         @RequestParam String district,
         @RequestParam String city,
         @RequestParam String specialityId,
         @RequestParam String clinicName,
         @RequestParam String clinicDescription,
         @RequestParam String bio,
         @RequestParam MultipartFile profileImg,
         @RequestParam MultipartFile coverImg
    )
    {
        DoctorDTO updatedDoctor = doctorService.updateDoctor(doctorId,
                fullName,
                gender,
                dateOfBirth,
                address,
                district,
                city,
                specialityId,
                clinicName,
                clinicDescription,
                bio,
                profileImg,
                coverImg);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/{doctorId}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String doctorId)
    {
        doctorService.deleteDoctor(doctorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Boolean> checkDoctorExists(@PathVariable String userId)
    {
        boolean exists = doctorService.existsByUserId(userId);
        return ResponseEntity.ok(exists);
    }

    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwnProfile(authentication, #doctorId)")
    @GetMapping("/userId/{doctorId}")
    public ResponseEntity<String> getUserIdByDoctorId(@PathVariable String doctorId)
    {
        String userId = doctorService.getUserIdByDoctorId(doctorId);
        return ResponseEntity.ok(userId);
    }
}
