// MedCdiRepository.java
package com.ssafy.smru.repository.app;

import com.ssafy.smru.entity.app.MedCdi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedCdiRepository extends JpaRepository<MedCdi, Long> {
}
