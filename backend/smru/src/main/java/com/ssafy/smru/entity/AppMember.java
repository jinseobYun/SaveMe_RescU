package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
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
    private Date birth;

    @Column
    private boolean gender;

    @Column
    private String phone;

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
    public AppMember(Long appMemberId, String memberId, String password, String memberName, Date birth, boolean gender, String phone, boolean deleted, MedicalInformation medicalInformation) {
        this.appMemberId = appMemberId;
        this.memberId = memberId;
        this.password = password;
        this.memberName = memberName;
        this.birth = birth;
        this.gender = gender;
        this.phone = phone;
        this.deleted = deleted;
        this.medicalInformation = medicalInformation;
    }

    public void changePassword(String password) {
        this.password = password;
    }
}
