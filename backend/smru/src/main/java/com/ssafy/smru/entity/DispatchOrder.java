package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@Entity
public class DispatchOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dispatchOrderId;

    @Column
    private String firestation;

    @Column
    private String doroLocationInfo;

    @Column
    private String jibunLocationInfo;

    @Column
    private String emergencyType;

    @Column
    private Timestamp reportedTime;

    @Column
    private String reporterName;

    @Column
    private String reporterPhone;

    @Column
    private String reportDetails;

    @Column
    private String createdBy;

    @Column
    private String hospitalName;

    @Column
    private String memberName;

    @Column
    private String gender;

    @Column
    private String birth;

    @Column
    private String bloodType1;

    @Column
    private String bloodType2;

    @Column
    private String chronicDisease;

    @Column
    private String drugInfos;

    @Column
    private String otherInfo;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "web_member_id", nullable = false)
    private WebMember webMember;

    @Builder
    public DispatchOrder(Long dispatchOrderId, String firestation, String doroLocationInfo, String jibunLocationInfo, String emergencyType, Timestamp reportedTime, String reporterName, String reporterPhone, String reportDetails, String createdBy, String hospitalName, String memberName, String gender, String birth, String bloodType1, String bloodType2, String chronicDisease, String drugInfos, String otherInfo, WebMember webMember) {
        this.dispatchOrderId = dispatchOrderId;
        this.firestation = firestation;
        this.doroLocationInfo = doroLocationInfo;
        this.jibunLocationInfo = jibunLocationInfo;
        this.emergencyType = emergencyType;
        this.reportedTime = reportedTime;
        this.reporterName = reporterName;
        this.reporterPhone = reporterPhone;
        this.reportDetails = reportDetails;
        this.createdBy = createdBy;
        this.hospitalName = hospitalName;
        this.memberName = memberName;
        this.gender = gender;
        this.birth = birth;
        this.bloodType1 = bloodType1;
        this.bloodType2 = bloodType2;
        this.chronicDisease = chronicDisease;
        this.drugInfos = drugInfos;
        this.otherInfo = otherInfo;
        this.webMember = webMember;
    }


    // Setter 메서드 추가
    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public void setMemberName(String memberName){this.memberName=memberName;}
    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setBirth(String birth) {
        this.birth = birth;
    }

    public void setBloodType1(String bloodType1) {
        this.bloodType1 = bloodType1;
    }

    public void setBloodType2(String bloodType2) {
        this.bloodType2 = bloodType2;
    }

    public void setChronicDisease(String chronicDisease) {
        this.chronicDisease = chronicDisease;
    }

    public void setDrugInfos(String drugInfos) {
        this.drugInfos = drugInfos;
    }

    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }
}
