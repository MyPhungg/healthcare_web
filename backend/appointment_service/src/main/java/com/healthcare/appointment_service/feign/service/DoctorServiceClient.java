//package com.healthcare.appointment_service.feign.service;
//
//import com.healthcare.appointment_service.feign.dto.UserResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class DoctorServiceClient {
//    private final RestTemplate restTemplate;
//    public UserResponse getDoctorById(String doctorId, String token) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", token); // Truyền token nguyên bản
//        log.info("header: ", headers);
//        return restTemplate.exchange(
//                "http://user-service/api/doctors/" + doctorId,
//                HttpMethod.GET,
//                new HttpEntity<>(headers),
//                UserResponse.class
//        ).getBody();
//    }
//}
