package com.ssafy.smru.dto.app;

import lombok.*;

public class PasswordChangeDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String currentPassword;
        private String newPassword;
        private String newPasswordConfirm;
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
