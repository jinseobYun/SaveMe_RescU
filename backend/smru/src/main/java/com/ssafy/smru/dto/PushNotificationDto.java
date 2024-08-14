package com.ssafy.smru.dto;

import lombok.Builder;
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

        @Builder
        public Response(int pushNotificationId, String title, String body, LocalDateTime notificationTime) {
            this.pushNotificationId = pushNotificationId;
            this.title = title;
            this.body = body;
            this.notificationTime = notificationTime;
        }
    }
}
