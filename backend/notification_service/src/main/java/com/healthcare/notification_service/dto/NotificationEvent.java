package com.healthcare.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {
    private String type;
    private String message;
    private String recipient;
    private String userId;
    private String appointmentId;
    private String status;
    private String token;
//    private String metadata;
//    private LocalDateTime sentAt;
//    private String scheduleId;
//    private String patientId;
//    private LocalDate appointmentDate;
//    private Time appointmentStart;
//    private Time appointmentEnd;
//    private String interactedBy;
//    private String reason;
}
