package com.healthcare.appointment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRequest {
    private String scheduleId;
    private String patientId;
    private LocalDate appointmentDate;
    private Time appointmentStart;
    private Time appointmentEnd;
    private String interactedBy;
    private String reason;
}
