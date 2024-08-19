package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class WebMember implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long webMemberId;

    @Column(nullable = false, unique = true)
    private String memberId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;



    @OneToOne
    @JoinColumn(name = "role_id", nullable = false)
    private WebMemberRole role;


    @Builder
    public WebMember(Long webMemberId, String memberId, String password, String name, Integer roleId) {
        this.webMemberId = webMemberId;
        this.memberId = memberId;
        this.password = password;
        this.name = name;
    }



    // GrantedAuthority 를 구현하는 getAuthorities 메서드, 현재는 빈 리스트 반환
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


    // 회원 이름 변경 메서드
    public void changeName(String name) {
        this.name = name;
    }

    // 계정이 만료되지 않았는지 여부 반환, true로 설정
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정이 잠겨 있지 않았는지 여부 반환, true로 설정
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 자격 증명이 만료되지 않았는지 여부 반환, true로 설정
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정이 활성화되어 있는지 여부 반환, true로 설정
    @Override
    public boolean isEnabled() {
        return true;
    }

    // 비밀번호 변경
    public void changePassword(String password) {
        this.password = password;
    }
    public void changeRole(WebMemberRole role) {
        this.role = role;
    }

    public Integer getRoleId() {
        return this.role != null ? this.role.getRoleId() : null;
    }

}
