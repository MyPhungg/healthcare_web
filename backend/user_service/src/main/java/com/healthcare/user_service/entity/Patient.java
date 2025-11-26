package com.healthcare.user_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @Column(name = "patient_id", length = 50)
    private String patientId;

    @OneToOne(mappedBy = "patient", fetch = FetchType.LAZY)
    @JsonBackReference
    private User user;


    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;


    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "insurance_num", unique = true, length = 50)
    private String insuranceNum;

    @Column(name = "profile_img", length = 255)
    private String profileImg;

    @Column(name = "cover_img", length = 255)
    private String coverImg;

    public enum Gender {
        MALE, FEMALE
    }
}

