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
@Table(name = "drug_info")
public class DrugInfo {

    // 의료정보와 약 정보의 M:N 제약 해결을 위한 Entity 테이블
    // 유저가 의료 정보에서 투약 정보를 입력하면
    // 약 이름으로 Medicine_Info 테이블에서 검색 후 유효한 약만 등록 가능하게 함
    // Create
    // 약 정보가 medicine_id 를 담은 리스트로 들어옴
    // 사용자 인증 정보 확인 후 의료 정보 아이디를 가져옴
    // for문으로 등록
    // read
    // 리스트 약 고유 번호로 내보내기
    // update
    // medical_information_id 으로 다 지우고
    // 다시 입력
    // 없으면 삭제만 시키기
    // 의료정보 삭제될때 같이 삭제




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drug_info_id")
    private Long drugInfoId;
    
    @ManyToOne
    @JoinColumn(name = "medical_information_id", nullable = false)
    private MedicalInformation medicalInformation;
    
    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;



}
