package com.ssafy.smru.dto;

// [신고접수] 신고 시작시 환자 정보 전달
// 환자 ID, 신고자 ID, 위도 경도를 받아
// 초기 데이터를 보내줌

import com.ssafy.smru.dto.app.MedicalInformationDto;
import com.ssafy.smru.entity.RescueTeam;
import lombok.*;

import java.util.List;



public class ReportInfoDto {
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{

        // 환자의 아이디
        private String patientId;

        // 신고자 아이디
        private String reporterId;

        // 위도
        private String lat;

        //경도
        private String lon;

    }

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Getter
    @ToString
    public static class Response{

        // 위도 경도
        private String latitude;
        private String longitude;

        // 신고 시각

        private String reportedTime;

        // 주변 응급실 병원
        // "hpid" : "A1100015",
        // "hospitalName" : "병원명 1",
        // "address" : "병원 주소",
        // "latitude" : "36.1235",
        // "logitude" : "127.235231",
        // "distance" : 456 // 단위 m(미터),
        // "eta" : 5, // 단위 분
        // "hvec" : 3, // 응급실 가용 병상
        // "hvoc" : 0, // 수술실 가용
        // "tel" : "02-123-1234",
        // "message" : "응급실 메시지"
        private List<nearHospitalDto> hospitals;

        // 신고자 명
        private String reporterName;
        // 신고자 전화번호
        private String reporterPhone;
        
        // 주변 119 관할서
        private List<RescueTeam> rescueTeams;

        // 신고 위치 지번
        // 신고 위치 도로명
        private String lotNumberAddress;

        private String roadNameAddress;


        // 환자 medicalInfo
        private MedicalInformationDto.ReportInfoResponse taggingMedicalInformation;

        // 신고자 medicalInfo
        private MedicalInformationDto.ReportInfoResponse reporterMedicalInformation;




    }

}
