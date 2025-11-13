package com.healthcare.user_service.repository;
import com.healthcare.user_service.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.print.Doc;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String>{

    Optional<Doctor> findByDoctorId(String doctorId);
    Optional<Doctor> findByUserId(String userId);
    List<Doctor> findBySpecialityId(String specialityId);
    List<Doctor> findByCity(String city);

    List<Doctor> findByDistrict(String district);
    boolean existsByUserId(String userId);

    @Query("SELECT d FROM Doctor d WHERE d.fullName LIKE %:name%")
    List<Doctor> findByFullNameContaining(@Param("name") String name);



}
