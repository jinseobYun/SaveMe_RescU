package com.ssafy.smru.controller;

import com.ssafy.smru.dto.WebMemberDto;
import com.ssafy.smru.dto.WebPasswordChangeDto;
import com.ssafy.smru.service.WebMemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/web/members")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(allowCredentials = "true", originPatterns = {"*"})
public class WebMemberController {
    private final WebMemberService webMemberService;
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody WebMemberDto.LoginRequest dto) {
        log.info("로그인 요청");
        try {
            return ResponseEntity.ok(webMemberService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return new ResponseEntity<>("로그아웃 했습니다", HttpStatus.OK);
    }
    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody WebMemberDto.Request dto) {
        try {
            int result =webMemberService.register(dto);
            if(result==1){
                return new ResponseEntity<>("중복된 ID 입니다.",HttpStatus.BAD_REQUEST);
            }
            return ResponseEntity.ok("회원가입에 성공했습니다!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }

    // 비밀번호 입력 했는지 확인
    // 현재 비밀번호가 DB에 등록된 정보와  맞는지 확인
    // 새비밀번호와 비밀번호 확인 번호가 일치하는지 확인
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody WebPasswordChangeDto.Request dto, HttpServletRequest request) {
        try {
            log.info("Headers: {}", Collections.list(request.getHeaderNames()).stream()
                    .collect(Collectors.toMap(h -> h, request::getHeader)));
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String memberId = authentication.getName();
            log.info("memberId : {}", memberId);
            webMemberService.changePassword(memberId, dto);
            return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그인된 유저 이름 반환
    @GetMapping("/extract-memberId")
    public ResponseEntity<?> extractUsername() {
            return new ResponseEntity<>(webMemberService.getMembername(),HttpStatus.OK);

    }


    // 전체 Member 조회
    @GetMapping("/member-list")
    public ResponseEntity<?> memberList(){
        List<WebMemberDto.Response> members = webMemberService.getAllMembers();
        return new ResponseEntity<>(members,HttpStatus.OK);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteMember(@PathVariable String memberId){
        try{
        webMemberService.deleteMember(memberId);

        return new ResponseEntity<>("삭제되었습니다",HttpStatus.OK);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("삭제에 실패했습니다");
        }
    }
}
