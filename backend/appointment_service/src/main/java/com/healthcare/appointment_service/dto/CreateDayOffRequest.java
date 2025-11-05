package com.healthcare.appointment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDayOffRequest {
    private String doctorId;
    private LocalDate dateOff;
    private String reason;
    private String createdBy;

}
