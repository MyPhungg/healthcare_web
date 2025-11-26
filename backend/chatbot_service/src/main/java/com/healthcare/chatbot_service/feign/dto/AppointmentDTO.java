package com.healthcare.chatbot_service.feign.dto;

import com.healthcare.chatbot_service.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private String appointmentId;
    private String scheduleId;
    private String patientId;
    private AppointmentStatus status = AppointmentStatus.PENDING;
    private LocalDate appointmentDate;
    private Time appointmentStart;
    private Time appointmentEnd;
    private LocalDateTime interactedAt = LocalDateTime.now();
    private String interactedBy;
    private String reason;

}
