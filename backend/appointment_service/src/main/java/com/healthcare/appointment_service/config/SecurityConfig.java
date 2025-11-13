package com.healthcare.appointment_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Vô hiệu hóa bảo mật (Authorization) cho mọi request
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                )
                // Vô hiệu hóa CSRF (rất quan trọng khi tắt bảo mật)
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())  // tắt form login
                    .httpBasic(basic -> basic.disable()); // tắt basic auth

                

        return http.build();
    }
}
