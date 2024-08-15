// MedicalInformationDto.java
package com.ssafy.smru.dto.app;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.entity.app.MedicalInformation;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MedicalInformationDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String bloodType1;
        private String bloodType2;
        private String otherInfo;
        private List<Long> medCdis;
        private List<Long> drugInfos;
        private String memberId;

        public MedicalInformation toEntity() {
            return MedicalInformation.builder()
                    .bloodType1(this.bloodType1)
                    .bloodType2(this.bloodType2)
                    .otherInfo(this.otherInfo)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long medicalInformationId;
        private String bloodType1;
        private String bloodType2;
        private String otherInfo;
        private List<DrugInfoDto.Response> drugInfos;
        private List<MedCdiDto.Response> medCdis;

        public static Response fromEntity(MedicalInformation medicalInformation) {
            return Response.builder()
                    .medicalInformationId(medicalInformation.getMedicalInformationId())
                    .bloodType1(medicalInformation.getBloodType1())
                    .bloodType2(medicalInformation.getBloodType2())
                    .otherInfo(medicalInformation.getOtherInfo())
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    // 신고시작시 환자,신고자 정보 전달때 medicalInformation에 member정보도 같이 보내줌
    public static class ReportInfoResponse {
        // 이름
        private Long medicalInformationId;
        private String bloodType1 = "등록된 혈액형 없음";
        private String bloodType2 =  "등록된 혈액형 없음";
        private String otherInfo = "등록된 추가 정보 없음";
        private List<DrugInfoDto.Response> drugInfos = new ArrayList<>();
        private List<MedCdiDto.Response> medCdis = new ArrayList<>();

        private String memberName;
        // 전화번호
        private String phoneNumber;
        //생년월일
        private LocalDate birth;
        private int gender;

        // member객체에서 memberName,phoneNumber,birth를 뽑아 셋
        public static ReportInfoResponse writeReportInfoResponse(Response response, AppMemberDto.Response member) {
            return ReportInfoResponse.builder()
                    .medicalInformationId(response.getMedicalInformationId())
                    .bloodType1(response.getBloodType1() != null ? response.getBloodType1() : "등록된 혈액형 없음")
                    .bloodType2(response.getBloodType2() != null ? response.getBloodType2() : "등록된 혈액형 없음")
                    .otherInfo(response.getOtherInfo() != null ? response.getOtherInfo() : "등록된 추가 정보 없음")
                    .drugInfos(response.getDrugInfos() != null ? response.getDrugInfos() : new ArrayList<>())
                    .medCdis(response.getMedCdis() != null ? response.getMedCdis() : new ArrayList<>())
                    .memberName(member.getMemberName())
                    .birth(member.getBirth())
                    .phoneNumber(member.getPhoneNumber())
                    .gender(member.isGender() ? 1 : 0)
                    .build();
        }

        // 회원 정보 수정
        public void updateMember(AppMemberDto.Response member) {
            this.memberName = member.getMemberName();
            this.phoneNumber = member.getPhoneNumber();
            this.birth = member.getBirth();
            this.gender = member.isGender() ? 1 : 0;

        }


    }
}
