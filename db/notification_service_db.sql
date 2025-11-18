CREATE DATABASE IF NOT EXISTS notification_service_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE notification_service_db;

CREATE TABLE notification (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    appointment_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivery_status ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    read_status ENUM('READ', 'UNREAD') NOT NULL DEFAULT 'UNREAD'
);