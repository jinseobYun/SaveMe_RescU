package com.ssafy.smru.dto;

import com.ssafy.smru.entity.EmergencyRoom;
import lombok.*;

import java.math.BigDecimal;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDTO {
    private String hpid;
    private String dutyAddr;
    private String dutyEmcls;
    private String dutyEmclsName;
    private String dutyName;
    private String dutyTel1;
    private String dutyTel3;
    private String phpid;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String distance;
    // 가용 병상
    private int hvec;
    // 가용 수술실
    private int hvoc;

    public void addEmergencyRoomInfo(EmergencyRoom emergencyRoom){
        if(emergencyRoom.getHvec() != null){
            this.hvec = emergencyRoom.getHvec();

        }
        if(emergencyRoom.getHvoc() != null){
            this.hvoc = emergencyRoom.getHvoc();
        }
    }
}
