package com.healthcare.user_service.service.impl;

import com.healthcare.user_service.dto.DoctorDTO;
import com.healthcare.user_service.dto.DoctorRequest;
import com.healthcare.user_service.entity.Doctor;
import com.healthcare.user_service.entity.Gender;
import com.healthcare.user_service.repository.DoctorRepository;
import com.healthcare.user_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public DoctorDTO createDoctor(DoctorRequest doctorRequest) {
        // Check if doctor already exists for this user
        try {
            if (doctorRepository.existsByUserId(doctorRequest.getUserId())) {
                throw new RuntimeException("Doctor already exists for this user");
            }

            Doctor doctor = new Doctor();
            doctor.setDoctorId(generateDoctorId());
            doctor.setUserId(doctorRequest.getUserId());
            doctor.setFullName(doctorRequest.getFullName());
            try {
                doctor.setGender(Gender.valueOf(doctorRequest.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid gender value: " + doctorRequest.getGender() + "Must be MALE or FEMALE");
            }
            doctor.setDateOfBirth(doctorRequest.getDateOfBirth());
            doctor.setAddress(doctorRequest.getAddress());
            doctor.setDistrict(doctorRequest.getDistrict());
            doctor.setCity(doctorRequest.getCity());
            doctor.setSpecialityId(doctorRequest.getSpecialityId());
            doctor.setClinicName(doctorRequest.getClinicName());
            doctor.setClinicDescription(doctorRequest.getClinicDescription());
            doctor.setBio(doctorRequest.getBio());
            doctor.setProfileImg(doctorRequest.getProfileImg());
            doctor.setCoverImg(doctorRequest.getCoverImg());

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
    public DoctorDTO updateDoctor(String doctorId, DoctorRequest doctorRequest) {
        Doctor existingDoctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        existingDoctor.setFullName(doctorRequest.getFullName());
        try {
            existingDoctor.setGender(Gender.valueOf(doctorRequest.getGender().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid gender value: " + doctorRequest.getGender());
        }
        existingDoctor.setDateOfBirth(doctorRequest.getDateOfBirth());
        existingDoctor.setAddress(doctorRequest.getAddress());
        existingDoctor.setDistrict(doctorRequest.getDistrict());
        existingDoctor.setCity(doctorRequest.getCity());
        existingDoctor.setSpecialityId(doctorRequest.getSpecialityId());
        existingDoctor.setClinicName(doctorRequest.getClinicName());
        existingDoctor.setClinicDescription(doctorRequest.getClinicDescription());
        existingDoctor.setBio(doctorRequest.getBio());
        existingDoctor.setProfileImg(doctorRequest.getProfileImg());
        existingDoctor.setCoverImg(doctorRequest.getCoverImg());

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

    private String generateDoctorId() {
        return "doc" + UUID.randomUUID().toString().substring(0, 8);
    }
    @Override
    public String getUserIdByDoctorId(String doctorId){
        String userId = doctorRepository.findUserIdByDoctorId(doctorId);
        System.out.println("Type of userId: " + userId.getClass().getName());
        System.out.println("Value of userId: " + userId);
        log.info("Type of userId: "+ userId.getClass().getName());
        log.info("Value of userId: " + userId);
        return userId;    }

}