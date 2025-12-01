package com.healthcare.appointment_service.dto;

import lombok.Data;

@Data
public class MomoApiRequest {
    private String partnerCode;
    private String partnerName;
    private String storeId;
    private String requestId;
    private String amount;
    private String orderId;
    private String orderInfo;
    private String redirectUrl;
    private String ipnUrl;
    private String extraData;
    private String requestType;
    private String lang;
    private String signature;
    private Integer expireTime; // ← THÊM FIELD NÀY (milliseconds)
}