package com.healthcare.appointment_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.healthcare.appointment_service.common.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @Column(name = "appointment_id", length = 50)
    private String appointmentId;

    @Column(name = "schedule_id", length = 50, nullable = false)
    private String scheduleId;

    @Column(name = "patient_id", length = 50, nullable = false)
    private String patientId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_start", nullable = false)
    private Time appointmentStart;

    @Column(name = "appointment_end", nullable = false)
    private Time appointmentEnd;

    @Column(name = "interacted_at")
    private LocalDateTime interactedAt = LocalDateTime.now();

    @Column(name = "interacted_by", nullable = false, length = 50)
    private String interactedBy;

    @Column(name = "reason")
    private String reason;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", insertable = false, updatable = false)
    @JsonBackReference
    private Schedule schedule;


}
