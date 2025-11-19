package com.healthcare.appointment_service.dto;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.healthcare.appointment_service.entity.Appointment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateScheduleRequest {
    private String doctorId;
    private String workingDays;
    private Time startTime;
    private Time endTime;
    private BigDecimal consultationFee;
    private Integer slotDuration;
}
