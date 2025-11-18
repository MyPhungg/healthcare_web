package com.healthcare.user_service.service;
import com.healthcare.user_service.dto.DoctorDTO;
import com.healthcare.user_service.dto.DoctorRequest;
import java.util.List;
public interface DoctorService {
    DoctorDTO createDoctor(DoctorRequest doctorRequest);
    DoctorDTO getDoctorById(String doctorId);
    DoctorDTO getDoctorByUserId(String userId);
    List<DoctorDTO> getAllDoctors();
    List<DoctorDTO> getDoctorsBySpeciality(String specialityId);
    List<DoctorDTO> getDoctorsByCity(String city);
    List<DoctorDTO> searchDoctorsByName(String name);
    DoctorDTO updateDoctor(String doctorId, DoctorRequest doctorRequest);
    void deleteDoctor(String doctorId);
    boolean existsByUserId(String userId);
    String getUserIdByDoctorId(String doctorId);
}
