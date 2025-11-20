package com.healthcare.user_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialityDTO {
    private String specialityId;
    private String name;
    private String description;
}
