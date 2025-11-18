package com.healthcare.notification_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @Column(name = "notification_id")
    private String notificationId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status", nullable = false)
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "read_status", nullable = false)
    private ReadStatus readStatus = ReadStatus.UNREAD;

    // Additional fields for appointment context
    @Column(name = "appointment_id")
    private String appointmentId;
//
//    @Column(name = "metadata")
//    private String metadata;

    public enum DeliveryStatus {
        PENDING, PROCESSING, SENT, FAILED, CANCELLED
    }

    public enum ReadStatus {
        READ, UNREAD
    }
}