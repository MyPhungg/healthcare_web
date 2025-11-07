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

- **Backend**: Java, Spring Boot
- **Frontend**: React, Vite
- **Cơ sở dữ liệu**: MySQL
- **Containerization**: Docker, Docker Compose

---

## Cấu trúc dự án

```bash
HEALTHCARE_WEB/
│
├─ backend/
│ ├─ appointment_service/
│ ├─ user_service/
│ ├─ gateway_service/
│ └─ common/
│
├─ db/
│ ├─ init.sql
│ ├─ appointment_service_db.sql
│ └─ user_service_db.sql
│
├─ frontend/healthcare-app/
│ ├─ node_modules/
│ ├─ public/
│ ├─ src/
│ ├─ Dockerfile
│ ├─ package.json
│ └─ vite.config.js
│
└─ docker-compose.yml
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
