package com.healthcare.chatbot_service.feign.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String notificationId;
    private String userId;
    private String type;
    private String message;
    private LocalDateTime createdAt;
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;
    private ReadStatus readStatus = ReadStatus.UNREAD;
    private String appointmentId;
    public enum DeliveryStatus {
        PENDING, PROCESSING, SENT, FAILED, CANCELLED
    }
    public enum ReadStatus {
        READ, UNREAD
    }

}
