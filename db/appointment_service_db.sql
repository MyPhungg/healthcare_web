CREATE DATABASE IF NOT EXISTS appointment_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE appointment_service_db;
CREATE TABLE schedule (
    schedule_id VARCHAR(50) PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    working_days SET('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    consultation_fee DECIMAL(10, 2),
    slot_duration INT NOT NULL -- tính bằng phút
);
CREATE TABLE appointment (
    appointment_id VARCHAR(50) PRIMARY KEY,
    schedule_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    appointment_date DATE NOT NULL,
    appointment_start TIME NOT NULL,
    appointment_end TIME NOT NULL,
    interacted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    interacted_by VARCHAR(50) NOT NULL,
    reason TEXT
);

CREATE TABLE day_off (
    day_off_id VARCHAR(50) PRIMARY KEY,
    doctor_id VARCHAR(50) NOT NULL,
    date_off DATE NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) NOT NULL,
    status ENUM('ENABLED', 'DISABLED') DEFAULT 'ENABLED',
    UNIQUE (doctor_id, date_off)
);

INSERT INTO schedule (
    schedule_id,
    doctor_id,
    working_days,
    start_time,
    end_time,
    consultation_fee,
    slot_duration
) VALUES
    ('sch30000001', 'doc20000001', 'MON,TUE,WED,THU,FRI,SAT,SUN', '08:00:00', '12:00:00', 300000.00, 30),
    ('sch30000002', 'doc20000002', 'MON,TUE,WED,THU,FRI,SAT,SUN', '14:00:00', '18:00:00', 450000.00, 20),
    ('sch30000003', 'doc20000003', 'MON,TUE,WED,THU,FRI,SAT,SUN', '16:00:00', '20:00:00', 500000.00, 45),


INSERT INTO appointment (
    appointment_id,
    schedule_id,
    patient_id,
    status,
    appointment_date,
    appointment_start,
    appointment_end,
    interacted_by,
    reason
) VALUES
    ('app40000001', 'sch30000001', 'pat10000001', 'CONFIRMED', '2025-11-03', '08:00:00', '08:30:00', 'user89012345', 'Bé bị sốt và ho liên tục 3 ngày.'),
    ('app40000002', 'sch30000002', 'pat10000002', 'PENDING', '2025-11-04', '14:00:00', '14:20:00', 'user23456789', 'Khám sức khỏe định kỳ.'),
    ('app40000003', 'sch30000003', 'pat10000001', 'COMPLETED', '2025-11-02', '09:00:00', '09:30:00', 'user89012345', 'Tái khám sau khi dùng thuốc.'),
    ('app40000004', 'sch30000001', 'pat10000001', 'CANCELLED', '2025-11-03', '10:00:00', '10:20:00', 'user23456789', 'Bệnh nhân bận đột xuất.'),
    ('app40000005', 'sch30000003', 'pat10000003', 'CONFIRMED', '2025-11-01', '16:00:00', '16:45:00', 'user89012345', 'Khám răng và lấy cao răng.');