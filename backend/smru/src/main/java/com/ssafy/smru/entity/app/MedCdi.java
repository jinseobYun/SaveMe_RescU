package com.ssafy.smru.entity.app;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "med_cdi")
public class MedCdi {

    //회원 의료 정보 테이블과 지병 테이블의
    // N : M 을 해소하기 위한 중간 Entity Table
    // Create :
    //
    // List<Integer> 로 받아옴 ( 지병 테이블의 cd_info_id )
    // for 문으로 저장

    // Read
    // medical_information_id 로 전체 조회

    // Update
    // medical_information_id 로 다 지우고
    // 다시 포문으로 create

    // Delete
    //  medical_information_id 삭제 될때 같이 삭제


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "med_cdi_id")
    private Long medCdiId;
    
    @ManyToOne
    @JoinColumn(name = "medical_information_id", nullable = false)
    private MedicalInformation medicalInformation;
    
    @ManyToOne
    @JoinColumn(name = "cd_info_id", nullable = false)
    private CdInfo cdInfo;

}
