package com.healthcare.appointment_service.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.List;

@Entity
@Table(name = "schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @Column(name = "schedule_id", length = 50)
    private String scheduleId;

    @Column(name = "doctor_id", nullable = false, length = 50)
    private String doctorId;

    // Lưu các ngày làm việc: MON,TUE,WED,...
    @Column(name = "working_days", nullable = false)
    private String workingDays;

    @Column(name = "start_time", nullable = false)
    private Time startTime;

    @Column(name = "end_time", nullable = false)
    private Time endTime;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "slot_duration", nullable = false)
    private Integer slotDuration; // phút

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Appointment> appointments;
}
