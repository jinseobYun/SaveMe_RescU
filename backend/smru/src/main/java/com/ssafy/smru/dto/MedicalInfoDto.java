package com.ssafy.smru.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class MedicalInfoDto {
    @Getter
    @NoArgsConstructor
    public static class Request {
        private String bloodType1;
        private String bloodType2;
        private String otherInfo;
        private List<Integer> chronicDisease;
        private List<Integer> drugInfos;

        @Builder
        public Request(String bloodType1, String bloodType2, String otherInfo, List<Integer> chronicDisease, List<Integer> drugInfos) {
            this.bloodType1 = bloodType1;
            this.bloodType2 = bloodType2;
            this.otherInfo = otherInfo;
            this.chronicDisease = chronicDisease;
            this.drugInfos = drugInfos;
        }
    }
    public static class Response {

    }
}
