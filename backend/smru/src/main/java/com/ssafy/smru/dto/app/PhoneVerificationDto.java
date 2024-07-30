package com.ssafy.smru.dto.app;

import lombok.Getter;
import lombok.Setter;

public class PhoneVerificationDto {

    @Getter
    @Setter
    public static class Request {
        private String phoneNumber;
        private String verifyCode;
    }

    @Getter
    @Setter
    public static class Response {
        private String phoneNumber;
        private String verifyCode;
    }
}
