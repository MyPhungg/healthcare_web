CREATE DATABASE IF NOT EXISTS appointment_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE appointment_service_db;
CREATE TABLE schedule (
    schedule_id VARCHAR(50) PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    consultation_fee DECIMAL(10, 2),
    slot_duration INT NOT NULL -- tính bằng phút
);
CREATE TABLE appointments (
    appointment_id VARCHAR(50) PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    schedule_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id) ON DELETE CASCADE ON UPDATE CASCADE,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    interacted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    interacted_by VARCHAR(50) NOT NULL,
    reason TEXT
);
INSERT INTO schedule (
        schedule_id,
        doctor_id,
        date,
        start_time,
        end_time,
        consultation_fee,
        slot_duration
    )
VALUES (
        'sch30000001',
        'doc20000001',
        '2025-11-01',
        '08:00:00',
        '12:00:00',
        300000.00,
        30
    ),
    (
        'sch30000002',
        'doc20000002',
        '2025-11-01',
        '14:00:00',
        '18:00:00',
        450000.00,
        20
    ),
    (
        'sch30000003',
        'doc20000001',
        '2025-11-02',
        '08:00:00',
        '11:00:00',
        300000.00,
        30
    ),
    (
        'sch30000004',
        'doc20000003',
        '2025-11-02',
        '16:00:00',
        '20:00:00',
        500000.00,
        45
    ),
    (
        'sch30000005',
        'doc20000002',
        '2025-11-03',
        '09:00:00',
        '13:00:00',
        450000.00,
        20
    );
INSERT INTO appointments (
        appointment_id,
        doctor_id,
        patient_id,
        schedule_id,
        status,
        interacted_by,
        reason
    )
VALUES (
        'app40000001',
        'doc20000001',
        'pat10000001',
        'sch30000001',
        'CONFIRMED',
        'user89012345',
        'Bé bị sốt và ho liên tục 3 ngày.'
    ),
    (
        'app40000002',
        'doc20000002',
        'pat10000002',
        'sch30000002',
        'PENDING',
        'user23456789',
        'Khám sức khỏe định kỳ.'
    ),
    (
        'app40000003',
        'doc20000001',
        'pat10000003',
        'sch30000003',
        'COMPLETED',
        'user89012345',
        'Tái khám sau khi dùng thuốc.'
    ),
    (
        'app40000004',
        'doc20000002',
        'pat10000001',
        'sch30000005',
        'CANCELLED',
        'user23456789',
        'Bệnh nhân bận đột xuất.'
    ),
    (
        'app40000005',
        'doc20000003',
        'pat10000003',
        'sch30000004',
        'CONFIRMED',
        'user89012345',
        'Khám răng và lấy cao răng.'
    );