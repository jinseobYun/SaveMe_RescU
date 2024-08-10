package com.ssafy.smru.repository;

import com.ssafy.smru.entity.AppMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppMemberRepository extends JpaRepository<AppMember, Long> {
    Optional<AppMember> findByMemberId(String memberId);
    Optional<AppMember> findByPhoneNumber(String phoneNumber);
    Optional<Long> findMedicalInformationIdByMemberId(String memberId);
    Optional<AppMember> findByPhoneNumberAndMemberIdAndMemberName(String phoneNumber, String memberId, String MemberName);
    Optional<AppMember> findByPhoneNumberAndMemberName(String phoneNumber, String memberName);

    List<AppMember> findAllByPhoneNumberIn(List<String> phoneNumberList);
}
