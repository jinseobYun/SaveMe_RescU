package com.ssafy.smru.dto.app;


import com.ssafy.smru.entity.app.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class DrugInfoDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request{
        Medicine medicine;
        MedicalInformation medicalInformation;

        public DrugInfo toEntity(){
            return DrugInfo.builder()
                    .medicine(this.medicine)
                    .medicalInformation(this.medicalInformation).build();
        }

    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        Long medicineId;
        String medicineName;
        public static DrugInfoDto.Response fromEntity(DrugInfo drugInfo){
            return Response.builder()
                    .medicineId(drugInfo.getMedicine().getMedicineId())
                    .medicineName(drugInfo.getMedicine().getMedicineName())
                    .build();
        }
    }
}
