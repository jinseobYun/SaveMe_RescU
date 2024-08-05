package com.ssafy.smru.controller;

import com.ssafy.smru.service.EmergencyRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/web/emergency-room")
@RequiredArgsConstructor
@Slf4j
public class EmergencyRoomController {
    private final EmergencyRoomService emergencyRoomService;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        log.info("api 테스트 요청 확인");
        try {
            emergencyRoomService.getEmergencyRoomData();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(null);
    }
}
