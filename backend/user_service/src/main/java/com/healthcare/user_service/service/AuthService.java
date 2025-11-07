package com.healthcare.user_service.service;

import com.healthcare.user_service.dto.AuthResponse;
import com.healthcare.user_service.dto.RegisterRequest;
import com.healthcare.user_service.dto.UserResponse;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

//import org.springframework.beans.factory.annotation.Autowired;
//import com.healthcare.user_service.repository.UserRepository;
//import org.springframework.web.client.RestTemplate;
//import java.util.Map;
//import java.util.Collections;


@Service
@RequiredArgsConstructor

//@Autowired
public class AuthService {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;


   // private UserRepository userRepository;


    public AuthResponse login(String emailOrPhone, String password) {
        User user = userService.authenticateUser(emailOrPhone, password)
                .orElseThrow(() -> new RuntimeException("Invalid credentials or account inactive"));

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

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

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        UserResponse userResponse = UserResponse.fromUser(user);
        return new AuthResponse(token, userResponse);
    }
//    frontend
//    public AuthResponse loginWithGoogle(String token) {
//        // 1️⃣ Xác minh token với Google API
//        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
//                new NetHttpTransport(),
//                new JacksonFactory()
//        ).setAudience(Collections.singletonList(googleClientId)).build();
//
//        GoogleIdToken idToken = verifier.verify(token);
//        if (idToken == null) throw new RuntimeException("Invalid Google token");
//
//        String email = idToken.getPayload().getEmail();
//        String name = (String) idToken.getPayload().get("name");
//
//        // 2️⃣ Tìm hoặc tạo user mới
//        User user = userRepository.findByEmail(email)
//                .orElseGet(() -> userRepository.save(new User(name, email, User.Role.PATIENT)));
//
//        // 3️⃣ Sinh JWT nội bộ cho app
//        String jwt = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
//
//        return new AuthResponse(jwt, UserResponse.fromUser(user));
//    }
//    public AuthResponse loginWithFacebook(String token) {
//        String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + token;
//        RestTemplate restTemplate = new RestTemplate();
//        Map<String, Object> fbData = restTemplate.getForObject(url, Map.class);
//
//        String email = (String) fbData.get("email");
//        String name = (String) fbData.get("name");
//
//        User user = userRepository.findByEmail(email)
//                .orElseGet(() -> userRepository.save(new User(name, email, User.Role.PATIENT)));
//
//        String jwt = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
//
//        return new AuthResponse(jwt, UserResponse.fromUser(user));
//    }


}