package com.ssafy.smru.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "dispatch_order")
public class DispatchOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dispatchOrderId;

    @Column(nullable = false)
    private String firestation;

    @Column(nullable = false)
    private String doroLocationInfo;

    @Column(nullable = false)
    private String jibunLocationInfo;

    @Column(nullable = false)
    private int emergencyType;

    @Column(nullable = false)
    private Timestamp reportedTime;

    @Column(nullable = false)
    private String reporterName;

    @Column(nullable = false)
    private String reporterPhone;

    @Column
    private String reportDetails;

    @Column
    private String hospital;

    @Column
    private String chronicDisease;

    @Column
    private String bloodType1;

    @Column
    private String bloodType2;

    @Column
    private String drugInfos;

    @Column
    private String otherInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "web_member_id", nullable = false)
    private WebMember webMember;

    private String createdBy;

    @Builder
    public DispatchOrder(int dispatchOrderId, String firestation, String doroLocationInfo, String jibunLocationInfo, int emergencyType, Timestamp reportedTime, String reporterName, String reporterPhone, String reportDetails, String hospital, String chronicDisease, String bloodType1, String bloodType2, String drugInfos, String otherInfo, WebMember webMember, String createdBy) {
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
        this.createdBy = createdBy;
    }
}


//    public void setSecondInfo(SecondDispatchOrderDto.Request dto) {
//        this.hospital = dto.getHospitalName();
//        this.bloodType1 = dto.getMedicalInformation().getBloodType1();
//        this.bloodType2 = dto.getMedicalInformation().getBloodType2();
//        this.otherInfo = dto.getMedicalInformation().getOtherInfo();
//        this.chronicDisease = ChronicDiseaseUtil.toString(dto.getMedicalInformation().getChronicDisease());
//        this.drugInfos = DrugUtil.toString(dto.getMedicalInformation().getDrugInfos());
//    }

