package com.ssafy.smru.dto;

import com.ssafy.smru.dto.app.MedicalInformationDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Getter
@NoArgsConstructor
public class StartReportDto {

    @Getter
    @NoArgsConstructor
    public static class Response{
        private String latitude;
        private String longitude;
        private String jibunLocationInfo;
        private String doroLocationInfo;
        private List<String> hospitals;
        private Timestamp reportedTime;
        private String reporterName;
        private String reporterPhone;
        private String reportDetail;
        private List<String> gwanhals;
        private MedicalInformationDto medicalInfo;

        @Builder
        public Response(String latitude, String longitude, String jibunLocationInfo,
                        String doroLocationInfo, List<String> hospitals, Timestamp reportedTime,
                        String reporterName, String reporterPhone, String reportDetail, List<String> gwanhals,
                        MedicalInformationDto medicalInfo) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.jibunLocationInfo = jibunLocationInfo;
            this.doroLocationInfo = doroLocationInfo;
            this.hospitals = hospitals;
            this.reportedTime = reportedTime;
            this.reporterName = reporterName;
            this.reporterPhone = reporterPhone;
            this.reportDetail = reportDetail;
            this.gwanhals = gwanhals;
            this.medicalInfo = medicalInfo;
        }

    }

}
