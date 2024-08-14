package com.ssafy.smru.repository;

import com.ssafy.smru.entity.DispatchOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public interface DispatchOrderRepository extends JpaRepository<DispatchOrder, Long> {
    // 작성자와 기간으로 필터링된 출동 지령을 조회하는 쿼리 메서드
    // null값이면 모든 d를 출력하게 설정
    @Query("SELECT d FROM DispatchOrder d WHERE " +
            "(:createdBy IS NULL OR d.createdBy LIKE %:createdBy%) AND " +
            "(:startDate IS NULL OR d.reportedTime >= :startDate) AND " +
            "(:endDate IS NULL OR d.reportedTime <= :endDate)")
    Page<DispatchOrder> findByCreatedByAndReportedTimeBetween(@Param("createdBy") String createdBy,
                                                              @Param("startDate") Timestamp startDate,
                                                              @Param("endDate") Timestamp endDate,
                                                              Pageable pageable);
}

