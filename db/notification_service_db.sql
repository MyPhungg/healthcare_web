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
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO notification (
    notification_id, user_id, appointment_id, type, message, delivery_status, read_status
) VALUES
('not10000011','usr20000001','app10000011','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc38492015 vào 2025-12-01 lúc 08:00.','PENDING','UNREAD'),
('not10000012','usr20000002','app10000012','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc59384012 vào 2025-12-03 lúc 08:30.','PENDING','UNREAD'),
('not10000013','usr20000003','app10000013','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc12059384 vào 2025-12-04 lúc 07:30.','PENDING','UNREAD'),
('not10000014','usr20000004','app10000014','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc90581244 vào 2025-12-02 lúc 09:00.','PENDING','UNREAD'),
('not10000015','usr20000005','app10000015','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc49208531 vào 2025-12-03 lúc 08:00.','PENDING','UNREAD'),
('not10000016','usr20000006','app10000016','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc19283744 vào 2025-12-05 lúc 08:00.','PENDING','UNREAD'),
('not10000017','usr20000007','app10000017','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc58392044 vào 2025-12-06 lúc 07:30.','PENDING','UNREAD'),
('not10000018','usr20000008','app10000018','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc48392022 vào 2025-12-05 lúc 08:00.','PENDING','UNREAD'),
('not10000019','usr20000009','app10000019','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc49382011 vào 2025-12-04 lúc 09:00.','PENDING','UNREAD'),
('not10000020','usr20000010','app10000020','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc28492004 vào 2025-12-03 lúc 08:00.','PENDING','UNREAD'),

('not10000021','usr20000001','app10000021','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc94830222 vào 2025-12-01 lúc 08:00.','PENDING','UNREAD'),
('not10000022','usr20000002','app10000022','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc10293844 vào 2025-12-03 lúc 07:30.','PENDING','UNREAD'),
('not10000023','usr20000003','app10000023','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc84930291 vào 2025-12-02 lúc 08:00.','PENDING','UNREAD'),
('not10000024','usr20000004','app10000024','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc49201020 vào 2025-12-04 lúc 09:00.','PENDING','UNREAD'),
('not10000025','usr20000005','app10000025','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc55930294 vào 2025-12-06 lúc 08:00.','PENDING','UNREAD'),
('not10000026','usr20000006','app10000026','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc19384011 vào 2025-12-05 lúc 08:30.','PENDING','UNREAD'),
('not10000027','usr20000007','app10000027','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc11938200 vào 2025-12-03 lúc 08:00.','PENDING','UNREAD'),
('not10000028','usr20000008','app10000028','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc11029384 vào 2025-12-01 lúc 09:00.','PENDING','UNREAD'),
('not10000029','usr20000009','app10000029','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc77483920 vào 2025-12-02 lúc 07:30.','PENDING','UNREAD'),
('not10000030','usr20000010','app10000030','APPOINTMENT_UPDATE','Bạn có lịch hẹn với bác sĩ doc99200310 vào 2025-12-04 lúc 08:00.','PENDING','UNREAD');
