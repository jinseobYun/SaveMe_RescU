package com.ssafy.smru.dto.app;

import com.ssafy.smru.entity.app.PhoneVerification;
import lombok.*;

import java.time.LocalDateTime;

public class PhoneVerificationDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String memberName;
        private String phoneNumber;
        private String verifyCode;
        private String memberId;

        public PhoneVerification toEntity() {
            return PhoneVerification.builder()
                    .phoneNumber(this.phoneNumber)
                    .verificationNumber(this.verifyCode)
                    .expirationTime(LocalDateTime.now().plusMinutes(3))
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String phoneNumber;
        private String verifyCode;

        public static Response fromEntity(PhoneVerification verification) {
            return Response.builder()
                    .phoneNumber(verification.getPhoneNumber())
                    .verifyCode(verification.getVerificationNumber())
                    .build();
        }
    }
}
