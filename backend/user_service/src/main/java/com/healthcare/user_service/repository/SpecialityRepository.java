package com.healthcare.user_service.repository;

import com.healthcare.user_service.entity.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialityRepository extends JpaRepository<Speciality, String>{
    Optional<Speciality> findByName(String name);

    @Query("SELECT s FROM Speciality s WHERE s.name LIKE %:keyword% OR s.description LIKE %:keyword%")
    List<Speciality> searchByNameOrDescription(@Param("keyword") String keyword);
    boolean existsByName(String name);
}
