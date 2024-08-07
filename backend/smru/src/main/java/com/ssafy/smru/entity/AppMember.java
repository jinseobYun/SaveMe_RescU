package com.ssafy.smru.entity;

import com.ssafy.smru.entity.app.MedicalInformation;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@ToString
public class AppMember implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appMemberId;

    @Column
    private String memberId;

    @Column
    private String password;

    @Column
    private String memberName;

    @Column
    private LocalDate birth;

    @Column
    private boolean gender;

    @Column(name="phone",unique = true)
    private String phoneNumber;

    @Column
    @ColumnDefault("false")
    private boolean deleted;

    @OneToOne
    @JoinColumn(name = "medical_information_id")
    private MedicalInformation medicalInformation;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return memberId;
    }


    @Builder
    public AppMember(Long appMemberId, String memberId, String password, String memberName, LocalDate birth, boolean gender, String phoneNumber, boolean deleted, MedicalInformation medicalInformation) {
        this.appMemberId = appMemberId;
        this.memberId = memberId;
        this.password = password;
        this.memberName = memberName;
        this.birth = birth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.deleted = deleted;
        this.medicalInformation = medicalInformation;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeMedicalInformation(MedicalInformation medicalInformation) {
        this.medicalInformation = medicalInformation;
    }
    public void changePhone(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
