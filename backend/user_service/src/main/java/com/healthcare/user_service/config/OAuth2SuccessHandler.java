package com.healthcare.user_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.user_service.dto.AuthResponse;
import com.healthcare.user_service.dto.UserResponse;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.repository.UserRepository;
import com.healthcare.user_service.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại sau đăng nhập OAuth2"));

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        AuthResponse authResponse = new AuthResponse(token, UserResponse.fromUser(user));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        new ObjectMapper().writeValue(response.getWriter(), authResponse);
        // Redirect về frontend kèm token
       // response.sendRedirect("http://localhost:3000/oauth2/success?token=" + token);
    }
}
