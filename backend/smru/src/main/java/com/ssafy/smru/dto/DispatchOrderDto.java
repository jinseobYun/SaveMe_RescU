package com.ssafy.smru.dto;

import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.entity.WebMember;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

public class DispatchOrderDto {
    @Getter
    @NoArgsConstructor
    @Setter
    public static class Request {
        private String firestation;
        private String doroLocationInfo;
        private String jibunLocationInfo;
        private Integer emergencyType;
        private Timestamp reportedTime;
        private String reporterName;
        private String reporterPhone;
        private String reportDetails;
        private String hospital;
        private String chronicDisease;
        private String bloodType1;
        private String bloodType2;
        private String drugInfos;
        private String otherInfo;

        @Builder
        public Request(String firestation, String doroLocationInfo, String jibunLocationInfo, Integer emergencyType, Timestamp reportedTime, String reporterName, String reporterPhone, String reportDetails, String hospital, String chronicDisease, String bloodType1, String bloodType2, String drugInfos, String otherInfo) {
            this.firestation = firestation;
            this.doroLocationInfo = doroLocationInfo;
            this.jibunLocationInfo = jibunLocationInfo;
            this.emergencyType = emergencyType;
            this.reportedTime = reportedTime;
            this.reporterName = reporterName;
            this.reporterPhone = reporterPhone;
            this.reportDetails = reportDetails;
            this.hospital = hospital;
            this.chronicDisease = chronicDisease;
            this.bloodType1 = bloodType1;
            this.bloodType2 = bloodType2;
            this.drugInfos = drugInfos;
            this.otherInfo = otherInfo;
        }

        public DispatchOrder toEntity(WebMember webMember) {
            return DispatchOrder.builder()
                    .firestation(firestation)
                    .doroLocationInfo(doroLocationInfo)
                    .jibunLocationInfo(jibunLocationInfo)
                    .emergencyType(emergencyType)
                    .reportedTime(reportedTime)
                    .reporterName(reporterName)
                    .reporterPhone(reporterPhone)
                    .reportDetails(reportDetails)
                    .hospital(hospital)
                    .chronicDisease(chronicDisease)
                    .bloodType1(bloodType1)
                    .bloodType2(bloodType2)
                    .drugInfos(drugInfos)
                    .otherInfo(otherInfo)
                    .webMember(webMember)
                    .build();
        }
    }
    @Getter
    @NoArgsConstructor
    public static class Response {
        private Integer emergencyType;
        private Timestamp reportedTime;
        private String hospital;
        private String reporterName;
        private String reporterPhone;
        private String reportDetail;
        private String firestation;
        private String jibunLocationInfo;
        private String doroLocationInfo;
        private String chronicDisease;
        private String bloodType1;
        private String bloodType2;
        private String drugInfos;
        private String otherInfo;
        private String createdBy;

        @Builder
        public Response(DispatchOrder dispatchOrder) {
            this.emergencyType = dispatchOrder.getEmergencyType();
            this.reportedTime = dispatchOrder.getReportedTime();
            this.hospital = dispatchOrder.getHospital();
            this.reporterName = dispatchOrder.getReporterName();
            this.reporterPhone = dispatchOrder.getReporterPhone();
            this.reportDetail = dispatchOrder.getReportDetails();
            this.firestation = dispatchOrder.getFirestation();
            this.jibunLocationInfo = dispatchOrder.getJibunLocationInfo();
            this.doroLocationInfo = dispatchOrder.getDoroLocationInfo();
            this.chronicDisease = dispatchOrder.getChronicDisease();
            this.bloodType1 = dispatchOrder.getBloodType1();
            this.bloodType2 = dispatchOrder.getBloodType2();
            this.drugInfos = dispatchOrder.getDrugInfos();
            this.otherInfo = dispatchOrder.getOtherInfo();
            this.createdBy = dispatchOrder.getWebMember().getName();
        }
    }
}
