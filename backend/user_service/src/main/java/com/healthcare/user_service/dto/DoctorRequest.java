package com.healthcare.user_service.dto;
import lombok.*;

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
    private String profileImg;
    private String coverImg;
}
