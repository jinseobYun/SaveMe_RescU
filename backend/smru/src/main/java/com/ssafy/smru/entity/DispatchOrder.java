package com.ssafy.smru.entity;

import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.util.ChronicDiseaseUtil;
import com.ssafy.smru.util.DrugUtil;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Getter
@NoArgsConstructor
@Table(name="dispatch_order")
public class DispatchOrder {
    // 출동지령 기본키 , 52
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dispatchOrderId;

    // 소방서 이름
    @Column(nullable = false)
    private String firestation;

    // 도로 위치 정보
    @Column(nullable = false)
    private String doroLocationInfo;

    // 지번 위치 정보
    @Column(nullable = false)
    private String jibunLocationInfo;

    // 긴급 상황 유형
    @Column(nullable = false)
    private Integer emergencyType;

    // 신고 시간
    @Column(nullable = false)
    private Timestamp reportedTime;

    // 신고자 이름
    @Column(nullable = false)
    private String reporterName;

    // 신고자 전화번호
    @Column(nullable = false)
    private String reporterPhone;

    // 신고 세부 사항
    @Column
    private String reportDetails;

    // 병원 정보
    @Column
    private String hospital;

    // 만성 질환 정보
    @Column
    private String chronicDisease;

    // 혈액형 정보 1
    @Column
    private String bloodType1;

    // 혈액형 정보 2
    @Column
    private String bloodType2;

    // 약물 정보
    @Column
    private String drugInfos;

    // 기타 정보
    @Column
    private String otherInfo;

    @ManyToOne
    @JoinColumn(name="web_member_id", nullable = false)
    private WebMember webMember;



    @Builder
    public DispatchOrder(Long dispatchOrderId, String firestation, String doroLocationInfo, String jibunLocationInfo, Integer emergencyType, Timestamp reportedTime, String reporterName, String reporterPhone, String reportDetails, String hospital, String chronicDisease, String bloodType1, String bloodType2, String drugInfos, String otherInfo, WebMember webMember) {
        this.dispatchOrderId = dispatchOrderId;
        this.firestation = firestation;
        this.doroLocationInfo = doroLocationInfo;
        this.jibunLocationInfo = jibunLocationInfo;
        this.emergencyType = emergencyType;
        this.reportedTime = reportedTime;
        this.reporterName = reporterName;
        this.reporterPhone = reporterPhone;
        this.reportDetails = reportDetails;
        this.hospital = hospital;
        this.chronicDisease = chronicDisease;
        this.bloodType1 = bloodType1;
        this.bloodType2 = bloodType2;
        this.drugInfos = drugInfos;
        this.otherInfo = otherInfo;
        this.webMember = webMember;
    }

    public void setSecondInfo(SecondDispatchOrderDto.Request dto) {
        this.hospital = dto.getHospitalName();
        this.bloodType1 = dto.getMedicalInformation().getBloodType1();
        this.bloodType2 = dto.getMedicalInformation().getBloodType2();
        this.otherInfo = dto.getMedicalInformation().getOtherInfo();
        this.chronicDisease = ChronicDiseaseUtil.toString(dto.getMedicalInformation().getChronicDisease());
        this.drugInfos = DrugUtil.toString(dto.getMedicalInformation().getDrugInfos());
    }
}
