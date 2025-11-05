package com.healthcare.appointment_service.repository;

import com.healthcare.appointment_service.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
    Schedule findByDoctorId(String doctorId);
}
