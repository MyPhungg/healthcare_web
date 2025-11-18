package com.healthcare.appointment_service.feign.dto;

//import com.healthcare.user_service.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String userId;
    private String username;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
    private Boolean isActive;

//    public static UserResponse fromUser(User user) {
//        UserResponse response = new UserResponse();
//        response.setUserId(user.getUserId());
//        response.setUsername(user.getUsername());
//        response.setEmail(user.getEmail());
//        response.setPhone(user.getPhone());
//        response.setRole(user.getRole());
//        response.setCreatedAt(user.getCreatedAt());
//        response.setIsActive(user.getIsActive());
//        return response;
//    }
}