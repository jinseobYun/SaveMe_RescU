package com.ssafy.smru.repository;

import com.ssafy.smru.entity.DispatchOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DispatchOrderRepository extends JpaRepository<DispatchOrder, Long> {
}
