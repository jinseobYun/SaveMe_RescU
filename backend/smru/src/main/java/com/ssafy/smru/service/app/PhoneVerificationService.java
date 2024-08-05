package com.ssafy.smru.service.app;

import com.ssafy.smru.dto.app.PhoneVerificationDto;
import com.ssafy.smru.entity.app.PhoneVerification;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.repository.app.PhoneVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhoneVerificationService {

    private final PhoneVerificationRepository phoneVerificationRepository;

    // 인증번호 생성 후 저장하는 매서드
    public PhoneVerificationDto.Response generateAndSaveVerificationCode(PhoneVerificationDto.Request request) {
        // 인증번호 6자리 생성
        String verificationCode = generateVerificationCode();
        // 전화번호를 아이디로 하는 인증번호 테이블에서
        // 인증번호가 있는지 확인
        Optional<PhoneVerification> existingRecord = phoneVerificationRepository.findById(request.getPhoneNumber());
        if (existingRecord.isPresent()) {
            // 있다면 새로운 인증번호와 만료 시간으로 수정 후 저장
            PhoneVerification phoneVerification = existingRecord.get();
            phoneVerification.changeVerificationNumber(verificationCode);
            System.out.println(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
            phoneVerification.changeExpirationTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")).plusMinutes(10));
            return PhoneVerificationDto.Response.fromEntity(phoneVerificationRepository.save(phoneVerification));
        } else {
            // 없다면 휴대폰 번호, 인증번호와 만료 시간 저장
            request.setVerifyCode(verificationCode);
            return PhoneVerificationDto.Response.fromEntity(phoneVerificationRepository.save(request.toEntity()));
        }
    }

    // [공통] 인증 번호 확인
    public boolean commonVerifyPhoneNumber(String phoneNumber, String verificationCode) {
        Optional<PhoneVerification> existingRecord = phoneVerificationRepository.findById(phoneNumber);

        if (existingRecord.isEmpty()) {
            throw new IllegalArgumentException("입력한 휴대폰 번호로 요청한 인증번호가 없습니다.");
        }

        PhoneVerification phoneVerification = existingRecord.get();
        if (phoneVerification.getExpirationTime().isBefore(LocalDateTime.now())) {
            deleteVerificationCode(phoneVerification.getPhoneNumber());
            throw new UnauthorizedException("인증번호가 만료되었습니다.");
        }

        return phoneVerification.getVerificationNumber().equals(verificationCode);



    }

    // 인증번호 만들기
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // 휴대폰 번호로 인증번호 삭제
    // 인증번호 삭제
    public void deleteVerificationCode(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("입력값을 확인하세요.");
        }

        Optional<PhoneVerification> existingRecord = phoneVerificationRepository.findById(phoneNumber);

        if (existingRecord.isEmpty()) {
            throw new IllegalArgumentException("인증 번호가 존재하지 않습니다.");
        }

        phoneVerificationRepository.deleteById(phoneNumber);
    }




}
