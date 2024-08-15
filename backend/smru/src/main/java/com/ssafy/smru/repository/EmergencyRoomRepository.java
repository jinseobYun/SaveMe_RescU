package com.ssafy.smru.repository;

import com.ssafy.smru.entity.EmergencyRoom;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyRoomRepository extends CrudRepository<EmergencyRoom, String> {
}
