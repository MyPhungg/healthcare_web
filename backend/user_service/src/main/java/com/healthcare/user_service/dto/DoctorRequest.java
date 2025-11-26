package com.healthcare.user_service.dto;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DoctorRequest {
    private String userId;
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String district;
    private String city;
    private String specialityId;
    private String clinicName;
    private String clinicDescription;
    private String bio;
    private MultipartFile profileImg;
    private MultipartFile coverImg;
}
