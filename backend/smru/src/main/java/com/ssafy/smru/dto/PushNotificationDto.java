package com.ssafy.smru.dto;

import lombok.Data;

import java.time.LocalDateTime;

public class PushNotificationDto {
    public static class Request {

    }

    @Data
    public static class Response {
        private int pushNotificationId;
        private String title;
        private String body;
        private LocalDateTime notificationTime;
    }
}
