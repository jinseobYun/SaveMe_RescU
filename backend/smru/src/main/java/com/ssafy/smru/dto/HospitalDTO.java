package com.ssafy.smru.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
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
}
