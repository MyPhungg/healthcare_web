package com.healthcare.appointment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentInfo {
    private String doctorName;
    private String address;
    private String district;
    private String city;
    private String clinicName;
    private String specialityName;
    private LocalDate appointmentDate;
    private Time appointmentStart;
    private Time appointmentEnd;

}
