package com.ssafy.smru.entity.app;

import com.ssafy.smru.entity.AppMember;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "medical_information")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medical_information_id")
    private Long medicalInformationId;

    @Column(name = "blood_type1")
    private String bloodType1;

    @Column(name = "blood_type2")
    private String bloodType2;

    @Column(name = "other_info")
    private String otherInfo;

    @OneToMany(mappedBy = "medicalInformation")
    private List<DrugInfo> drugInfos;

    @OneToMany(mappedBy = "medicalInformation")
    private List<MedCdi> medCdis;

    @OneToOne(mappedBy = "medicalInformation")
    private AppMember appMember;

}
