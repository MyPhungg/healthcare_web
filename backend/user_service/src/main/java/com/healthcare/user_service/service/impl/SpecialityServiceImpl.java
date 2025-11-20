package com.healthcare.user_service.service.impl;

import com.healthcare.user_service.dto.SpecialityDTO;
import com.healthcare.user_service.dto.SpecialityRequest;
import com.healthcare.user_service.entity.Speciality;
import com.healthcare.user_service.repository.SpecialityRepository;
import com.healthcare.user_service.service.SpecialityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialityServiceImpl implements SpecialityService {
    private final SpecialityRepository specialityRepository;

    @Override
    public SpecialityDTO createSpeciality(SpecialityRequest specialityRequest)
    {
        //Kiem tra ten chuyen khoa da ton tai hay chua
        if(specialityRepository.existsByName(specialityRequest.getName()))
        {
            throw new RuntimeException("Tên chuyên khoa đã tồn tại: "+ specialityRequest.getName());
        }
        Speciality speciality = new Speciality();
        speciality.setSpecialityId(generateSpecialityId());
        speciality.setName((specialityRequest.getName()));
        speciality.setDescription(specialityRequest.getDescription());

        Speciality savedSpeciality = specialityRepository.save(speciality);
        return convertToDTO(savedSpeciality);
    }

    @Override
    public SpecialityDTO getSpecialityById(String specialityId) {
        Speciality speciality = specialityRepository.findById(specialityId)
                .orElseThrow(() -> new RuntimeException("Speciality not found with id: " + specialityId));
        return convertToDTO(speciality);
    }

    @Override
    public SpecialityDTO getSpecialityByName(String name)
    {
        Speciality speciality = specialityRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Không thể tìm thấy chuyên khoa tên: " + name));
        return convertToDTO(speciality);
    }

    @Override
    public List<SpecialityDTO> getAllSpecialities()
    {
        return specialityRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpecialityDTO> searchSpecialities(String keyword) {
        return List.of();
    }

    @Override
    public SpecialityDTO updateSpecicality(String specialityId, SpecialityRequest specialityRequest)
    {
        Speciality existingSpeciality = specialityRepository.findById(specialityId)
                .orElseThrow(() -> new RuntimeException("Không thể tìm thấy chuyên khoa với ID: " + specialityId));

        //Kiểm tra nếu tên trùng với tên chuyên khoa khác
        if(!existingSpeciality.getName().equals(specialityRequest.getName()) && specialityRepository.existsByName(specialityRequest.getName()))
        {
            throw new RuntimeException("Tên chuyên khoa đã tồn tại: "+ specialityRequest.getName());
        }

        existingSpeciality.setName(specialityRequest.getName());
        existingSpeciality.setDescription(specialityRequest.getDescription());

        Speciality updatedSpeciality = specialityRepository.save(existingSpeciality);
        return convertToDTO(updatedSpeciality);
    }

    @Override
    public void deleteSpeciality(String specialityId)
    {
        if(!specialityRepository.existsById(specialityId))
        {
            throw new RuntimeException("Không thể tỉm thấy id: "+ specialityId);
        }
        specialityRepository.deleteById(specialityId);
    }

    @Override
    public boolean existsByname(String name)
    {
        return specialityRepository.existsByName(name);
    }

    private SpecialityDTO convertToDTO(Speciality speciality)
    {
        SpecialityDTO dto = new SpecialityDTO();
        dto.setSpecialityId(speciality.getSpecialityId());
        dto.setName(speciality.getName());
        dto.setDescription(speciality.getDescription());
        return dto;
    }

    private String generateSpecialityId()
    {
        return "spe"+UUID.randomUUID().toString().substring(0,8).toLowerCase();
    }

}
