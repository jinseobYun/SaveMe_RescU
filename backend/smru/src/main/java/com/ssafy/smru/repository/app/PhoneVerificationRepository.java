package com.ssafy.smru.repository.app;

import com.ssafy.smru.entity.app.PhoneVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhoneVerificationRepository extends JpaRepository<PhoneVerification, String> {
}
