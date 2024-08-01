package com.ssafy.smru.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SecondDispatchOrderDto {
    @Getter
    @NoArgsConstructor
    public static class Request{
        private Long dispatchOrderId;
        private String hpid;
        private String hospitalName;
        private MedicalInfoDto.Request medicalInformation;
        @Builder
        public Request(Long dispatchOrderId, String hpid, String hospitalName, MedicalInfoDto.Request medicalInformation) {
            this.dispatchOrderId = dispatchOrderId;
            this.hpid = hpid;
            this.hospitalName = hospitalName;
            this.medicalInformation = medicalInformation;
        }
    }

}
