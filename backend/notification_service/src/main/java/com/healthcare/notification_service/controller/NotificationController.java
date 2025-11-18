package com.healthcare.notification_service.controller;

import com.healthcare.notification_service.entity.Notification;
import com.healthcare.notification_service.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/by-user")
    public ResponseEntity<?> getAllNotificationsByUserId(@RequestParam String userId){
        try{
            List<Notification> list = notificationService.getAllNotificationsByUserId(userId);
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
