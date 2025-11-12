//@Service
//@Slf4j
//public class OAuth2Service {
//
//    private final UserRepository userRepository;
//    private final JwtTokenProvider jwtTokenProvider;
//
//    public AuthResponse authenticateWithOAuth2(String accessToken, String provider) {
//        User user;
//
//        if ("GOOGLE".equalsIgnoreCase(provider)) {
//            user = verifyGoogleToken(accessToken);
//        } else if ("FACEBOOK".equalsIgnoreCase(provider)) {
//            user = verifyFacebookToken(accessToken);
//        } else {
//            throw new RuntimeException("Unsupported OAuth2 provider: " + provider);
//        }
//
//        // Generate JWT token
//        String jwtToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
//        UserResponse userResponse = UserResponse.fromUser(user);
//
//        return new AuthResponse(jwtToken, userResponse);
//    }
//
//    private User verifyGoogleToken(String accessToken) {
//        try {
//            // Verify Google token và lấy user info
//            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
//                    new NetHttpTransport(), JacksonFactory.getDefaultInstance())
//                    .setAudience(Collections.singletonList("your-google-client-id"))
//                    .build();
//
//            GoogleIdToken idToken = verifier.verify(accessToken);
//            if (idToken != null) {
//                GoogleIdToken.Payload payload = idToken.getPayload();
//                String email = payload.getEmail();
//                String name = (String) payload.get("name");
//                String googleId = payload.getSubject();
//
//                return findOrCreateUser(email, name, User.AuthProvider.GOOGLE, googleId);
//            } else {
//                throw new RuntimeException("Invalid Google token");
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Google token verification failed", e);
//        }
//    }
//
//    private User verifyFacebookToken(String accessToken) {
//        try {
//            // Verify Facebook token
//            String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
//            String response = restTemplate.getForObject(url, String.class);
//
//            // Parse JSON response để lấy user info
//            JsonNode userInfo = objectMapper.readTree(response);
//            String email = userInfo.get("email").asText();
//            String name = userInfo.get("name").asText();
//            String facebookId = userInfo.get("id").asText();
//
//            return findOrCreateUser(email, name, User.AuthProvider.FACEBOOK, facebookId);
//        } catch (Exception e) {
//            throw new RuntimeException("Facebook token verification failed", e);
//        }
//    }
//
//    private User findOrCreateUser(String email, String name, User.AuthProvider provider, String providerId) {
//        // Tìm user theo provider và providerId
//        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);
//
//        if (existingUser.isPresent()) {
//            return existingUser.get();
//        }
//
//        // Tạo user mới
//        User user = new User();
//        user.setEmail(email);
//        user.setUsername(generateUsername(email, name));
//        user.setProvider(provider);
//        user.setProviderId(providerId);
//        user.setRole(User.Role.PATIENT);
//        user.setIsActive(true);
//        user.setUserId(CodeGeneratorUtils.generateCode("USR"));
//
//        return userRepository.save(user);
//    }
//
//    private String generateUsername(String email, String name) {
//        String baseUsername = name != null ? name.replaceAll("\\s+", "").toLowerCase()
//                : email.split("@")[0];
//        String username = baseUsername;
//        int counter = 1;
//
//        while (userRepository.existsByUsername(username)) {
//            username = baseUsername + counter;
//            counter++;
//        }
//
//        return username;
//    }
//}
package com.healthcare.user_service.service;

import com.healthcare.user_service.dto.AuthResponse;
import com.healthcare.user_service.dto.UserResponse;
import com.healthcare.user_service.common.CodeGeneratorUtils;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OAuth2Service {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    private final RestTemplate restTemplate = new RestTemplate();

    public AuthResponse loginWithGoogle(String idToken) {
        // 1️⃣ Gọi Google API để verify token và lấy thông tin user
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        Map<String, String> userInfo = restTemplate.getForObject(url, Map.class);

        if (userInfo == null || !userInfo.containsKey("email")) {
            throw new RuntimeException("Invalid Google token");
        }

        String email = userInfo.get("email");
        String googleId = userInfo.get("sub");

        // 2️⃣ Kiểm tra user đã có trong DB chưa
        Optional<User> userOptional = userService.findByProviderAndProviderId(User.AuthProvider.GOOGLE, googleId);

        User user = userOptional.orElseGet(() -> {
            // 3️⃣ Nếu chưa có thì tạo mới
            User newUser = new User();
            newUser.setUserId(CodeGeneratorUtils.generateCode("USR"));
            newUser.setEmail(email);
            newUser.setUsername(email.split("@")[0]);
            newUser.setProvider(User.AuthProvider.GOOGLE);
            newUser.setProviderId(googleId);
            newUser.setRole(User.Role.PATIENT); // default role
            newUser.setIsActive(true);
            return userService.save(newUser);
        });

        // 4️⃣ Sinh JWT token như bình thường
        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());

        UserResponse userResponse = UserResponse.fromUser(user);
        return new AuthResponse(token, userResponse);
    }
}
