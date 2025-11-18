package com.healthcare.user_service.repository;

import com.healthcare.user_service.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByUser_UserId(String userId);
}

