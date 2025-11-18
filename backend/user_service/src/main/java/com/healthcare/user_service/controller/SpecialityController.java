package com.healthcare.user_service.controller;

import com.healthcare.user_service.dto.SpecialityDTO;
import com.healthcare.user_service.dto.SpecialityRequest;
import com.healthcare.user_service.service.SpecialityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/specialities")
@RequiredArgsConstructor
public class SpecialityController {
    private final SpecialityService specialityService;

    @PostMapping
    public ResponseEntity<SpecialityDTO> createSpeciality(@Valid @RequestBody SpecialityRequest specialityRequest)
    {
        SpecialityDTO createdSpeciality = specialityService.createSpeciality(specialityRequest);
        return new ResponseEntity<>(createdSpeciality, HttpStatus.CREATED);
    }

    @GetMapping("/{specialityId}")
    public ResponseEntity<SpecialityDTO> getSpecialityById(@PathVariable String specialityId)
    {
        SpecialityDTO speciality = specialityService.getSpecialityById(specialityId);
        return ResponseEntity.ok(speciality);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<SpecialityDTO> getSpecialtyByName(@PathVariable String name)
    {
        SpecialityDTO speciality = specialityService.getSpecialityByName(name);
        return ResponseEntity.ok(speciality);
    }

    @GetMapping
    public ResponseEntity<List<SpecialityDTO>> getAllSpecialities()
    {
        List<SpecialityDTO> specialities = specialityService.getAllSpecialities();
        return ResponseEntity.ok(specialities);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SpecialityDTO>> searchSpecialities(@RequestParam String keyword)
    {
        List<SpecialityDTO> specialities = specialityService.searchSpecialities(keyword);
        return ResponseEntity.ok(specialities);
    }

    @PutMapping("/{specialityId}")
    public ResponseEntity<SpecialityDTO> updateSpeciality(
            @PathVariable String specialityId,
            @Valid @RequestBody SpecialityRequest specialityRequest) {
        SpecialityDTO updatedSpeciality = specialityService.updateSpecicality(specialityId, specialityRequest);
        return ResponseEntity.ok(updatedSpeciality);
    }

    @DeleteMapping("/{specialityId}")
    public ResponseEntity<Void> deleteSpeciality(@PathVariable String specialityId) {
        specialityService.deleteSpeciality(specialityId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> checkSpecialityExists(@PathVariable String name) {
        boolean exists = specialityService.existsByname(name);
        return ResponseEntity.ok(exists);
    }
}
