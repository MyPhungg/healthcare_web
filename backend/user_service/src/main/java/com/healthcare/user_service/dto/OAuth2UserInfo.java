package com.healthcare.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OAuth2UserInfo {
    private String id;
    private String email;
    private String name;
}
