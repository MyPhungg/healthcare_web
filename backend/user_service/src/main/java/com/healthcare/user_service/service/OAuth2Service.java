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