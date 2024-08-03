package com.ssafy.smru.dto.app;


import com.ssafy.smru.entity.app.CdInfo;
import com.ssafy.smru.entity.app.MedCdi;
import com.ssafy.smru.entity.app.MedicalInformation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class MedCdiDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request{
        CdInfo cdInfo;
        MedicalInformation medicalInformation;

        public MedCdi toEntity(){
            return MedCdi.builder()
                    .cdInfo(this.cdInfo)
                    .medicalInformation(this.medicalInformation).build();
        }

    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        Long cdInfoId;
        String cdName;
        public static MedCdiDto.Response fromEntity(MedCdi medCdi){
            return Response.builder()
                    .cdInfoId(medCdi.getCdInfo().getCdInfoId())
                    .cdName(medCdi.getCdInfo().getCdName())
                    .build();
        }
    }
}
