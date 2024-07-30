package com.ssafy.smru.controller;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.app.PhoneVerificationDto;
import com.ssafy.smru.service.AppMemberService;
import com.ssafy.smru.service.PhoneVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/app/members")
@RequiredArgsConstructor
@Slf4j
public class AppMemberController {
    private final AppMemberService appMemberService;

    private final PhoneVerificationService phoneVerificationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppMemberDto.Request dto) {
        log.info("로그인 요청");
        try {
            return ResponseEntity.ok(appMemberService.login(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppMemberDto.Request dto) {
        try {
            return ResponseEntity.ok(appMemberService.register(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }

    @PostMapping("/id-validate")
    public ResponseEntity<?> idValidate(@RequestBody AppMemberDto.Request dto) {
        if(dto.getMemberId() == null || dto.getMemberId().trim().equals("")) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요");
        }
        boolean result = appMemberService.idConfirm(dto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/phone-verify-code-reg")
    public ResponseEntity<?> registerPhoneVerificationCode(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("휴대폰 번호를 입력하세요");
        }

        phoneVerificationService.generateAndSaveVerificationCode(request.getPhoneNumber());
        return ResponseEntity.ok().body("OK");
    }
    @PostMapping("/phone-verify")
    public ResponseEntity<?> verifyPhoneNumber(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("휴대폰 번호와 인증번호를 입력하세요");
        }

        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                return ResponseEntity.ok().body("OK");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증번호가 틀렸습니다.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
