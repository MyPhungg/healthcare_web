package com.healthcare.user_service.service;

import com.healthcare.user_service.dto.OAuth2UserInfo;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GoogleOAuth2Service {

    private final RestTemplate restTemplate = new RestTemplate();

    public OAuth2UserInfo getUserInfo(String accessToken) {
        String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("sub")) {
            throw new RuntimeException("Invalid Google access token");
        }

        return new OAuth2UserInfo(
                response.get("sub").toString(),
                response.get("email").toString(),
                response.get("name").toString()
        );
    }
}
