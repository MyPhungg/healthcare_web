package com.healthcare.user_service.service;

import com.healthcare.user_service.dto.AuthResponse;
import com.healthcare.user_service.dto.RegisterRequest;
import com.healthcare.user_service.dto.UserResponse;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.healthcare.user_service.dto.OAuth2UserInfo;
import com.healthcare.user_service.common.CodeGeneratorUtils;



@Service
@RequiredArgsConstructor

public class AuthService {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleOAuth2Service googleOAuth2Service;
    private final FacebookOAuth2Service facebookOAuth2Service;



    public AuthResponse login(String emailOrPhone, String password) {
        User user = userService.authenticateUser(emailOrPhone, password)
                .orElseThrow(() -> new RuntimeException("Invalid credentials or account inactive"));

        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());

        UserResponse userResponse = UserResponse.fromUser(user);
        return new AuthResponse(token, userResponse);
    }

    public AuthResponse register(RegisterRequest request) {
        User user = userService.registerUser(
                request.getUsername(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword(),
                request.getRole()
        );

        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());

        UserResponse userResponse = UserResponse.fromUser(user);
        return new AuthResponse(token, userResponse);
    }

    public AuthResponse loginWithOAuth2(String provider, String accessToken) {
        // Lấy thông tin user từ provider
        final OAuth2UserInfo userInfo;
        switch (provider.toLowerCase()) {
            case "google":
                userInfo = googleOAuth2Service.getUserInfo(accessToken);
                break;
            case "facebook":
                userInfo = facebookOAuth2Service.getUserInfo(accessToken);
                break;
            default:
                throw new RuntimeException("Unsupported provider: " + provider);
        }

        // Chuyển provider sang enum final
        final User.AuthProvider providerEnum = User.AuthProvider.valueOf(provider.toUpperCase());

        // Kiểm tra user có trong DB chưa
        User user = userService.findByProviderAndProviderId(providerEnum, userInfo.getId())
                .orElseGet(() -> {
                    // Nếu chưa có, tạo mới
                    User newUser = new User();
                    newUser.setUserId(CodeGeneratorUtils.generateCode("usr"));
                    newUser.setEmail(userInfo.getEmail());
                    newUser.setUsername(userInfo.getName().replaceAll("\\s", "").toLowerCase());
                    newUser.setProvider(providerEnum);
                    newUser.setProviderId(userInfo.getId());
                    newUser.setRole(User.Role.PATIENT);
                    // dat password:
                    newUser.setPassword("OAUTH_NO_PASSWORD");
                    newUser.setIsActive(true);
                    return userService.save(newUser);
                });

        // Tạo JWT hoặc trả AuthResponse
        return generateToken(user);
    }
    private AuthResponse generateToken(User user) {
        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());
        UserResponse userResponse = UserResponse.fromUser(user);
        return new AuthResponse(token, userResponse);
    }



}