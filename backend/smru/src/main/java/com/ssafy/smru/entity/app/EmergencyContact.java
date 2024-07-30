package com.ssafy.smru.entity.app;

import com.ssafy.smru.entity.AppMember;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emergency_contact")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyContact {

    // 비상연락망 정보 Table
    // 생성, 수정, 삭제,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emergency_contact_id")
    private Long emergencyContactId;
    
    @Column(name = "relation", nullable = false)
    private String relation;
    
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;
    
    @ManyToOne
    @JoinColumn(name = "app_member_id", nullable = false)
    private AppMember appMember;

    public void changeRelation(String relation){
        this.relation = relation;
    }

    public void changePhoneNumber(String phoneNumber){
        this.phoneNumber = phoneNumber;
    }

}
