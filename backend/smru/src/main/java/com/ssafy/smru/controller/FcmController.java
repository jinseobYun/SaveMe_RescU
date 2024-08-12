package com.ssafy.smru.controller;

import com.ssafy.smru.dto.FcmRequestDto;
import com.ssafy.smru.service.FcmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.webjars.NotFoundException;

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

    @GetMapping("/push-notification/{memberId}")
    public ResponseEntity<?> pushNotificationList(@PathVariable("memberId") String memberId) {
        try {
            return ResponseEntity.ok(fcmService.getPushNotificationList(memberId));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버에서 예상치 못한 오류가 발생했습니다.");
        }
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
