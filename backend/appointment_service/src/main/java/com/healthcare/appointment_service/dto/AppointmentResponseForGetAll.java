package com.healthcare.appointment_service.dto;

import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.feign.dto.DoctorDTO;
import com.healthcare.appointment_service.feign.dto.PatientResponse;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AppointmentResponseForGetAll {
    Appointment appointment;
    DoctorDTO doctor;
    PatientResponse patient;
    BigDecimal fee;
}
