package com.ssafy.smru.dto;

import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.entity.WebMember;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

public class DispatchOrderDto {

    @Getter
    @NoArgsConstructor
    public static class Request {
        private Long dispatchOrderId;
        private String firestation;
        private String doroLocationInfo;
        private String jibunLocationInfo;
        private String emergencyType;
        private Timestamp reportedTime;
        private String reporterName;
        private String reporterPhone;
        private String reportDetails;
        private String hospitalName;
        private String chronicDisease;
        private String bloodType1;
        private String bloodType2;
        private String drugInfos;
        private String otherInfo;
        private Long webMemberId;
        private String createdBy;

        @Builder
        public Request(Long dispatchOrderId, String firestation, String doroLocationInfo,
                       String jibunLocationInfo, String emergencyType, Timestamp reportedTime,
                       String reporterName, String reporterPhone, String reportDetails,
                       String hospitalName, String chronicDisease, String bloodType1, String bloodType2,
                       String drugInfos, String otherInfo, Long webMemberId, String createdBy) {
            this.dispatchOrderId = dispatchOrderId;
            this.firestation = firestation;
            this.doroLocationInfo = doroLocationInfo;
            this.jibunLocationInfo = jibunLocationInfo;
            this.emergencyType = emergencyType;
            this.reportedTime = reportedTime;
            this.reporterName = reporterName;
            this.reporterPhone = reporterPhone;
            this.reportDetails = reportDetails;
            this.hospitalName = hospitalName;
            this.chronicDisease = chronicDisease;
            this.bloodType1 = bloodType1;
            this.bloodType2 = bloodType2;
            this.drugInfos = drugInfos;
            this.otherInfo = otherInfo;
            this.webMemberId = webMemberId;
            this.createdBy = createdBy;
        }

        public DispatchOrder toEntity(WebMember webMember) {
            return DispatchOrder.builder()
                    .dispatchOrderId(dispatchOrderId)
                    .firestation(firestation)
                    .doroLocationInfo(doroLocationInfo)
                    .jibunLocationInfo(jibunLocationInfo)
                    .emergencyType(emergencyType)
                    .reportedTime(reportedTime)
                    .reporterName(reporterName)
                    .reporterPhone(reporterPhone)
                    .reportDetails(reportDetails)
                    .hospitalName(hospitalName)
                    .chronicDisease(chronicDisease)
                    .bloodType1(bloodType1)
                    .bloodType2(bloodType2)
                    .drugInfos(drugInfos)
                    .otherInfo(otherInfo)
                    .webMember(webMember)
                    .createdBy(createdBy)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Response {
        private Long dispatchOrderId;
        private String firestation;
        private String doroLocationInfo;
        private String jibunLocationInfo;
        private String emergencyType;
        private Timestamp reportedTime;
        private String reporterName;
        private String reporterPhone;
        private String reportDetails;
        private String hospitalName;
        private String memberName;
        private String gender;
        private String birth;
        private String chronicDisease;
        private String bloodType1;
        private String bloodType2;
        private String drugInfos;
        private String otherInfo;
        private String createdBy;


        public Response(DispatchOrder dispatchOrder) {
            this.dispatchOrderId = dispatchOrder.getDispatchOrderId();
            this.firestation = dispatchOrder.getFirestation();
            this.doroLocationInfo = dispatchOrder.getDoroLocationInfo();
            this.jibunLocationInfo = dispatchOrder.getJibunLocationInfo();
            this.emergencyType = dispatchOrder.getEmergencyType();
            this.reportedTime = dispatchOrder.getReportedTime();
            this.reporterName = dispatchOrder.getReporterName();
            this.reporterPhone = dispatchOrder.getReporterPhone();
            this.reportDetails = dispatchOrder.getReportDetails();
            this.hospitalName = dispatchOrder.getHospitalName();
            this.memberName = dispatchOrder.getMemberName();
            this.gender = dispatchOrder.getGender();
            this.birth = dispatchOrder.getBirth();
            this.memberName = dispatchOrder.getMemberName();
            this.chronicDisease = dispatchOrder.getChronicDisease();
            this.bloodType1 = dispatchOrder.getBloodType1();
            this.bloodType2 = dispatchOrder.getBloodType2();
            this.drugInfos = dispatchOrder.getDrugInfos();
            this.otherInfo = dispatchOrder.getOtherInfo();
            this.createdBy = dispatchOrder.getCreatedBy();
        }
    }
}
