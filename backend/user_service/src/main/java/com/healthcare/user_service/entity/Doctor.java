package com.healthcare.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Doctor {
    @Id
    @Column(name = "doctor_id", nullable = false)
    private String doctorId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address")
    private String address;

    @Column(name = "district")
    private String district;

    @Column(name = "city")
    private String city;

    @Column(name = "speciality_id", nullable = false)
    private String specialityId;

    @Column(name = "clinic_name", nullable = false)
    private String clinicName;

    @Column(name = "clinic_description")
    private String clinicDescription;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_img")
    private String profileImg;

    @Column(name = "cover_img")
    private String coverImg;
}
