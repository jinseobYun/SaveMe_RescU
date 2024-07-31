package com.ssafy.smru.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
public class FirstDispatchOrderDto {

    @Getter
    @NoArgsConstructor
    public static class FirstInfoRequest {
        private Long gwanhalId;
        private String jibunLocationInfo;
        private String doroLocationInfo;
        private Integer emergencyType;
        private String reporterName;
        private Timestamp reportedTime;
        private String reporterPhone;
        private String reportDetail;

        @Builder
        public FirstInfoRequest(Long gwanhalId, String jibunLocationInfo, String doroLocationInfo, Integer emergencyType, String reporterName, Timestamp reportedTime, String reporterPhone, String reportDetail) {
            this.gwanhalId = gwanhalId;
            this.jibunLocationInfo = jibunLocationInfo;
            this.doroLocationInfo = doroLocationInfo;
            this.emergencyType = emergencyType;
            this.reporterName = reporterName;
            this.reportedTime = reportedTime;
            this.reporterPhone = reporterPhone;
            this.reportDetail = reportDetail;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Response {
        private Long dispatchOrderId;

        @Builder
        public Response(Long dispatchOrderId) {
            this.dispatchOrderId = dispatchOrderId;
        }
    }
}
