package com.healthcare.notification_service.config;

import com.healthcare.notification_service.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor

public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Vô hiệu hóa bảo mật (Authorization) cho mọi request
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/actuator/**").permitAll()
//                        .requestMatchers("/appointments/**").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN")
//                        .requestMatchers("/schedules/**").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN")
//                        .requestMatchers("/dayoffs/**").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN")
                        .anyRequest().authenticated()
                )
                // Vô hiệu hóa CSRF (rất quan trọng khi tắt bảo mật)
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())  // tắt form login
                .httpBasic(basic -> basic.disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        ; // tắt basic auth

                

        return http.build();
    }
}
