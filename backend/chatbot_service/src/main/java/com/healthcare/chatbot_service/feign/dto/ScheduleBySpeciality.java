package com.healthcare.chatbot_service.feign.dto;

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
