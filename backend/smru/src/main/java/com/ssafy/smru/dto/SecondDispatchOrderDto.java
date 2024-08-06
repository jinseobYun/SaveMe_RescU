package com.ssafy.smru.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Getter
@NoArgsConstructor
public class SecondDispatchOrderDto {
    @Getter
    @NoArgsConstructor
    public static class Request{
        private Long dispatchOrderId;
        private String hospitalName;
        private String memberName;
        private String gender;
        private String birth;
        private String bloodType1;
        private String bloodType2;
        private String otherInfo;
        private List<String> chronicDisease;
        private List<String> drugInfos;

        @Builder
        public Request(Long dispatchOrderId, String hospitalName, String memberName,
                       String gender, String birth, String bloodType1,
                       String bloodType2, String otherInfo, List<String> chronicDisease, List<String> drugInfos) {
            this.dispatchOrderId = dispatchOrderId;
            this.hospitalName = hospitalName;
            this.memberName = memberName;
            this.gender = gender;
            this.birth = birth;
            this.bloodType1 = bloodType1;
            this.bloodType2 = bloodType2;
            this.otherInfo = otherInfo;
            this.chronicDisease = chronicDisease;
            this.drugInfos = drugInfos;
        }
    }

}
