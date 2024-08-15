package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "duty_info")
public class DutyInfo {
    // hpid
    @Id
    private String hpid;

    // 병원 주소
    @Column(columnDefinition = "TEXT")
    private String dutyAddr;

    // 응급실 분류 코드
    @Column(columnDefinition = "TEXT")
    private String dutyEmcls;

    // 의료기관명
    @Column(columnDefinition = "TEXT")
    private String dutyEmclsName;

    // 병원명
    @Column(columnDefinition = "TEXT")
    private String dutyName;

    // 전화번호 1
    @Column(columnDefinition = "TEXT")
    private String dutyTel1;

    // 전화번호 2
    @Column(columnDefinition = "TEXT")
    private String dutyTel3;

    // phpid
    @Column(columnDefinition = "TEXT")
    private String phpid;

    // 위도
    @Column(name = "latitude")
    private BigDecimal latitude;

    // 경도
    @Column(name = "longitude")
    private BigDecimal longitude;

    @Builder
    public DutyInfo(String hpid, String dutyAddr, String dutyEmcls, String dutyEmclsName, String dutyName, String dutyTel1, String dutyTel3, String phpid, BigDecimal latitude, BigDecimal longitude) {
        this.hpid = hpid;
        this.dutyAddr = dutyAddr;
        this.dutyEmcls = dutyEmcls;
        this.dutyEmclsName = dutyEmclsName;
        this.dutyName = dutyName;
        this.dutyTel1 = dutyTel1;
        this.dutyTel3 = dutyTel3;
        this.phpid = phpid;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
