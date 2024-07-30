package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "web_member_role")
public class WebMemberRole {
    // 기본 키
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId;

    // 역할 이름 필드
    @Column(nullable = false)
    private String roleName;

    // 생성자
    public WebMemberRole(String roleName) {
        this.roleName = roleName;
    }
}
