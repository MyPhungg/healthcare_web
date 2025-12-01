// MomoApiResponse.java
package com.healthcare.appointment_service.dto;

import lombok.Data;

@Data
public class MomoApiResponse {
    private String partnerCode;
    private String orderId;
    private String requestId;
    private String amount;
    private String responseTime;
    private String message;
    private Integer resultCode;
    private String payUrl;
    private String deeplink;
    private String qrCodeUrl;
    private String deeplinkWebInApp;
}