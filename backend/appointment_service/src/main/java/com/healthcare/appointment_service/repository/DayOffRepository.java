package com.healthcare.appointment_service.repository;

import com.healthcare.appointment_service.common.DayOffStatus;
import com.healthcare.appointment_service.entity.DayOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DayOffRepository extends JpaRepository<DayOff, String> {
    DayOff findByDoctorIdAndDateOff(String doctorId, LocalDate dateOff);
    List<DayOff> findAllByDoctorIdAndStatus(String doctorId, DayOffStatus status);
}
