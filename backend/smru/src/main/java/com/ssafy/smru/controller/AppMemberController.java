package com.ssafy.smru.controller;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.app.AppMemberRegisterDto;
import com.ssafy.smru.dto.app.PasswordChangeDto;
import com.ssafy.smru.dto.app.PasswordResetDto;
import com.ssafy.smru.dto.app.PhoneVerificationDto;
import com.ssafy.smru.exception.ResourceConflictException;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.service.AppMemberService;
import com.ssafy.smru.service.app.PhoneVerificationService;
import com.ssafy.smru.util.RegularExpression;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/app/members")
@RequiredArgsConstructor
@Slf4j
public class AppMemberController {
    private final AppMemberService appMemberService;

    private final PhoneVerificationService phoneVerificationService;

    // 정규식 유틸 가져오기
    private final RegularExpression regularExpression = new RegularExpression();

    // 로그인 요청
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppMemberDto.Request dto) {

        if (dto.getMemberId() == null || dto.getMemberId().trim().equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이디 또는 비밀번호를 입력하세요");
        }

        if(dto.getPassword() == null || dto.getPassword().trim().equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이디 또는 비밀번호를 입력하세요");
        }

        // 아이디 정규식 검사
        if(!regularExpression.isId(dto.getMemberId())) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("올바르지 않은 형식의 데이터입니다.");
        }

        log.info("로그인 요청");

        try {
            return ResponseEntity.ok(appMemberService.login(dto));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }catch (ResponseStatusException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }catch (InternalAuthenticationServiceException e){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }

    // 회원가입 요청
    // 아이디, 휴대폰, 이름에 대한 정규식 검증
    // 비밀번호, 비밀번호 확인 검사
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppMemberRegisterDto.Request dto) {

        if(dto.getMemberId() == null || dto.getMemberId().trim().equals("")
                || dto.getPassword() == null || dto.getPassword().trim().equals("")
        || dto.getPhoneNumber() == null || dto.getPhoneNumber().trim().equals("")
        || dto.getPasswordConfirm() == null || dto.getPasswordConfirm().trim().equals("")
        || dto.getMemberName()==null || dto.getMemberName().trim().equals("")
        || dto.getBirth()==null ) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요.");
        }

        if(!regularExpression.isId(dto.getMemberId()) || !regularExpression.isPhone(dto.getPhoneNumber())
        || !regularExpression.isName(dto.getMemberName())) {
            return ResponseEntity.badRequest().body("올바르지 않은 형식의 데이터입니다.");
        }

        try {
            if (!dto.getPassword().equals(dto.getPasswordConfirm())) {
                return new ResponseEntity<String>("비밀번호가 일치하지 않습니다.",HttpStatus.BAD_REQUEST);
            }

            appMemberService.register(dto);

            return ResponseEntity.ok("회원가입 성공!");
        } catch (ResourceConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버에서 오류 발생");
        }
    }

    // 아이디 중복확인 요청
    @PostMapping("/id-validate")
    public ResponseEntity<?> idValidate(@RequestBody AppMemberRegisterDto.Request dto) {
        if(dto.getMemberId() == null || dto.getMemberId().trim().equals("")) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요");
        }
        boolean result = appMemberService.checkMemberIdDuplicate(dto.getMemberId());
        return ResponseEntity.ok(result);
    }

    // 휴대폰 인증번호 생성 요청
    @PostMapping("/phone-verify-code-req")
    public ResponseEntity<?> registerPhoneVerificationCode(@RequestBody PhoneVerificationDto.Request request) {

        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("휴대폰 번호를 입력하세요");
        }
        if (!regularExpression.isPhone(request.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("올바르지 않은 형식의 데이터입니다.");
        }



        PhoneVerificationDto.Response response = phoneVerificationService.generateAndSaveVerificationCode(request);
// -------------------------------실제 휴대폰 문자 보내는 매서드 -----------------------------------
//            // 휴대폰 번호로 문자 보내는 메서드 작성
//        try {
//            SingleMessageSentResponse result = phoneVerificationService.sendVerificationCode(response.getPhoneNumber(),response.getVerifyCode());
//
//        }catch (Exception e){
//            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("인증번호 발송 오류");
//        }
// -----------------------------------------------------------------------------------------------


        // 테스트를 위해 프론트로 리스폰스 넘기기
        return ResponseEntity.ok().body(response.getVerifyCode());
    }


    // 회원가입시 휴대폰 인증 번호 확인 요청
    @PostMapping("/phone-verify-code-check")
    public ResponseEntity<?> verifyPhoneNumber(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요.");
        }
        if (!regularExpression.isNumber(request.getVerifyCode()) || !regularExpression.isPhone(request.getPhoneNumber())) {
            return new ResponseEntity<>("올바르지 않은 형식의 데이터입니다.", HttpStatus.BAD_REQUEST);
        }
        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                // 인증 완료 되었으므로 인증번호테이블에서 값 삭제
                phoneVerificationService.deleteVerificationCode(request.getPhoneNumber());
                return ResponseEntity.ok().body("인증번호 일치");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않습니다.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 아이디 찾기에서 인증번호 확인 요청
    @PostMapping("/phone-verify-code-id-check")
    public ResponseEntity<?> verifyPhoneAndGetMemberId(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요.");
        }
        if (!regularExpression.isNumber(request.getVerifyCode()) || !regularExpression.isPhone(request.getPhoneNumber())) {
            return new ResponseEntity<>("올바르지 않은 형식의 데이터입니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                AppMemberDto.Response member = appMemberService.getMemberByPhoneNumberAndMemberName(request.getPhoneNumber(), request.getMemberName());

                // 인증 완료 되었으므로 인증번호테이블에서 값 삭제
                phoneVerificationService.deleteVerificationCode(request.getPhoneNumber());
                return ResponseEntity.ok().body(member.getMemberId());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않습니다.");
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Pw 찾기시 인증번호 확인 요청
    @PostMapping("/phone-verify-code-pw-check")
    public ResponseEntity<?> verifyPhoneAndPassword(@RequestBody PhoneVerificationDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty() ||
                request.getMemberId() == null || request.getMemberId().trim().isEmpty() ||
                request.getMemberName() == null || request.getMemberName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요.");
        }
        if (!regularExpression.isNumber(request.getVerifyCode()) || !regularExpression.isPhone(request.getPhoneNumber())
                || !regularExpression.isId(request.getMemberId())) {
            return new ResponseEntity<>("올바르지 않은 형식의 데이터입니다.", HttpStatus.BAD_REQUEST);
        }
        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {
                AppMemberDto.Response member = appMemberService.getMemberByPhoneNumberAndMemberIdAndMemberName(request.getPhoneNumber(), request.getMemberId(), request.getMemberName());

                return ResponseEntity.ok().body(true);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않습니다.");
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // PW 찾기에서 휴대폰 인증 후  pw 변경 페이지에서의 pw 변경 요청
    @PutMapping("/password-not-login")
    public ResponseEntity<?> resetPasswordNotLogin(@RequestBody PasswordResetDto.Request request) {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty() ||
                request.getVerifyCode() == null || request.getVerifyCode().trim().isEmpty() ||
                request.getNewPassword() == null || request.getNewPassword().trim().isEmpty() ||
                request.getNewPasswordConfirm() == null || request.getNewPasswordConfirm().trim().isEmpty() ||
                request.getMemberId() == null || request.getMemberId().trim().isEmpty() ||
                request.getMemberName() == null || request.getMemberName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요.");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            return ResponseEntity.unprocessableEntity().body("새 비밀번호가 일치하지 않습니다.");
        }

        try {
            boolean isValid = phoneVerificationService.commonVerifyPhoneNumber(request.getPhoneNumber(), request.getVerifyCode());
            if (isValid) {

                AppMemberDto.Response member = appMemberService.getMemberByPhoneNumberAndMemberIdAndMemberName(request.getPhoneNumber(),request.getMemberId(),request.getMemberName());
                appMemberService.updatePassword(member.getMemberId(), request.getNewPassword());
                // 인증 성공 후 비밀번호 변경이 끝났으므로
                // 인증번호 테이블에서 정보 삭제
                phoneVerificationService.deleteVerificationCode(request.getPhoneNumber());
                return ResponseEntity.ok().body("성공적으로 비밀번호를 변경했습니다!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않습니다.");
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 로그인 후 내 정보에서 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDto.Request request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty() ||
                request.getNewPassword() == null || request.getNewPassword().trim().isEmpty() ||
                request.getNewPasswordConfirm() == null || request.getNewPasswordConfirm().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("입력값을 확인하세요");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            return ResponseEntity.badRequest().body("새 비밀번호가 일치하지 않습니다.");
        }
        if (!appMemberService.checkPasswordMatchMemberId(currentUserName, request.getCurrentPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("현재 비밀번호가 일치하지 않습니다.");
        }

        try {
            appMemberService.updatePassword(currentUserName, request.getNewPassword());
            return ResponseEntity.ok().body("true");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/phone")
    public ResponseEntity<?> updatePhoneNumber(@RequestBody Map<String,String> req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        String phone = req.get("phoneNumber");
        if (phone == null || phone.trim().isEmpty()) {
            return new ResponseEntity<>("변경할 휴대폰 번호를 입력하세요.", HttpStatus.BAD_REQUEST);
        }
        if (!regularExpression.isPhone(phone)){
            return new ResponseEntity<>("올바르지 않은 형식의 데이터입니다.",HttpStatus.BAD_REQUEST);
        }
        System.out.println(phone);

        try {
            appMemberService.updatePhoneNumber(currentUserName, phone);
            return ResponseEntity.ok().body("휴대폰 번호 변경에 성공했습니다");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (ResourceConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

    }




}
