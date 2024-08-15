package com.ssafy.smru.repository;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.PushNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FcmRepository extends JpaRepository<PushNotification, Integer> {
    List<PushNotification> findAllByAppMember(AppMember appMember);
}
