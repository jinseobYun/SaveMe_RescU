package com.ssafy.smru.entity.app;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "medicine")
@AllArgsConstructor
@NoArgsConstructor
public class Medicine {

    // 약 정보
    // 약 이름, 약 id 로 조회
    // 수정 x

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medicine_id")
    private Long medicineId;
    
    @Column(name = "medicine_name", nullable = false)
    private String medicineName;



}
