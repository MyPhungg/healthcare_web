package com.healthcare.appointment_service.dto;

import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.feign.dto.DoctorDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AppointmentResponse {
    Appointment appointment;
    DoctorDTO doctor;
    BigDecimal fee;
}
