package com.ssafy.smru.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

public class DispatchOrderListDto {

    @Getter
    @NoArgsConstructor
    public static class Response {
        private Long dispatchOrderId;
        private Timestamp reportedTime;
        private String createdBy;

        public Response(Long dispatchOrderId, Timestamp reportedTime, String createdBy) {
            this.dispatchOrderId = dispatchOrderId;
            this.reportedTime = reportedTime;
            this.createdBy = createdBy;
        }
    }
}
