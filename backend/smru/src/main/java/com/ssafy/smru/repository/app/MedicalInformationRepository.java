// MedicalInformationRepository.java
package com.ssafy.smru.repository.app;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.app.MedicalInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalInformationRepository extends JpaRepository<MedicalInformation, Long> {

     Optional<MedicalInformation> findByAppMember(AppMember appMember);
}
