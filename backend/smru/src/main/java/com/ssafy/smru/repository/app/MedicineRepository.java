package com.ssafy.smru.repository.app;


import com.ssafy.smru.entity.app.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

// 약 table
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
}
