package com.healthcare.appointment_service.feign.dto;

import com.healthcare.appointment_service.dto.ScheduleDTO;
import com.healthcare.appointment_service.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleBySpeciality {
    DoctorDTO doctorDTO;
    BigDecimal fee;
    List<String> list;
}
