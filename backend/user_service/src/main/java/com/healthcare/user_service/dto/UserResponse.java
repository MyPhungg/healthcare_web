package com.healthcare.user_service.dto;

import com.healthcare.user_service.entity.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String userId;
    private String username;
    private String email;
    private String phone;
    private User.Role role;
    private LocalDateTime createdAt;
    private Boolean isActive;

    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setIsActive(user.getIsActive());
        return response;
    }
}