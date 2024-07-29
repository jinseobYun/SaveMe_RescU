package com.ssafy.smru.entity;

import jakarta.persistence.*;

@Entity
public class MedicalInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int medicalInfoId;

    @Column
    private String bloodType1;

    @Column
    private String bloodType2;

    @Column
    private String otherInfo;

    @OneToOne(mappedBy = "medicalInformation")
    private AppMember appMember;
}
