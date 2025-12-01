package com.healthcare.appointment_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponseDTO {
    private String paymentId;
    private Long amount;
    private String method;
    private String status;
    private String payUrl;
    private String qrCodeUrl;
    private String message;
    private String appointmentId;
}