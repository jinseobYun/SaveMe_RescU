package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    @Column
    private String memberId;

    @Column
    private String password;

    @Column
    private String name;

    @Column
    private Integer roleId;

    @Builder
    public WebMember(Long webMemberId, String memberId, String password, String name, Integer roleId) {
        this.webMemberId = webMemberId;
        this.memberId = memberId;
        this.password = password;
        this.name = name;
        this.roleId = roleId;
    }

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
}
