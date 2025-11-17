package com.healthcare.user_service.service;
import com.healthcare.user_service.dto.SpecialityDTO;
import com.healthcare.user_service.dto.SpecialityRequest;
import java.util.List;

public interface SpecialityService {
    SpecialityDTO createSpeciality(SpecialityRequest specialityRequest);
    SpecialityDTO getSpecialityById(String specialityId);
    SpecialityDTO getSpecialityByName(String name);
    List<SpecialityDTO> getAllSpecialities();
    List<SpecialityDTO> searchSpecialities(String keyword);
    SpecialityDTO updateSpecicality(String specialityId, SpecialityRequest specialityRequest);
    void deleteSpeciality(String specialityId);
    boolean existsByname(String name);
}
