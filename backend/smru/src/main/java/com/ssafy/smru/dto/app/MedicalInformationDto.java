// MedicalInformationDto.java
package com.ssafy.smru.dto.app;

import com.ssafy.smru.entity.app.MedicalInformation;
import lombok.*;

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

        public MedicalInformation toEntity(){
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
}
