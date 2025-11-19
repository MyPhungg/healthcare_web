package com.healthcare.notification_service.repository;

import com.healthcare.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndDeliveryStatus(String userId, Notification.DeliveryStatus deliveryStatus);
    List<Notification> findByUserIdAndReadStatus(String userId, Notification.ReadStatus readStatus);

}