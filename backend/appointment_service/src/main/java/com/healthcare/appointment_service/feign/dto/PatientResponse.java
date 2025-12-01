package com.healthcare.appointment_service.feign.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponse {
    private String userId;
    private String patientId;
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String district;
    private String city;
    private String insuranceNum;
    private String profileImg;
    private String coverImg;
    private UserResponse user;

}

