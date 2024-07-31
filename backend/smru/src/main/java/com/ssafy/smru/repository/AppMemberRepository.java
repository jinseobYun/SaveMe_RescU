package com.ssafy.smru.repository;

import com.ssafy.smru.entity.AppMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppMemberRepository extends JpaRepository<AppMember, Long> {
    Optional<AppMember> findByMemberId(String memberId);
    Optional<AppMember> findByPhone(String phoneNumber);

}
