package com.ssafy.smru.controller;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.service.AppMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    @PostMapping("")
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
}
