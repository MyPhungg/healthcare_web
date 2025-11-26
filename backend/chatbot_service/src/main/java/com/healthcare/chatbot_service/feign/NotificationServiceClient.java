package com.healthcare.chatbot_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "notification-service")
public interface NotificationServiceClient {

    @GetMapping("/notifications/user/{userId}")
    List<Object> getNotificationsByUser(@PathVariable String userId);
}