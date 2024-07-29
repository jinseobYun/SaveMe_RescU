package com.ssafy.smru.repository;

import com.ssafy.smru.entity.WebMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebMemberRepository extends JpaRepository<WebMember, Long> {
    Optional<WebMember> findByMemberId(String memberId);
}
