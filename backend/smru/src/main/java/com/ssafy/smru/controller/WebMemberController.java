package com.ssafy.smru.controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.ssafy.smru.dto.WebMemberDto;
import com.ssafy.smru.service.WebMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/web/member")
@RequiredArgsConstructor
@Slf4j
public class WebMemberController {
    private final WebMemberService webMemberService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody WebMemberDto.LoginRequest dto) {
        log.info("로그인 요청");
        try {
            return ResponseEntity.ok(webMemberService.login(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody WebMemberDto.Request dto) {
        try {
            System.out.println(dto.getMemberId());
            return ResponseEntity.ok(webMemberService.register(dto));
        } catch (Exception e) {
//            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }
}
