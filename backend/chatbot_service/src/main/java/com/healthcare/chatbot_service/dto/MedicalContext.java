package com.healthcare.chatbot_service.dto;

import com.healthcare.chatbot_service.feign.dto.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalContext {
    public List<AppointmentDTO> appointments;
    public PatientResponse currentPatient;
    public List<NotificationDTO> notifications;
    public List<SpecialityDTO> specialities;
    public List<DoctorDTO> doctors;


}
