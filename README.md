# HEALTHCARE_WEB

Dự án **HEALTHCARE_WEB** là ứng dụng liên kết giữa các bác sĩ và bệnh nhân, hỗ trợ đặt lịch online tiện lợi, dễ dàng với kiến trúc **microservices**, bao gồm backend (Java/Spring Boot), frontend (Vite + React) và cơ sở dữ liệu MySQL.

---

## Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [API endpoints](#api-endpoints)
- [Database](#database)
- [Frontend](#frontend)
- [License](#license)

---

## Công nghệ sử dụng

### Backend
- **Java 21**
- **Spring Boot** – Xây dựng các service backend và REST API.
- **Spring Cloud** – Hỗ trợ kiến trúc Microservices.

### Service Discovery
- **Eureka Server** – Đăng ký và phát hiện service trong hệ thống phân tán.

### API Gateway
- **Spring Cloud Gateway** – Điều phối request, định tuyến service, xử lý load balancing & filter.

### Messaging
- **Apache Kafka** – Giao tiếp bất đồng bộ giữa các service (publish/subcribe, event-driven).

### Database
- **MySQL** – Lưu trữ dữ liệu quan hệ cho từng service.

### Reporting
- **Jasper Reports** – Tạo báo cáo PDF/Excel từ dữ liệu hệ thống.

### Email Service
- **Spring Boot Email (JavaMailSender)** – Gửi email thông báo tự động.

### Frontend
- **ReactJS** – Xây dựng giao diện người dùng hiện đại, SPA.

### DevOps & Tools
- **Docker** – Đóng gói và triển khai microservices.
- **Maven** – Quản lý dependency và build dự án.
- **Git** – Quản lý mã nguồn.
- **Postman** – Kiểm thử API và debug request/response.


---

## Cấu trúc dự án

```bash
healthcare_web/
├── backend/                # Mã nguồn backend (Spring Boot - backend-parent)
│   ├── appointment_service/
│   ├── user_service/
│   ├── notification_service/
│   ├── gateway_service/
│   └── eureka_server/
│
├── frontend/               # Mã nguồn frontend (React)
│   ├── public/
│   └── src/
│
├── db/                     # Cấu hình database, script SQL
│
├── uploads/                # Lưu file upload (ảnh, tài liệu, ...)
│
├── node_modules/           # Thư viện frontend (tự động tạo bởi npm/yarn)
│
├── .env                    # Biến môi trường hệ thống
├── .gitignore
└── docker-compose.yml      # Orchestration cho toàn bộ microservices

```

- **backend/**: Chứa các microservice Java.
- **db/**: Chứa các file SQL khởi tạo cơ sở dữ liệu.
- **frontend/**: Ứng dụng web React.
- **docker-compose.yml**: Cấu hình Docker cho toàn bộ dự án.

---

## Cài đặt & Chạy dự án

### Yêu cầu

- Docker & Docker Compose
- Java 21
- Node.js 22

### Khởi chạy

1. Tạo mạng Docker (nếu cần):

```bash
docker network create healthcare_net
```

2. Khởi chạy các service bằng Docker Compose:

```bash
docker-compose up --build
```

3. Truy cập frontend:

```bash
http://localhost:3000
```

## API Endpoints

- Gateway Service: Là entrypoint cho tất cả API.
- User Service: Quản lý người dùng.
- Appointment Service: Quản lý lịch hẹn.

## Database

- init.sql: Khởi tạo cơ sở dữ liệu chung.
- user_service_db.sql: Cấu trúc bảng và dữ liệu ban đầu cho User Service.
- appointment_service_db.sql: Cấu trúc bảng và dữ liệu ban đầu cho Appointment Service.

## Frontend

- Chạy frontend độc lập (nếu cần):

```bash
cd frontend/healthcare-app
npm install
npm run dev
```

- Giao diện React được build bằng Vite.

## License

Dự án này được phát triển nội bộ, vui lòng tham khảo chủ sở hữu trước khi sử dụng.
