package com.ssafy.smru.entity.app;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "phone_verification")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PhoneVerification {

    // 휴대폰 번호로 인증번호 조회
    // 인증번호만 수정 가능
    
    @Id
    @Column(name = "phone_number", nullable = false ,updatable = false)
    private String phoneNumber;
    
    @Column(name = "verification_number", nullable = false)
    private String verificationNumber;

    public void changeVerificationNumber(String verificationNumber) {
        this.verificationNumber = verificationNumber;
    }



}
