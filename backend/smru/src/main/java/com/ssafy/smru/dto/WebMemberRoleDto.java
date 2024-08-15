package com.ssafy.smru.dto;

import com.ssafy.smru.entity.WebMemberRole;
import lombok.*;

@Getter
@NoArgsConstructor
public class WebMemberRoleDto {
    private int roleId;
    private String roleName;

    @Builder
    public WebMemberRoleDto(int roleId, String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }

    public WebMemberRole toEntity() {
        return WebMemberRole.builder()
                .roleId(roleId)
                .roleName(roleName)
                .build();
    }
}