package com.ssafy.smru.repository;

import com.ssafy.smru.entity.DutyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 병원 정보 불러오는 레퍼지토리
@Repository
public interface DutyInfoRepository extends JpaRepository<DutyInfo, Integer> {
    List<DutyInfo> findAll();
}
