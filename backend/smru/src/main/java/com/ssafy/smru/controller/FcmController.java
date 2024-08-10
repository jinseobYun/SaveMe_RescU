package com.ssafy.smru.controller;

import com.ssafy.smru.dto.FcmRequestDto;
import com.ssafy.smru.util.FcmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fcm")
@RequiredArgsConstructor
@Slf4j
public class FcmController {
    private final FcmService fcmService;

    @PostMapping("/emergency-push")
    public ResponseEntity<?> pushMessageToEmergencyContacts(@RequestBody FcmRequestDto dto)  {
        log.info("FcmRequest : {}", dto);
        try {
            fcmService.sendEmergencyPush(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("푸시 알림 전송 실패");
        }
        return ResponseEntity.ok("푸시 알림 전송 완료");
    }

//    @PostMapping("/test")
//    public ResponseEntity<?> pushMessageTest(@RequestBody FcmRequestDto dto)  {
//        log.info("target : {}\n title : {}\nbody : {}", dto.getTargetToken(), dto.getTitle(), dto.getBody());
//        try {
//            fcmService.sendMessageTo(dto.getTargetToken(), dto.getTitle(), dto.getBody());
//        } catch (Exception e) {
//           e.printStackTrace();
//           return ResponseEntity.internalServerError().body("푸시 알림 전송 실패");
//        }
//        return ResponseEntity.ok("푸시 알림 전송 완료");
//    }
}
