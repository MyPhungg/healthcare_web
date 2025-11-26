package com.healthcare.user_service.service;
import com.healthcare.user_service.dto.DoctorDTO;
import com.healthcare.user_service.dto.DoctorRequest;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
public interface DoctorService {
    DoctorDTO createDoctor(String userId,
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
                           MultipartFile coverImg);
    DoctorDTO getDoctorById(String doctorId);
    DoctorDTO getDoctorByUserId(String userId);
    List<DoctorDTO> getAllDoctors();
    List<DoctorDTO> getDoctorsBySpeciality(String specialityId);
    List<DoctorDTO> getDoctorsByCity(String city);
    List<DoctorDTO> searchDoctorsByName(String name);
    DoctorDTO updateDoctor(String doctorId,
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
                           MultipartFile coverImg);
    void deleteDoctor(String doctorId);
    boolean existsByUserId(String userId);
    String getUserIdByDoctorId(String doctorId);
}
