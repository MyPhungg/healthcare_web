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
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDTO {
    private String scheduleId;
    private String doctorId;
    // Lưu các ngày làm việc: MON,TUE,WED,...
    private String workingDays;
    private Time startTime;
    private Time endTime;
    private BigDecimal consultationFee;
    private Integer slotDuration;
}
