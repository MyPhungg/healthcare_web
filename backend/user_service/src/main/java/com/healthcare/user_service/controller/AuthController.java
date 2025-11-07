package com.healthcare.user_service.controller;

import com.healthcare.user_service.dto.AuthRequest;
import com.healthcare.user_service.dto.AuthResponse;
import com.healthcare.user_service.dto.RegisterRequest;
import com.healthcare.user_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(
                request.getEmailOrPhone(),
                request.getPassword()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("User Service is working!");
    }
/// frontend
//    @PostMapping("/google")
//    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody Map<String, String> body) {
//        String token = body.get("token");
//        AuthResponse response = authService.loginWithGoogle(token);
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/facebook")
//    public ResponseEntity<AuthResponse> loginWithFacebook(@RequestBody Map<String, String> body) {
//        String token = body.get("token");
//        AuthResponse response = authService.loginWithFacebook(token);
//        return ResponseEntity.ok(response);
//    }

}