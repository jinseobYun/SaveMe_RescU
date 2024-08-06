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
        private Long rescueTeamId;
        private String firestation;
        private String jibunLocationInfo;
        private String doroLocationInfo;
        private Integer emergencyType;
        private String reporterName;
        private String reporterPhone;
        private String reportDetail;

        @Builder
        public FirstInfoRequest(Long rescueTeamId,String firestation, String jibunLocationInfo, String doroLocationInfo,
                                Integer emergencyType, String reporterName, String reporterPhone,
                                String reportDetail) {
            this.rescueTeamId = rescueTeamId;
            this.firestation=firestation;
            this.jibunLocationInfo = jibunLocationInfo;
            this.doroLocationInfo = doroLocationInfo;
            this.emergencyType = emergencyType;
            this.reporterName = reporterName;
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
