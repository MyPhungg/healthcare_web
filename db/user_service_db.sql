CREATE DATABASE IF NOT EXISTS user_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE user_service_db;
CREATE TABLE user (
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE speciality (
    speciality_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE patient (
    patient_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('MALE', 'FEMALE') NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    district VARCHAR(100),
    city VARCHAR(100),
    insurance_num VARCHAR(50) UNIQUE,
    profile_img VARCHAR(255),
    cover_img VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE doctor (
    doctor_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('MALE', 'FEMALE') NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    district VARCHAR(100),
    city VARCHAR(100),
    speciality_id VARCHAR(50) NOT NULL,
    clinic_name VARCHAR(255) NOT NULL,
    clinic_description TEXT,
    bio TEXT,
    profile_img VARCHAR(255),
    cover_img VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (speciality_id) REFERENCES speciality(speciality_id) ON DELETE RESTRICT ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO user (user_id, username, email, phone, password, role)
VALUES ('usr12345678', 'admin01', 'admin01@example.com', '0900000001', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'ADMIN');

INSERT INTO user (user_id, username, email, phone, password, role) VALUES
('usr10000001', 'doctor01', 'doctor01@example.com', '0910000001', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000002', 'doctor02', 'doctor02@example.com', '0910000002', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000003', 'doctor03', 'doctor03@example.com', '0910000003', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000004', 'doctor04', 'doctor04@example.com', '0910000004', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000005', 'doctor05', 'doctor05@example.com', '0910000005', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000006', 'doctor06', 'doctor06@example.com', '0910000006', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000007', 'doctor07', 'doctor07@example.com', '0910000007', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000008', 'doctor08', 'doctor08@example.com', '0910000008', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000009', 'doctor09', 'doctor09@example.com', '0910000009', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000010', 'doctor10', 'doctor10@example.com', '0910000010', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000011', 'doctor11', 'doctor11@example.com', '0910000011', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000012', 'doctor12', 'doctor12@example.com', '0910000012', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000013', 'doctor13', 'doctor13@example.com', '0910000013', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000014', 'doctor14', 'doctor14@example.com', '0910000014', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000015', 'doctor15', 'doctor15@example.com', '0910000015', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000016', 'doctor16', 'doctor16@example.com', '0910000016', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000017', 'doctor17', 'doctor17@example.com', '0910000017', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000018', 'doctor18', 'doctor18@example.com', '0910000018', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000019', 'doctor19', 'doctor19@example.com', '0910000019', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000020', 'doctor20', 'doctor20@example.com', '0910000020', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000021', 'doctor21', 'doctor21@example.com', '0910000021', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000022', 'doctor22', 'doctor22@example.com', '0910000022', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000023', 'doctor23', 'doctor23@example.com', '0910000023', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000024', 'doctor24', 'doctor24@example.com', '0910000024', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000025', 'doctor25', 'doctor25@example.com', '0910000025', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000026', 'doctor26', 'doctor26@example.com', '0910000026', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000027', 'doctor27', 'doctor27@example.com', '0910000027', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000028', 'doctor28', 'doctor28@example.com', '0910000028', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000029', 'doctor29', 'doctor29@example.com', '0910000029', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000030', 'doctor30', 'doctor30@example.com', '0910000030', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000031', 'doctor31', 'doctor31@example.com', '0910000031', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000032', 'doctor32', 'doctor32@example.com', '0910000032', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000033', 'doctor33', 'doctor33@example.com', '0910000033', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000034', 'doctor34', 'doctor34@example.com', '0910000034', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000035', 'doctor35', 'doctor35@example.com', '0910000035', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000036', 'doctor36', 'doctor36@example.com', '0910000036', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000037', 'doctor37', 'doctor37@example.com', '0910000037', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000038', 'doctor38', 'doctor38@example.com', '0910000038', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000039', 'doctor39', 'doctor39@example.com', '0910000039', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000040', 'doctor40', 'doctor40@example.com', '0910000040', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000041', 'doctor41', 'doctor41@example.com', '0910000041', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000042', 'doctor42', 'doctor42@example.com', '0910000042', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000043', 'doctor43', 'doctor43@example.com', '0910000043', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000044', 'doctor44', 'doctor44@example.com', '0910000044', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000045', 'doctor45', 'doctor45@example.com', '0910000045', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000046', 'doctor46', 'doctor46@example.com', '0910000046', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000047', 'doctor47', 'doctor47@example.com', '0910000047', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000048', 'doctor48', 'doctor48@example.com', '0910000048', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000049', 'doctor49', 'doctor49@example.com', '0910000049', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR'),
('usr10000050', 'doctor50', 'doctor50@example.com', '0910000050', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'DOCTOR');

INSERT INTO user (user_id, username, email, phone, password, role) VALUES
('usr20000001', 'patient01', 'patient01@example.com', '0920000001', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000002', 'patient02', 'patient02@example.com', '0920000002', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000003', 'patient03', 'patient03@example.com', '0920000003', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000004', 'patient04', 'patient04@example.com', '0920000004', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000005', 'patient05', 'patient05@example.com', '0920000005', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000006', 'patient06', 'patient06@example.com', '0920000006', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000007', 'patient07', 'patient07@example.com', '0920000007', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000008', 'patient08', 'patient08@example.com', '0920000008', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000009', 'patient09', 'patient09@example.com', '0920000009', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT'),
('usr20000010', 'patient10', 'patient10@example.com', '0920000010', '$2a$12$U49Ksungmuths6QCVHVzMuXYeWl8SVwXCEp4oqY19xHrF6ZwmpaDO', 'PATIENT');

INSERT INTO speciality (speciality_id, name, description) VALUES
('SP40138927', 'Nội tổng quát', 'Chẩn đoán và điều trị các bệnh lý nội khoa không cần phẫu thuật.'),
('SP17564203', 'Ngoại tổng quát', 'Chẩn đoán và điều trị các bệnh lý cần can thiệp phẫu thuật.'),
('SP82905164', 'Sản', 'Chăm sóc sức khỏe phụ nữ trong thời kỳ mang thai, sinh đẻ và sau sinh.'),
('SP55347819', 'Phụ khoa', 'Chẩn đoán và điều trị các bệnh lý về cơ quan sinh dục nữ ngoài thời kỳ mang thai.'),
('SP96210358', 'Nhi', 'Chăm sóc sức khỏe và điều trị bệnh cho trẻ em từ sơ sinh đến tuổi vị thành niên.'),
('SP30789426', 'Mắt', 'Chẩn đoán và điều trị các bệnh về mắt và hệ thống thị giác.'),
('SP63451702', 'Tai – Mũi – Họng', 'Chẩn đoán và điều trị các bệnh lý liên quan đến tai, mũi, họng và cấu trúc liên quan.'),
('SP28096531', 'Răng – Hàm – Mặt', 'Chẩn đoán và điều trị các bệnh lý, chấn thương và dị tật vùng răng, hàm và mặt.'),
('SP74123085', 'Da liễu', 'Chẩn đoán và điều trị các bệnh lý về da, tóc và móng.'),
('SP09875641', 'Tâm thần', 'Chẩn đoán, điều trị và phòng ngừa các rối loạn tâm thần và hành vi.');

INSERT INTO patient (
    patient_id, user_id, full_name, gender, date_of_birth, address, district, city,
    insurance_num, profile_img, cover_img
) VALUES
('pat48201933', 'usr20000001', 'Nguyễn Minh An', 'MALE', '1998-05-12', '123 Lê Lợi', 'Quận 1', 'TP HCM', 'SG-102938', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat99120483', 'usr20000002', 'Trần Bảo Hân', 'FEMALE', '2000-11-03', '45 Trần Hưng Đạo', 'Hoàn Kiếm', 'Hà Nội', 'HN-558392', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat20394811', 'usr20000003', 'Lê Quốc Thịnh', 'MALE', '1997-08-22', '78 Nguyễn Văn Cừ', 'Ngô Quyền', 'Hải Phòng', 'HP-229384', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat59384022', 'usr20000004', 'Phạm Thuỳ Vy', 'FEMALE', '1999-02-15', '56 Lý Thường Kiệt', 'Hải Châu', 'Đà Nẵng', 'DN-493820', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat11920384', 'usr20000005', 'Đỗ Gia Bảo', 'MALE', '2001-09-09', '21 Nguyễn Huệ', 'Ninh Kiều', 'Cần Thơ', 'CT-102384', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat33019482', 'usr20000006', 'Võ Thúy An', 'FEMALE', '1996-04-30', '90 Hai Bà Trưng', 'Quận 3', 'TP HCM', 'SG-332910', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat22039481', 'usr20000007', 'Huỳnh Minh Khang', 'MALE', '1995-12-01', '34 Nguyễn Thị Minh Khai', 'Quận 1', 'TP HCM', 'SG-992004', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat55839201', 'usr20000008', 'Phan Ngọc Ánh', 'FEMALE', '1998-03-17', '12 Trần Phú', 'Hồng Bàng', 'Hải Phòng', 'HP-220123', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat22938410', 'usr20000009', 'Bùi Anh Tú', 'MALE', '1997-10-25', '67 Nguyễn Trãi', 'Thanh Xuân', 'Hà Nội', 'HN-558200', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg'),
('pat99832044', 'usr20000010', 'Mai Khánh Linh', 'FEMALE', '2000-06-09', '33 Lê Duẩn', 'Sơn Trà', 'Đà Nẵng', 'DN-493300', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg', '/uploads/0de6d6d7-125d-4a61-8a1f-29eea0265a51_hi.jpg');


INSERT INTO doctor
(doctor_id, user_id, full_name, gender, date_of_birth, address, district, city, speciality_id, clinic_name, clinic_description, bio, profile_img, cover_img)
VALUES
('doc38492015','usr10000001','Nguyễn Minh An','MALE','1982-07-12','123 Lê Lợi','Quận 1','TP HCM','SP40138927','Phòng khám Minh An','Khám chữa bệnh nội tổng quát.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Nội tổng quát.','/uploads/doctor3.jpg','/uploads/hospital5.jpg'),
('doc59384012','usr10000002','Trần Bảo Hân','FEMALE','1985-04-22','45 Trần Hưng Đạo','Hoàn Kiếm','Hà Nội','SP55347819','Phòng khám Bảo Hân','Khám và điều trị phụ khoa.','Tốt nghiệp ĐH Y Hà Nội, CKI Phụ khoa.','/uploads/nudoctor2.jpg','/uploads/hospital9.jpg'),
('doc12059384','usr10000003','Lê Quốc Thịnh','MALE','1978-11-05','78 Nguyễn Văn Cừ','Ngô Quyền','Hải Phòng','SP82905164','Phòng khám Quốc Thịnh','Khám và điều trị sản khoa.','Tốt nghiệp ĐH Y Hải Phòng, CKI Sản.','/uploads/doctor-2337835_1280.jpg','/uploads/hospital2.jpg'),
('doc90581244','usr10000004','Phạm Thu Uyên','FEMALE','1990-09-21','56 Lý Thường Kiệt','Hải Châu','Đà Nẵng','SP30789426','Phòng khám Thu Uyên','Khám và điều trị bệnh về mắt.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Mắt.','/uploads/nudoctor5.jpg','/uploads/hospital7.jpg'),
('doc49208531','usr10000005','Đỗ Khánh Duy','MALE','1983-02-13','22 Lê Lai','Ninh Kiều','Cần Thơ','SP63451702','Phòng khám Khánh Duy','Khám Tai – Mũi – Họng.','Tốt nghiệp ĐH Y Cần Thơ, CKI Tai Mũi Họng.','/uploads/doctor12.jpg','/uploads/hospital4.jpg'),
('doc19283744','usr10000006','Nguyễn Nhã Lam','FEMALE','1989-03-29','90 Võ Văn Kiệt','Quận 5','TP HCM','SP74123085','Phòng khám Nhã Lam','Điều trị bệnh da liễu.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Da liễu.','/uploads/nudoctor9.jpg','/uploads/hospital10.jpg'),
('doc58392044','usr10000007','Võ Phúc Hậu','MALE','1981-01-19','12 Hoàng Hoa Thám','Bình Thủy','Cần Thơ','SP40138927','Phòng khám Phúc Hậu','Khám chữa bệnh nội.','Tốt nghiệp ĐH Y Cần Thơ, CKI Nội tổng quát.','/uploads/ai-generated-9019520_1280.png','/uploads/hospital1.jpg'),
('doc48392022','usr10000008','Huỳnh Tấn Lộc','MALE','1984-06-07','77 Nguyễn Trãi','Quận 1','TP HCM','SP28096531','Phòng khám Tấn Lộc','Khám răng – hàm – mặt.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI RHM.','/uploads/doctor4.jpg','/uploads/hospital6.jpg'),
('doc49382011','usr10000009','Trịnh Gia Hân','FEMALE','1992-08-12','32 Bạch Đằng','Hoàn Kiếm','Hà Nội','SP09875641','Phòng khám Gia Hân','Tư vấn – điều trị rối loạn tâm thần.','Tốt nghiệp ĐH Y Hà Nội, CKI Tâm thần.','/uploads/nudoctor7.jpg','/uploads/hospital3.jpg'),
('doc28492004','usr10000010','Bùi Minh Phát','MALE','1980-10-03','55 Ung Văn Khiêm','Bình Thạnh','TP HCM','SP96210358','Phòng khám Minh Phát','Khám và điều trị bệnh nhi.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Nhi khoa.','/uploads/doctor10.jpg','/uploads/hospital8.jpg'),

('doc58291034','usr10000011','Nguyễn Thanh Vy','FEMALE','1986-11-19','12 Phan Bội Châu','Hoàn Kiếm','Hà Nội','SP40138927','Phòng khám Thanh Vy','Khám nội tổng quát.','Tốt nghiệp ĐH Y Hà Nội, CKI Nội khoa.','/uploads/nudoctor1.jpg','/uploads/hospital12.jpg'),
('doc22291033','usr10000012','Lưu Hoài Nam','MALE','1984-05-10','88 Nguyễn Tất Thành','Hải Châu','Đà Nẵng','SP82905164','Phòng khám Hoài Nam','Chăm sóc sức khỏe sinh sản.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Sản.','/uploads/doctor3.jpg','/uploads/hospital5.jpg'),
('doc91283044','usr10000013','Trần Ngọc Trâm','FEMALE','1991-09-02','46 Cách Mạng Tháng 8','Quận 3','TP HCM','SP55347819','Phòng khám Ngọc Trâm','Điều trị phụ khoa.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Phụ khoa.','/uploads/nudoctor6.jpg','/uploads/hospital9.jpg'),
('doc11293485','usr10000014','Phạm Hữu Thiện','MALE','1979-03-13','34 Điện Biên Phủ','Bình Thạnh','TP HCM','SP30789426','Phòng khám Hữu Thiện','Khám mắt tổng quát.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Mắt.','/uploads/doctor-2337835_1280.jpg','/uploads/hospital2.jpg'),
('doc32393752','usr10000015','Hoàng Mỹ Quyên','FEMALE','1987-06-27','76 Hùng Vương','Ninh Kiều','Cần Thơ','SP74123085','Phòng khám Mỹ Quyên','Điều trị da liễu.','Tốt nghiệp ĐH Y Cần Thơ, CKI Da liễu.','/uploads/nudoctor8.jpg','/uploads/hospital7.jpg'),
('doc72393411','usr10000016','Đặng Gia Minh','MALE','1983-08-25','19 Tôn Đức Thắng','Hoàn Kiếm','Hà Nội','SP63451702','Phòng khám Gia Minh','Khám TMH tổng quát.','Tốt nghiệp ĐH Y Hà Nội, CKI Tai Mũi Họng.','/uploads/doctor12.jpg','/uploads/hospital4.jpg'),
('doc11922384','usr10000017','Thái Bích Lan','FEMALE','1988-12-02','87 Nguyễn Thị Minh Khai','Quận 1','TP HCM','SP96210358','Phòng khám Bích Lan','Khám sức khỏe trẻ em.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Nhi khoa.','/uploads/nudoctor11.jpg','/uploads/hospital10.jpg'),
('doc33291944','usr10000018','Ngô Hữu Lâm','MALE','1980-07-17','23 Điện Biên Phủ','Ngô Quyền','Hải Phòng','SP28096531','Phòng khám Hữu Lâm','Khám răng hàm mặt.','Tốt nghiệp ĐH Y Hải Phòng, CKI RHM.','/uploads/ai-generated-9019520_1280.png','/uploads/hospital1.jpg'),
('doc43219402','usr10000019','Lê Hồng Yến','FEMALE','1990-05-30','12 Bạch Đằng','Hải Châu','Đà Nẵng','SP09875641','Phòng khám Hồng Yến','Tư vấn tâm lý & tâm thần.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Tâm thần.','/uploads/nudoctor2.jpg','/uploads/hospital6.jpg'),
('doc55219021','usr10000020','Cao Minh Tuấn','MALE','1976-01-22','167 Nguyễn Huệ','Quận 1','TP HCM','SP40138927','Phòng khám Minh Tuấn','Khám nội tổng quát.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Nội khoa.','/uploads/doctor4.jpg','/uploads/hospital3.jpg'),

('doc51402011','usr10000021','Nguyễn Thành Đạt','MALE','1987-02-05','22 Hai Bà Trưng','Hoàn Kiếm','Hà Nội','SP30789426','Phòng khám Thành Đạt','Khám & điều trị mắt.','Tốt nghiệp ĐH Y Hà Nội, CKI Nhãn khoa.','/uploads/doctor10.jpg','/uploads/hospital8.jpg'),
('doc71001244','usr10000022','Lý Gia Bảo','MALE','1984-06-26','56 Võ Văn Tần','Quận 3','TP HCM','SP55347819','Phòng khám Gia Bảo','Khám phụ khoa.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Phụ khoa.','/uploads/doctor3.jpg','/uploads/hospital12.jpg'),
('doc61220094','usr10000023','Bùi Ngọc Trinh','FEMALE','1991-04-10','78 Lê Duẩn','Hải Châu','Đà Nẵng','SP82905164','Phòng khám Ngọc Trinh','Khám thai – sản phụ khoa.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Sản.','/uploads/nudoctor5.jpg','/uploads/hospital5.jpg'),
('doc33220891','usr10000024','Vũ Quốc Định','MALE','1982-03-12','33 Hai Bà Trưng','Ninh Kiều','Cần Thơ','SP74123085','Phòng khám Quốc Định','Điều trị da liễu.','Tốt nghiệp ĐH Y Cần Thơ, CKI Da liễu.','/uploads/doctor-2337835_1280.jpg','/uploads/hospital9.jpg'),
('doc88120914','usr10000025','Trịnh Hoàng My','FEMALE','1989-07-07','65 Trần Phú','Ngô Quyền','Hải Phòng','SP28096531','Phòng khám Hoàng My','Khám răng – hàm – mặt.','Tốt nghiệp ĐH Y Hải Phòng, CKI RHM.','/uploads/nudoctor7.jpg','/uploads/hospital2.jpg'),
('doc99201449','usr10000026','Lê Minh Hưng','MALE','1981-11-01','72 Võ Thị Sáu','Bình Thạnh','TP HCM','SP09875641','Phòng khám Minh Hưng','Tư vấn tâm thần.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Tâm thần.','/uploads/doctor12.jpg','/uploads/hospital7.jpg'),
('doc74330091','usr10000027','Mai Thảo Vy','FEMALE','1990-02-28','21 Nguyễn Huệ','Hải Châu','Đà Nẵng','SP96210358','Phòng khám Thảo Vy','Khám nhi tổng quát.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Nhi khoa.','/uploads/nudoctor9.jpg','/uploads/hospital4.jpg'),
('doc22031944','usr10000028','Đặng Tấn Phát','MALE','1978-08-08','88 Ngô Gia Tự','Ngô Quyền','Hải Phòng','SP63451702','Phòng khám Tấn Phát','Khám TMH.','Tốt nghiệp ĐH Y Hải Phòng, CKI Tai Mũi Họng.','/uploads/ai-generated-9019520_1280.png','/uploads/hospital10.jpg'),
('doc11039224','usr10000029','Phùng Thúy Ngân','FEMALE','1987-05-21','15 Trần Hưng Đạo','Hoàn Kiếm','Hà Nội','SP74123085','Phòng khám Thúy Ngân','Điều trị da liễu.','Tốt nghiệp ĐH Y Hà Nội, CKI Da liễu.','/uploads/nudoctor1.jpg','/uploads/hospital1.jpg'),
('doc23039114','usr10000030','Đoàn Hữu Tâm','MALE','1985-01-12','44 Nguyễn Văn Cừ','Ninh Kiều','Cần Thơ','SP82905164','Phòng khám Hữu Tâm','Khám và điều trị sản.','Tốt nghiệp ĐH Y Cần Thơ, CKI Sản khoa.','/uploads/doctor4.jpg','/uploads/hospital6.jpg'),

('doc31109443','usr10000031','Huỳnh Nhật Hoàng','MALE','1984-09-14','98 Nguyễn Huệ','Quận 1','TP HCM','SP28096531','Phòng khám Nhật Hoàng','Khám RHM.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI RHM.','/uploads/doctor10.jpg','/uploads/hospital3.jpg'),
('doc24429401','usr10000032','Trương Lan Chi','FEMALE','1992-03-25','44 Võ Văn Kiệt','Hoàn Kiếm','Hà Nội','SP55347819','Phòng khám Lan Chi','Chăm sóc sức khỏe phụ khoa.','Tốt nghiệp ĐH Y Hà Nội, CKI Phụ khoa.','/uploads/nudoctor6.jpg','/uploads/hospital8.jpg'),
('doc58224490','usr10000033','Phan Gia Huy','MALE','1979-04-22','17 Nguyễn Khuyến','Ngô Quyền','Hải Phòng','SP40138927','Phòng khám Gia Huy','Khám nội khoa tổng quát.','Tốt nghiệp ĐH Y Hải Phòng, CKI Nội khoa.','/uploads/doctor3.jpg','/uploads/hospital12.jpg'),
('doc44922940','usr10000034','Hà Bích Như','FEMALE','1988-10-20','11 Hai Bà Trưng','Hải Châu','Đà Nẵng','SP30789426','Phòng khám Bích Như','Khám và điều trị bệnh về mắt.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Nhãn khoa.','/uploads/nudoctor8.jpg','/uploads/hospital5.jpg'),
('doc11559024','usr10000035','Đặng Quốc Vinh','MALE','1981-12-14','23 Lê Lợi','Ninh Kiều','Cần Thơ','SP63451702','Phòng khám Quốc Vinh','Khám TMH tổng quát.','Tốt nghiệp ĐH Y Cần Thơ, CKI Tai Mũi Họng.','/uploads/doctor-2337835_1280.jpg','/uploads/hospital9.jpg'),
('doc22915501','usr10000036','Ngô Thục Nhi','FEMALE','1989-11-09','66 Cách Mạng Tháng 8','Quận 3','TP HCM','SP96210358','Phòng khám Thục Nhi','Khám và điều trị bệnh nhi.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Nhi khoa.','/uploads/nudoctor11.jpg','/uploads/hospital2.jpg'),
('doc33920841','usr10000037','Lê Minh Tố','FEMALE','1992-09-01','47 Lê Lợi','Hoàn Kiếm','Hà Nội','SP74123085','Phòng khám Minh Tố','Điều trị da liễu.','Tốt nghiệp ĐH Y Hà Nội, CKI Da liễu.','/uploads/nudoctor2.jpg','/uploads/hospital7.jpg'),
('doc22895501','usr10000038','Trần Hữu Khôi','MALE','1983-07-05','31 Phan Bội Châu','Ngô Quyền','Hải Phòng','SP28096531','Phòng khám Hữu Khôi','Khám RHM.','Tốt nghiệp ĐH Y Hải Phòng, CKI RHM.','/uploads/doctor12.jpg','/uploads/hospital4.jpg'),
('doc99345102','usr10000039','Võ Tường Vy','FEMALE','1990-04-18','22 Hùng Vương','Hải Châu','Đà Nẵng','SP55347819','Phòng khám Tường Vy','Khám phụ khoa.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Phụ khoa.','/uploads/nudoctor5.jpg','/uploads/hospital10.jpg'),
('doc22058310','usr10000040','Phạm Hoài Nhân','MALE','1980-03-11','44 Nguyễn Huệ','Ninh Kiều','Cần Thơ','SP09875641','Phòng khám Hoài Nhân','Điều trị bệnh tâm thần.','Tốt nghiệp ĐH Y Cần Thơ, CKI Tâm thần.','/uploads/ai-generated-9019520_1280.png','/uploads/hospital1.jpg'),

('doc11953040','usr10000041','Dương Gia Phúc','MALE','1985-09-03','89 Trần Hưng Đạo','Hoàn Kiếm','Hà Nội','SP40138927','Phòng khám Gia Phúc','Khám nội tổng quát.','Tốt nghiệp ĐH Y Hà Nội, CKI Nội khoa.','/uploads/doctor4.jpg','/uploads/hospital6.jpg'),
('doc93022410','usr10000042','Nguyễn Minh Khang','MALE','1987-02-14','45 Nguyễn Văn Cừ','Ngô Quyền','Hải Phòng','SP96210358','Phòng khám Minh Khang','Khám nhi tổng quát.','Tốt nghiệp ĐH Y Hải Phòng, CKI Nhi khoa.','/uploads/doctor10.jpg','/uploads/hospital3.jpg'),
('doc33105514','usr10000043','Trần Hoàng Anh','FEMALE','1988-11-08','90 Lê Duẩn','Hải Châu','Đà Nẵng','SP63451702','Phòng khám Hoàng Anh','Khám TMH tổng quát.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Tai Mũi Họng.','/uploads/nudoctor7.jpg','/uploads/hospital8.jpg'),
('doc44770021','usr10000044','Lưu Khánh Tâm','MALE','1981-08-22','33 Nguyễn Thị Minh Khai','Quận 1','TP HCM','SP74123085','Phòng khám Khánh Tâm','Điều trị da liễu.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Da liễu.','/uploads/doctor3.jpg','/uploads/hospital12.jpg'),
('doc55810441','usr10000045','Bùi Quế Anh','FEMALE','1989-05-19','15 Hai Bà Trưng','Hoàn Kiếm','Hà Nội','SP28096531','Phòng khám Quế Anh','Khám RHM.','Tốt nghiệp ĐH Y Hà Nội, CKI RHM.','/uploads/nudoctor9.jpg','/uploads/hospital5.jpg'),
('doc55911904','usr10000046','Dương Tấn Khoa','MALE','1983-04-06','48 Lê Lợi','Hải Châu','Đà Nẵng','SP55347819','Phòng khám Tấn Khoa','Khám phụ khoa.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Phụ khoa.','/uploads/doctor-2337835_1280.jpg','/uploads/hospital9.jpg'),
('doc66119020','usr10000047','Trần Khánh Vy','FEMALE','1992-02-17','31 Lê Văn Sỹ','Quận 3','TP HCM','SP82905164','Phòng khám Khánh Vy','Chăm sóc sức khỏe sản khoa.','Tốt nghiệp ĐH Y Dược TP.HCM, CKI Sản.','/uploads/nudoctor1.jpg','/uploads/hospital2.jpg'),
('doc77119440','usr10000048','Nguyễn Chí Đức','MALE','1980-01-15','23 Nguyễn Thị Minh Khai','Ninh Kiều','Cần Thơ','SP30789426','Phòng khám Chí Đức','Khám và điều trị mắt.','Tốt nghiệp ĐH Y Cần Thơ, CKI Nhãn khoa.','/uploads/doctor12.jpg','/uploads/hospital7.jpg'),
('doc88211409','usr10000049','Phạm Như Quỳnh','FEMALE','1991-07-09','11 Lê Duẩn','Hải Châu','Đà Nẵng','SP96210358','Phòng khám Như Quỳnh','Khám nhi tổng quát.','Tốt nghiệp ĐH Y Dược Đà Nẵng, CKI Nhi khoa.','/uploads/nudoctor6.jpg','/uploads/hospital4.jpg'),
('doc99288711','usr10000050','Hồ Nhật Vinh','MALE','1986-12-08','105 Lê Lợi','Ngô Quyền','Hải Phòng','SP40138927','Phòng khám Nhật Vinh','Khám nội tổng quát.','Tốt nghiệp ĐH Y Hải Phòng, CKI Nội khoa.','/uploads/ai-generated-9019520_1280.png','/uploads/hospital10.jpg');
