package com.ssafy.smru.controller;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.app.PasswordChangeDto;
import com.ssafy.smru.dto.app.PasswordResetDto;
import com.ssafy.smru.dto.app.PhoneVerificationDto;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.service.AppMemberService;
import com.ssafy.smru.service.PhoneVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/app/members")
@RequiredArgsConstructor
@Slf4j
public class AppMemberController {
    private final AppMemberService appMemberService;

    private final PhoneVerificationService phoneVerificationService;

    // 로그인 요청
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

    // 회원가입 요청
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppMemberDto.Request dto) {
        try {
            return ResponseEntity.ok(appMemberService.register(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }

    // 아이디 중복확인 요청
    @PostMapping("/id-validate")
    public ResponseEntity<?> idValidate(@RequestBody AppMemberDto.Request dto) {
        if(dto.getMemberId() == null || dto.getMemberId().trim().equals("")) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요");
        }
        boolean result = appMemberService.idConfirm(dto);
        return ResponseEntity.ok(result);
    }

    // 휴대폰 인증번호 생성 요청
    @PostMapping("/phone-verify-code-reg")
    public ResponseEntity<?> registerPhoneVerificationCode(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("휴대폰 번호를 입력하세요");
        }

        PhoneVerificationDto.Response response = phoneVerificationService.generateAndSaveVerificationCode(request);

        // 휴대폰 번호로 문자 보내는 메서드 작성



        return ResponseEntity.ok().body("OK");
    }


    // 회원가입시 휴대폰 인증 번호 확인 요청
    @PostMapping("/phone-verify")
    public ResponseEntity<?> verifyPhoneNumber(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("휴대폰 번호와 인증번호를 입력하세요");
        }
        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                // 인증 완료 되었으므로 인증번호테이블에서 값 삭제
                phoneVerificationService.deleteVerificationCode(request.getPhoneNumber());
                return ResponseEntity.ok().body("인증번호 일치");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증번호가 틀렸습니다.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 아이디 찾기에서 인증번호 확인 요청
    @PostMapping("/phone-verify-code-id-confirm")
    public ResponseEntity<?> verifyPhoneAndGetMemberId(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("휴대폰 번호와 인증번호를 입력하세요");
        }

        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                AppMemberDto.Response member = appMemberService.getMemberByPhoneNumber(request.getPhoneNumber());
                if (!member.getMemberName().equals(request.getMemberName())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("회원 정보가 일치하지 않습니다.");
                }
                // 인증 완료 되었으므로 인증번호테이블에서 값 삭제
                phoneVerificationService.deleteVerificationCode(request.getPhoneNumber());
                return ResponseEntity.ok().body(member.getMemberId());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증번호가 틀렸습니다.");
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Pw 찾기시 인증번호 확인 요청
    @PostMapping("/phone-verify-code-pw-confirm")
    public ResponseEntity<?> verifyPhoneAndPassword(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty() ||
                request.getMemberId() == null || request.getMemberId().trim().isEmpty() ||
                request.getMemberName() == null || request.getMemberName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("모든 필드를 입력하세요");
        }

        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                AppMemberDto.Response member = appMemberService.getMemberByPhoneNumber(request.getPhoneNumber());
                if (!member.getMemberName().equals(request.getMemberName()) || !member.getMemberId().equals(request.getMemberId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("회원 정보가 일치하지 않습니다.");
                }
                return ResponseEntity.ok().body(true);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증번호가 틀렸습니다.");
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // PW 찾기에서 휴대폰 인증 후  pw 변경 페이지에서의 pw 변경 요청
    @PostMapping("/password-not-login")
    public ResponseEntity<?> resetPasswordNotLogin(@RequestBody PasswordResetDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty() ||
                request.getNewPassword() == null || request.getNewPassword().trim().isEmpty() ||
                request.getNewPasswordConfirm() == null || request.getNewPasswordConfirm().trim().isEmpty() ||
                request.getMemberId() == null || request.getMemberId().trim().isEmpty() ||
                request.getMemberName() == null || request.getMemberName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("모든 필드를 입력하세요");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            return ResponseEntity.unprocessableEntity().body("새 비밀번호가 일치하지 않습니다.");
        }

        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                AppMemberDto.Response member = appMemberService.getMemberByPhoneNumber(request.getPhoneNumber());
                if (!member.getMemberName().equals(request.getMemberName()) || !member.getMemberId().equals(request.getMemberId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("회원 정보가 일치하지 않습니다.");
                }
                appMemberService.updatePassword(member.getAppMemberId(), request.getNewPassword());
                // 인증 성공 후 비밀번호 변경이 끝났으므로
                // 인증번호 테이블에서 정보 삭제
                phoneVerificationService.deleteVerificationCode(request.getPhoneNumber());
                return ResponseEntity.ok().body("성공적으로 비밀번호를 변경했습니다!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증번호가 틀렸습니다.");
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDto.Request request, HttpServletRequest httpServletRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        System.out.println(currentUserName);
        if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty() ||
                request.getNewPassword() == null || request.getNewPassword().trim().isEmpty() ||
                request.getNewPasswordConfirm() == null || request.getNewPasswordConfirm().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("모든 필드를 입력하세요");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            return ResponseEntity.badRequest().body("새 비밀번호가 일치하지 않습니다.");
        }

        try {
            AppMemberDto.Response member = appMemberService.getMemberByMemberId(currentUserName);
            if (!appMemberService.checkPassword(member.getAppMemberId(), request.getCurrentPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 일치하지 않습니다.");
            }
            appMemberService.updatePassword(member.getAppMemberId(), request.getNewPassword());
            return ResponseEntity.ok().body("true");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
