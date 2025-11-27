package com.healthcare.user_service.service.impl;

import com.healthcare.user_service.common.CodeGeneratorUtils;
import com.healthcare.user_service.dto.DoctorDTO;
import com.healthcare.user_service.dto.DoctorRequest;
import com.healthcare.user_service.entity.Doctor;
import com.healthcare.user_service.entity.Gender;
import com.healthcare.user_service.repository.DoctorRepository;
import com.healthcare.user_service.service.DoctorService;
import com.healthcare.user_service.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final FileStorageService fileStorageService;
    @Override
    public DoctorDTO createDoctor(String userId,
                                  String fullName,
                                  String gender,
                                  LocalDate dateOfBirth,
                                  String address,
                                  String district,
                                  String city,
                                  String specialityId,
                                  String clinicName,
                                  String clinicDescription,
                                  String bio,
                                  MultipartFile profileImg,
                                  MultipartFile coverImg) {
        // Check if doctor already exists for this user
        try {
            if (doctorRepository.existsByUserId(userId)) {
                throw new RuntimeException("Doctor already exists for this user");
            }

            Doctor doctor = new Doctor();
            doctor.setDoctorId(CodeGeneratorUtils.generateCode("doc"));
            doctor.setUserId(userId);
            doctor.setFullName(fullName);
            try {
                doctor.setGender(Gender.valueOf(gender.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid gender value: " + gender + "Must be MALE or FEMALE");
            }
            doctor.setDateOfBirth(dateOfBirth);
            doctor.setAddress(address);
            doctor.setDistrict(district);
            doctor.setCity(city);
            doctor.setSpecialityId(specialityId);
            doctor.setClinicName(clinicName);
            doctor.setClinicDescription(clinicDescription);
            doctor.setBio(bio);
            if(profileImg != null && !profileImg.isEmpty()){
                String profileUrl = fileStorageService.save(profileImg);
                doctor.setProfileImg(profileUrl);
            }

            if(coverImg != null && !coverImg.isEmpty()){
                String coverUrl = fileStorageService.save(coverImg);
                doctor.setCoverImg(coverUrl);
            }

            Doctor savedDoctor = doctorRepository.save(doctor);
            return convertToDTO(savedDoctor);
        } catch (Exception e) {
            throw new RuntimeException("Error creating doctor: " + e.getMessage(), e);
        }
    }

    @Override
    public DoctorDTO getDoctorById(String doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        return convertToDTO(doctor);
    }

    @Override
    public DoctorDTO getDoctorByUserId(String userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for user id: " + userId));
        return convertToDTO(doctor);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> getDoctorsBySpeciality(String specialityId) {
        return doctorRepository.findBySpecialityId(specialityId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> getDoctorsByCity(String city) {
        return doctorRepository.findByCity(city).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> searchDoctorsByName(String name) {
        return doctorRepository.findByFullNameContaining(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO updateDoctor(String doctorId,
                                  String fullName,
                                  String gender,
                                  LocalDate dateOfBirth,
                                  String address,
                                  String district,
                                  String city,
                                  String specialityId,
                                  String clinicName,
                                  String clinicDescription,
                                  String bio,
                                  MultipartFile profileImg,
                                  MultipartFile coverImg) {
        Doctor existingDoctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        existingDoctor.setFullName(fullName);
        try {
            existingDoctor.setGender(Gender.valueOf(gender.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid gender value: " + gender + "Must be MALE or FEMALE");
        }
        existingDoctor.setDateOfBirth(dateOfBirth);
        existingDoctor.setAddress(address);
        existingDoctor.setDistrict(district);
        existingDoctor.setCity(city);
        existingDoctor.setSpecialityId(specialityId);
        existingDoctor.setClinicName(clinicName);
        existingDoctor.setClinicDescription(clinicDescription);
        existingDoctor.setBio(bio);
        if(profileImg != null && !profileImg.isEmpty()){
            String profileUrl = fileStorageService.save(profileImg);
            existingDoctor.setProfileImg(profileUrl);
        }

        if(coverImg != null && !coverImg.isEmpty()){
            String coverUrl = fileStorageService.save(coverImg);
            existingDoctor.setCoverImg(coverUrl);
        }


        Doctor updatedDoctor = doctorRepository.save(existingDoctor);
        return convertToDTO(updatedDoctor);
    }

    @Override
    public void deleteDoctor(String doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doctor not found with id: " + doctorId);
        }
        doctorRepository.deleteById(doctorId);
    }

    @Override
    public boolean existsByUserId(String userId) {
        return doctorRepository.existsByUserId(userId);
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorId(doctor.getDoctorId());
        dto.setUserId(doctor.getUserId());
        dto.setFullName(doctor.getFullName());
        dto.setGender(doctor.getGender().name());
        dto.setDateOfBirth(doctor.getDateOfBirth());
        dto.setAddress(doctor.getAddress());
        dto.setDistrict(doctor.getDistrict());
        dto.setCity(doctor.getCity());
        dto.setSpecialityId(doctor.getSpecialityId());
        dto.setClinicName(doctor.getClinicName());
        dto.setClinicDescription(doctor.getClinicDescription());
        dto.setBio(doctor.getBio());
        dto.setProfileImg(doctor.getProfileImg());
        dto.setCoverImg(doctor.getCoverImg());
        return dto;
    }

//    private String generateDoctorId() {
//        return "doc" + UUID.randomUUID().toString().substring(0, 8);
//    }
    @Override
    public String getUserIdByDoctorId(String doctorId){
        String userId = doctorRepository.findUserIdByDoctorId(doctorId);
        System.out.println("Type of userId: " + userId.getClass().getName());
        System.out.println("Value of userId: " + userId);
        log.info("Type of userId: "+ userId.getClass().getName());
        log.info("Value of userId: " + userId);
        return userId;    }

}