package com.ssafy.smru.service;

import com.ssafy.smru.entity.app.PhoneVerification;
import com.ssafy.smru.repository.app.PhoneVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhoneVerificationService {

    private final PhoneVerificationRepository phoneVerificationRepository;

    public void generateAndSaveVerificationCode(String phoneNumber) {
        String verificationCode = generateVerificationCode();
        System.out.println(verificationCode);
        Optional<PhoneVerification> existingRecord = phoneVerificationRepository.findById(phoneNumber);
        if (existingRecord.isPresent()) {
            PhoneVerification phoneVerification = existingRecord.get();
            phoneVerification.changeVerificationNumber(verificationCode);
            phoneVerificationRepository.save(phoneVerification);
        } else {
            PhoneVerification phoneVerification = new PhoneVerification(phoneNumber, verificationCode);
            phoneVerificationRepository.save(phoneVerification);
        }
    }

    public boolean commonVerifyPhoneNumber(String phoneNumber, String verificationCode) {
        Optional<PhoneVerification> existingRecord = phoneVerificationRepository.findById(phoneNumber);

        if (existingRecord.isEmpty()) {
            throw new IllegalArgumentException("해당 휴대폰 번호로 등록된 인증번호가 없습니다.");
        }

        PhoneVerification phoneVerification = existingRecord.get();
        return phoneVerification.getVerificationNumber().equals(verificationCode);
    }

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
