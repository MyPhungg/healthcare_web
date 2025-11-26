package com.healthcare.chatbot_service.feign.dto;

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

    private UserInfo user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private String userId;
        private String username;
        private String email;
        private String phone;
        private String role;
        private String provider;
    }
}

