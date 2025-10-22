CREATE DATABASE IF NOT EXISTS user_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE user_service_db;
CREATE TABLE user (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE speciality (
    speciality_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);
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
);
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
);
INSERT INTO user (user_id, email, phone, password, role)
VALUES (
        'user48291035',
        'alice.p@email.com',
        '0901111111',
        '123456',
        'PATIENT'
    ),
    (
        'user73918204',
        'bob.d@email.com',
        '0902222222',
        '123456',
        'DOCTOR'
    ),
    (
        'user28491763',
        'charlie.a@email.com',
        '0903333333',
        '123456',
        'ADMIN'
    ),
    (
        'user59102847',
        'david.p@email.com',
        '0904444444',
        '123456',
        'PATIENT'
    ),
    (
        'user83047591',
        'emma.d@email.com',
        '0905555555',
        '123456',
        'DOCTOR'
    );
INSERT INTO speciality (speciality_id, name, description)
VALUES (
        'spec00000001',
        'Nhi Khoa',
        'Khám và điều trị các bệnh lý ở trẻ em.'
    ),
    (
        'spec00000002',
        'Nội Tổng Quát',
        'Khám và điều trị các bệnh nội khoa phổ biến.'
    ),
    (
        'spec00000003',
        'Răng Hàm Mặt',
        'Chăm sóc và điều trị các vấn đề về răng, hàm, và mặt.'
    ),
    (
        'spec00000004',
        'Da Liễu',
        'Chẩn đoán và điều trị các bệnh lý về da, tóc, và móng.'
    ),
    (
        'spec00000005',
        'Sản Phụ Khoa',
        'Chăm sóc sức khỏe sinh sản, mang thai và sinh nở.'
    );
INSERT INTO patient (
        patient_id,
        user_id,
        full_name,
        gender,
        date_of_birth,
        address,
        district,
        city,
        insurance_num
    )
VALUES (
        'pat10000001',
        'user48291035',
        'Nguyễn Văn An',
        'MALE',
        '1995-05-20',
        '123 Đường A',
        'Quận Ba Đình',
        'Hà Nội',
        'INSA123456'
    ),
    (
        'pat10000002',
        'user59102847',
        'Trần Thị Bình',
        'FEMALE',
        '1988-11-15',
        '456 Phố B',
        'Quận 1',
        'Hồ Chí Minh',
        'INSB789012'
    ),
    (
        'pat10000003',
        'user83047591',
        'Lê Văn Cường',
        'MALE',
        '2001-03-01',
        '789 Hẻm C',
        'Quận Hải Châu',
        'Đà Nẵng',
        'INSC345678'
    ),
    (
        'pat10000004',
        'user28491763',
        'Phạm Thị Duyên',
        'FEMALE',
        '1975-07-25',
        '101 Đường D',
        'Quận Ngô Quyền',
        'Hải Phòng',
        'INSD901234'
    ),
    (
        'pat10000005',
        'user73918204',
        'Hoàng Văn Em',
        'MALE',
        '2010-09-10',
        '202 Phố E',
        'Quận Ninh Kiều',
        'Cần Thơ',
        'INSE567890'
    );
INSERT INTO doctor (
        doctor_id,
        user_id,
        full_name,
        gender,
        date_of_birth,
        address,
        district,
        city,
        speciality_id,
        clinic_name,
        clinic_description,
        bio
    )
VALUES (
        'doc20000001',
        'user73918204',
        'Bác sĩ Lê Văn Anh',
        'MALE',
        '1980-01-01',
        '100 Nguyễn Trãi',
        'Quận 5',
        'Hồ Chí Minh',
        'spec00000001',
        'Phòng Khám Nhi Đồng Sài Gòn',
        'Chuyên khám và điều trị bệnh Nhi khoa',
        'Hơn 20 năm kinh nghiệm trong lĩnh vực nhi khoa.'
    ),
    (
        'doc20000002',
        'user83047591',
        'Bác sĩ Trần Thị Mai',
        'FEMALE',
        '1970-12-31',
        '20 Láng Hạ',
        'Quận Đống Đa',
        'Hà Nội',
        'spec00000002',
        'Bệnh Viện Đa Khoa Hồng Ngọc',
        'Khám tổng quát, chuyên sâu nội khoa.',
        'Chuyên gia hàng đầu về nội tổng quát và bệnh chuyển hóa.'
    ),
    (
        'doc20000003',
        'user48291035',
        'Bác sĩ Phạm Hữu Đức',
        'MALE',
        '1985-06-15',
        '350 Hoàng Diệu',
        'Quận Hải Châu',
        'Đà Nẵng',
        'spec00000003',
        'Nha Khoa Smile Care',
        'Chuyên về chỉnh nha và nha khoa thẩm mỹ.',
        'Đã thực hiện thành công hàng nghìn ca chỉnh nha phức tạp.'
    ),
    (
        'doc20000004',
        'user28491763',
        'Bác sĩ Nguyễn Thị Hoa',
        'FEMALE',
        '1992-04-05',
        '77 Điện Biên Phủ',
        'Quận Hồng Bàng',
        'Hải Phòng',
        'spec00000004',
        'Phòng Khám Da Liễu Trung Ương',
        'Chẩn đoán và điều trị bệnh ngoài da.',
        'Đạt chứng chỉ quốc tế về điều trị mụn và sẹo.'
    ),
    (
        'doc20000005',
        'user59102847',
        'Bác sĩ Đỗ Mạnh Hùng',
        'MALE',
        '1978-08-22',
        '300 Đường 3/2',
        'Quận Ninh Kiều',
        'Cần Thơ',
        'spec00000005',
        'Bệnh Viện Phụ Sản Quốc Tế',
        'Tư vấn, khám thai và đỡ đẻ.',
        'Chuyên khoa sản phụ với nhiều năm làm việc tại nước ngoài.'
    );