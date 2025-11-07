package com.healthcare.user_service.service;

import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // google / facebook
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String providerId = provider.equals("google") ? (String) attributes.get("sub") : (String) attributes.get("id");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserId("U" + UUID.randomUUID().toString().substring(0, 8));
                    newUser.setEmail(email);
                    newUser.setUsername(name != null ? name : email.split("@")[0]);
                    newUser.setPassword(""); // OAuth2 không cần password
                    newUser.setRole(User.Role.PATIENT); // default role
                    newUser.setProvider(User.AuthProvider.valueOf(provider.toUpperCase()));
                    newUser.setProviderId(providerId);
                    return newUser;
                });

        // Update provider info
        user.setProvider(User.AuthProvider.valueOf(provider.toUpperCase()));
        user.setProviderId(providerId);

        userRepository.save(user);
        return oAuth2User;
    }
}
