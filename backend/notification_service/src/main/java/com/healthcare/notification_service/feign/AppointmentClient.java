package com.healthcare.notification_service.feign;

import com.healthcare.notification_service.dto.AppointmentInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "appointment-service")
public interface AppointmentClient {
    @GetMapping("/info")
    public AppointmentInfo getAppointmentInfo(@RequestParam String appointmentId, @RequestHeader("Authorization") String token);

}
