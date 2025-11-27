package com.healthcare.user_service.service;

import com.healthcare.user_service.entity.Patient;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.dto.PatientResponse;
import com.healthcare.user_service.common.CodeGeneratorUtils;
import com.healthcare.user_service.repository.PatientRepository;
import com.healthcare.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(PatientService.class);
    private final FileStorageService fileStorageService;


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

//    public Optional<Patient> getPatientById(String patientId) {
//        return patientRepository.findById(patientId);
//    }
public PatientResponse getPatientById(String id) {
    Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    return toResponse(patient);
}

    public Patient createPatient(String userId,
                                 String fullName,
                                 Patient.Gender gender,
                                 String dateOfBirth,
                                 String address,
                                 String district,
                                 String city,
                                 String insuranceNum,
                                 MultipartFile profileImg,
                                 MultipartFile coverImg) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(()-> new RuntimeException("Không tìm thấy người dùng"));
            Patient newPatient = new Patient();
            newPatient.setPatientId(CodeGeneratorUtils.generateCode("PAT"));
//            newPatient.setUser(user);
            newPatient.setUserId(userId);
            newPatient.setAddress(address);
            newPatient.setCity(city);
            newPatient.setDistrict(district);
            newPatient.setGender(gender);
            newPatient.setFullName(fullName);
            newPatient.setDateOfBirth(LocalDate.parse(dateOfBirth));
            newPatient.setInsuranceNum(insuranceNum);

            if(profileImg != null && !profileImg.isEmpty()){
                String profileUrl = fileStorageService.save(profileImg);
                newPatient.setProfileImg(profileUrl);
            }

            if(coverImg != null && !coverImg.isEmpty()){
                String coverUrl = fileStorageService.save(coverImg);
                newPatient.setCoverImg(coverUrl);
            }

            logger.info("Creating patient for user: {} with role: {}", user.getUserId(), user.getRole());
            return patientRepository.save(newPatient);
        } catch (Exception e) {
            logger.error("Error creating patient for userId: " + userId, e);
            throw e; // ném tiếp để controller hoặc Postman nhận lỗi
        }
    }

    public Patient updatePatient(String patientId,
                                 String fullName,
                                 Patient.Gender gender,
                                 String dateOfBirth,
                                 String address,
                                 String district,
                                 String city,
                                 String insuranceNum,
                                 MultipartFile profileImg,
                                 MultipartFile coverImg) {
        Patient existing = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
//        existing.setUserId(userId);
        existing.setAddress(address);
        existing.setCity(city);
        existing.setDistrict(district);
        existing.setGender(gender);
        existing.setFullName(fullName);
        existing.setDateOfBirth(LocalDate.parse(dateOfBirth));
        existing.setInsuranceNum(insuranceNum);

        if(profileImg != null && !profileImg.isEmpty()){
            String profileUrl = fileStorageService.save(profileImg);
            existing.setProfileImg(profileUrl);
        }

        if(coverImg != null && !coverImg.isEmpty()){
            String coverUrl = fileStorageService.save(coverImg);
            existing.setCoverImg(coverUrl);
        }
//        existing.setUser(existing.getUser()); // giữ user cũ
        return patientRepository.save(existing);
    }

    public void deletePatient(String patientId) {
        patientRepository.deleteById(patientId);
    }
//    public PatientResponse toResponse(Patient patient) {
//        return PatientResponse.builder()
//                .patientId(patient.getPatientId())
//                .fullName(patient.getFullName())
//                .gender(patient.getGender().name())
//                .dateOfBirth(patient.getDateOfBirth())
//                .address(patient.getAddress())
//                .district(patient.getDistrict())
//                .city(patient.getCity())
//                .insuranceNum(patient.getInsuranceNum())
//                .profileImg(patient.getProfileImg())
//                .coverImg(patient.getCoverImg())
////                .user(PatientResponse.UserInfo.builder()
////                        .userId(patient.getUser().getUserId())
////                        .email(patient.getUser().getEmail())
////                        .username(patient.getUser().getUsername())
////                        .role(patient.getUser().getRole().name())
////                        .provider(patient.getUser().getProvider().name())
////                        .build())
//                .build();
//    }
    public Optional<Patient> getParientByUserId (String userId){
        return patientRepository.findByUserId(userId);
    }


    public PatientResponse toResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setUserId(patient.getUserId());
        response.setPatientId(patient.getPatientId());
        response.setFullName(patient.getFullName());
        response.setGender(String.valueOf(patient.getGender()));
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setAddress(patient.getAddress());
        response.setDistrict(patient.getDistrict());
        response.setCity(patient.getCity());
        response.setInsuranceNum(patient.getInsuranceNum());
        response.setProfileImg(patient.getProfileImg());
        response.setCoverImg(patient.getCoverImg());
        return response;
    }
}

