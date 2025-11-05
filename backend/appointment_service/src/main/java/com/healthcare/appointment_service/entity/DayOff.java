package com.healthcare.appointment_service.entity;

import com.healthcare.appointment_service.common.DayOffStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "day_off",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"doctor_id", "date_off"})
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DayOff {

    @Id
    @Column(name = "day_off_id", length = 50)
    private String dayOffId;

    @Column(name = "doctor_id", nullable = false, length = 50)
    private String doctorId;

    @Column(name = "date_off", nullable = false)
    private LocalDate dateOff;

    @Column(name = "reason")
    private String reason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by", nullable = false, length = 50)
    private String createdBy;

    @Column(name = "status", nullable = false)
    private DayOffStatus status = DayOffStatus.ENABLED;
}

