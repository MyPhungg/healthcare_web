package com.healthcare.appointment_service.dto;

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
//    private String token;
//
//    public NotificationEvent(String type, String message, String recipient, String userId, String appointmentId, String status) {
//    }
}
