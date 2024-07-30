package com.ssafy.smru.entity.app;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Getter
@Table(name = "cd_info")
public class CdInfo {
    // 지병 테이블 Entity
    // DB에 미리 저장
    // 지병명으로 ID 검색하는것
    // id로 지병명 검색 하는 것도 필요
    // 수정 x

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cd_info_id")
    private Long cdInfoId;
    
    @Column(name = "cd_name", nullable = false)
    private String cdName;


    @OneToMany(mappedBy = "cdInfo")
    private List<MedCdi> medCdis;




}
