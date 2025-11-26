package com.healthcare.chatbot_service.feign;

import com.healthcare.chatbot_service.feign.dto.DoctorDTO;
import com.healthcare.chatbot_service.feign.dto.PatientResponse;
import com.healthcare.chatbot_service.feign.dto.SpecialityDTO;
import com.healthcare.chatbot_service.feign.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/{id}")
    UserResponse getUserById(@PathVariable("id") String id);

    @GetMapping("/api/doctors/{doctorId}")
    DoctorDTO getDoctorById(
            @PathVariable("doctorId") String doctorId
//            @RequestHeader("Authorization") String token  // <-- truyền token
    );
    @GetMapping("/api/doctors/userId/{doctorId}")
    String getUserIdByDoctorId(
            @PathVariable("doctorId") String doctorId
//            @RequestHeader("Authorization") String token  // <-- truyền token
    );
    @GetMapping("/api/doctors/speciality")
    List<DoctorDTO> getDoctorBySpeciality(@RequestParam String specialityId, @RequestParam LocalDate date);

    @GetMapping("/api/patients/{id}")
    PatientResponse getById(@PathVariable String id) ;

    @GetMapping("/api/specialities/{specialityId}")
    public SpecialityDTO getSpecialityById(@PathVariable String specialityId);

//    @GetMapping("/patients/user/{userId}")
//    Object getPatientByUserId(@PathVariable String userId);
//
//    @GetMapping("/doctors")
//    List<Object> getAllDoctors();
//
//    @GetMapping("/specialities")
//    List<Object> getAllSpecialities();
}
