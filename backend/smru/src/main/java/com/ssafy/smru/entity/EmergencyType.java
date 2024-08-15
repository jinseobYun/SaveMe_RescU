package com.ssafy.smru.entity;

import jakarta.persistence.*;

@Entity
public class EmergencyType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer EmergencyTypeId;

    @Column
    private String EmergencyTypeName;
}
