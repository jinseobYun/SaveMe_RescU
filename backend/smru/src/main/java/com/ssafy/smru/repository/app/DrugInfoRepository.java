// DrugInfoRepository.java
package com.ssafy.smru.repository.app;

import com.ssafy.smru.entity.app.DrugInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DrugInfoRepository extends JpaRepository<DrugInfo, Long> {
}
