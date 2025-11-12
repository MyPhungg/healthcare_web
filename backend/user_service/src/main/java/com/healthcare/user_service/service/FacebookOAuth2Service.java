package com.healthcare.user_service.service;

import com.healthcare.user_service.dto.OAuth2UserInfo;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class FacebookOAuth2Service {

    private final RestTemplate restTemplate = new RestTemplate();

    public OAuth2UserInfo getUserInfo(String accessToken) {
        // Facebook Graph API: lấy id, email, name
        String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("id")) {
            throw new RuntimeException("Invalid Facebook access token");
        }

        return new OAuth2UserInfo(
                response.get("id").toString(),
                response.get("email") != null ? response.get("email").toString() : null,
                response.get("name").toString()
        );
    }
}
