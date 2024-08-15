package com.ssafy.smru.dto.app;

import lombok.*;

public class PasswordResetDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String phoneNumber;
        private String verifyCode;
        private String newPassword;
        private String newPasswordConfirm;
        private String memberId;
        private String memberName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private boolean success;
        private String message;
    }
}
