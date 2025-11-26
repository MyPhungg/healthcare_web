package com.healthcare.user_service.service;

import com.healthcare.user_service.entity.Patient;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.dto.PatientResponse;
import com.healthcare.user_service.common.CodeGeneratorUtils;
import com.healthcare.user_service.repository.PatientRepository;
import com.healthcare.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(PatientService.class);


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

//    public Optional<Patient> getPatientById(String patientId) {
//        return patientRepository.findById(patientId);
//    }

    public Patient createPatient(Patient patient, String userId) {
        try {
            patient.setPatientId(CodeGeneratorUtils.generateCode("PAT"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            patient.setUser(user);
            logger.info("Creating patient for user: {} with role: {}", user.getUserId(), user.getRole());
            return patientRepository.save(patient);
        } catch (Exception e) {
            logger.error("Error creating patient for userId: " + userId, e);
            throw e; // ném tiếp để controller hoặc Postman nhận lỗi
        }
    }

    public Patient updatePatient(String patientId, Patient patient) {
        Patient existing = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setPatientId(existing.getPatientId());
        patient.setUser(existing.getUser()); // giữ user cũ
        return patientRepository.save(patient);
    }

    public void deletePatient(String patientId) {
        patientRepository.deleteById(patientId);
    }
    public PatientResponse toResponse(Patient patient) {
        return PatientResponse.builder()
                .patientId(patient.getPatientId())
                .fullName(patient.getFullName())
                .gender(patient.getGender().name())
                .dateOfBirth(patient.getDateOfBirth())
                .address(patient.getAddress())
                .district(patient.getDistrict())
                .city(patient.getCity())
                .insuranceNum(patient.getInsuranceNum())
                .profileImg(patient.getProfileImg())
                .coverImg(patient.getCoverImg())
                .user(PatientResponse.UserInfo.builder()
                        .userId(patient.getUser().getUserId())
                        .email(patient.getUser().getEmail())
                        .username(patient.getUser().getUsername())
                        .role(patient.getUser().getRole().name())
                        .provider(patient.getUser().getProvider().name())
                        .build())
                .build();
    }

}

