package com.ssafy.smru.repository.app;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.app.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByAppMember_MemberId(String memberId);
    Optional<EmergencyContact> findByPhoneNumberAndAppMember(String phoneNumber, AppMember appMember);
}
