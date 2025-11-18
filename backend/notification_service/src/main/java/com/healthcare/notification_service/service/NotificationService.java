package com.healthcare.notification_service.service;

import com.healthcare.notification_service.CodeGeneratorUtils;
import com.healthcare.notification_service.dto.AppointmentInfo;
import com.healthcare.notification_service.dto.NotificationEvent;
import com.healthcare.notification_service.entity.Notification;
import com.healthcare.notification_service.feign.AppointmentClient;
import com.healthcare.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final AppointmentClient appointmentClient;
    @KafkaListener(topics = "appointment-notifications", groupId = "notification-group", containerFactory = "appointmentEventListenerFactory")
    public void consumerNotification(NotificationEvent event){
        try {
            log.info("📨 Nhận được event từ Kafka");
            log.info("📨 step1");
            // Step 1: Save notification to database with PENDING status
            Notification notification = saveNotificationToDatabase(event);
            log.info("📨 step2");

            // Step 2: Process and send the notification
            processAndSendNotification(notification, event);

        } catch (Exception e) {
            log.error("Error processing notification: {}", e.getMessage(), e);
            // Save as FAILED if we can't even save to database
            saveFailedNotification(event, e.getMessage());
        }
    }

    private Notification saveNotificationToDatabase(NotificationEvent event) {
        Notification notification = new Notification();
        notification.setType(event.getType());
        notification.setMessage(event.getMessage());
        notification.setUserId(event.getUserId());
        notification.setAppointmentId(event.getAppointmentId());
//        notification.setMetadata(event.getMetadata());
        notification.setDeliveryStatus(Notification.DeliveryStatus.PENDING);
        notification.setReadStatus(Notification.ReadStatus.UNREAD);

        // Nếu event không có userId
        if (notification.getUserId() == null) {
            // Optional: Look up userId by email/recipient if you have a user service
            // String userId = userService.findUserIdByEmail(event.getRecipient());
            // notification.setUserId(userId);
            notification.setUserId("UNKNOWN"); // or handle differently
        }
        notification.setNotificationId(CodeGeneratorUtils.generateCode("not"));
        return notificationRepository.save(notification);
    }

    private void processAndSendNotification(Notification notification, NotificationEvent event) {
        try {
            // Update status to PROCESSING
            notification.setDeliveryStatus(Notification.DeliveryStatus.PROCESSING);
            notificationRepository.save(notification);

            // Send the actual notification based on type
            boolean sentSuccessfully = sendActualNotification(notification, event);

            // Update status based on result
            if (sentSuccessfully) {
                notification.setDeliveryStatus(Notification.DeliveryStatus.SENT);
                log.info("Notification sent successfully: {}", notification.getNotificationId());
            } else {
                notification.setDeliveryStatus(Notification.DeliveryStatus.FAILED);
                log.warn("Notification failed to send: {}", notification.getNotificationId());
            }

            notificationRepository.save(notification);

        } catch (Exception e) {
            log.error("Failed to send notification {}: {}", notification.getNotificationId(), e.getMessage());

            // Update status to FAILED
            notification.setDeliveryStatus(Notification.DeliveryStatus.FAILED);
            notificationRepository.save(notification);

            throw e; // Re-throw to trigger Kafka retry if configured
        }

    }
    private boolean sendActualNotification(Notification notification, NotificationEvent event) {
        try {
            // Implement your actual notification logic here
            switch (notification.getType()) {
                case "APPOINTMENT_CREATED":
                case "APPOINTMENT_UPDATED":
                case "APPOINTMENT_CANCELLED":
                    return sendAppointmentNotification(notification, event);
                case "SYSTEM_ALERT":
                    return sendSystemNotification(notification);
                default:
                    log.warn("Unknown notification type: {}", notification.getType());
                    return false;
            }
        } catch (Exception e) {
            log.error("Error in sendActualNotification: {}", e.getMessage(), e);
            return false;
        }
    }
    private boolean sendAppointmentNotification(Notification notification, NotificationEvent event) {
        // Example: Send email notification
        try {
            String regex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
            if(event.getRecipient()==null || !event.getRecipient().matches(regex)){
                log.warn("Không tìm thấy email người dùng: {}", notification.getUserId());
                throw new RuntimeException("Không tìm thấy email của người dùng {}");
            }
            AppointmentInfo info = appointmentClient.getAppointmentInfo(event.getAppointmentId(), event.getToken());

            // Tạo nội dung email
            String subject = "Thông báo lịch hẹn - Appointment Notification";
            String message = buildEmailMessage(info);

            // Gửi email
            emailService.sendSimpleEmail(event.getRecipient(), subject, message);
            // For now, just log and return true
            log.info("Sending appointment notification to user: {}. Message: {}",
                    notification.getUserId(), notification.getMessage());

            // Simulate successful sending
            return true;

        }  catch (MailException e) {
            log.error("Failed to send appointment notification via email: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Failed to send appointment notification: {}", e.getMessage());
            return false;
        }
    }

    private boolean sendSystemNotification(Notification notification) {
        // Implement system notification logic
        log.info("Sending system notification to user: {}. Message: {}",
                notification.getUserId(), notification.getMessage());
        return true;
    }

    private void saveFailedNotification(NotificationEvent event, String errorMessage) {
        try {
            Notification failedNotification = new Notification();
            failedNotification.setType(event.getType());
            failedNotification.setMessage(event.getMessage() + " - Error: " + errorMessage);
            failedNotification.setUserId(event.getUserId() != null ? event.getUserId() : "UNKNOWN");
            failedNotification.setAppointmentId(event.getAppointmentId());
            failedNotification.setDeliveryStatus(Notification.DeliveryStatus.FAILED);
            failedNotification.setReadStatus(Notification.ReadStatus.UNREAD);

            notificationRepository.save(failedNotification);
        } catch (Exception e) {
            log.error("Even failed to save failed notification: {}", e.getMessage());
        }
    }

    public List<Notification> getAllNotificationsByUserId(String userId){
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

    }
    private String buildEmailMessage(AppointmentInfo info) {
        return String.format("""
            Kính gửi bệnh nhân,
            
            Bạn có một cuộc hẹn với bác sĩ %s thuộc chuyên khoa (%s) tại phòng khám %s, địa chỉ: %s, %s, %s.
            Ngày hẹn: %s
            Thời gian: %s - %s
            
            Trân trọng,
            Đội ngũ hỗ trợ
            
            """,
                // Phiên bản tiếng Việt
                info.getDoctorName(),
                info.getSpecialityName(),
                info.getClinicName(),
                info.getAddress(),
                info.getDistrict(),
                info.getCity(),
                info.getAppointmentDate(),
                info.getAppointmentStart(),
                info.getAppointmentEnd()
        );
    }

}
