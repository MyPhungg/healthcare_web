package com.healthcare.user_service.security;

import com.healthcare.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    private final UserService userService;

    public boolean isOwnProfile(Authentication authentication, String userId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUsername = authentication.getName();

        // Tìm user hiện tại từ database bằng email hoặc username
        var currentUser = userService.findByEmail(currentUsername)
                .orElseGet(() -> userService.findByUsername(currentUsername)
                        .orElse(null));

        return currentUser != null && currentUser.getUserId().equals(userId);
    }
}