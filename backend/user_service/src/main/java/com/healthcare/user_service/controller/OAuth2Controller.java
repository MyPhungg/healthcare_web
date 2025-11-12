
package com.healthcare.user_service.controller;

import com.healthcare.user_service.dto.AuthResponse;
import com.healthcare.user_service.dto.OAuth2LoginRequest;
import com.healthcare.user_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OAuth2Controller {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody OAuth2LoginRequest request) {
        AuthResponse response = authService.loginWithOAuth2(request.getProvider(), request.getToken());
        return ResponseEntity.ok(response);
    }
}
