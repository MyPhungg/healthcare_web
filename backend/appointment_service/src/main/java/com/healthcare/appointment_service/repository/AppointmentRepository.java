package com.healthcare.appointment_service.repository;

import com.healthcare.appointment_service.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    // Kiểm tra xem có appointment trùng lịch khám cùng bác sĩ
    boolean existsByScheduleIdAndAppointmentDateAndAppointmentStartLessThanAndAppointmentEndGreaterThan(
            String scheduleId,
            LocalDate appointmentDate,
            Time proposedEndTime,   // Đây là thời gian kết thúc của lịch trình mới
            Time proposedStartTime  // Đây là thời gian bắt đầu của lịch trình mới
    );

    // Kieểm tra có trùng lịch khám bác sĩ khác không
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
            "FROM Appointment a " +
            "WHERE a.patientId = :patientId " +
            "AND a.appointmentDate = :date " +
            "AND a.appointmentStart < :endTime " +
            "AND a.appointmentEnd > :startTime")
    boolean existsTimeSlotOverlap(
            @Param("patientId") String patientId,
            @Param("date") LocalDate date,
            @Param("startTime") Time startTime,
            @Param("endTime") Time endTime
    );

    List<Appointment> findByScheduleId(String scheduleId);
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByScheduleIdAndAppointmentDate(String scheduleId, LocalDate appointmentDate);

}
