package com.healthcare.user_service.dto;

import lombok.Data;

@Data
public class OAuth2LoginRequest {
    private String provider; // "google" hoặc "facebook"
    private String token; // access token hoặc id token từ client
}
