package com.healthcare.appointment_service.service;

import com.healthcare.appointment_service.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String NOTIFICATION_TOPIC = "appointment-notifications";

    public void sendNotification(NotificationEvent event, String token){
        try {
//            kafkaTemplate.send(NOTIFICATION_TOPIC, event);
            ProducerRecord<String, Object> record =
                    new ProducerRecord<>(NOTIFICATION_TOPIC, event);

            // Thêm header vào Kafka message
            record.headers().add("Authorization", token.getBytes());

            kafkaTemplate.send(record);
            log.info("Thông báo gửi thành công: {}", event);
        } catch (Exception e){
            log.error("Gửi thông báo thất bại: {}", e.getMessage(), e);
            throw new RuntimeException("Gửi thất bại ở kafka producer service");
        }


    }
}
