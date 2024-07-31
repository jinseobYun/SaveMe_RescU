package com.ssafy.smru.dto;

import com.ssafy.smru.entity.WebMember;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

public class WebMemberDto {

    @Getter
    @NoArgsConstructor
    @ToString
    public static class Request {
        private Long webMemberId;
        private String memberId;
        private String password;
        private String name;
        private Integer roleId;

        @Builder
        public Request(Long webMemberId, String memberId, String password, String name, Integer roleId) {
            this.webMemberId = webMemberId;
            this.memberId = memberId;
            this.password = password;
            this.name = name;
            this.roleId = roleId;
        }

        public WebMember toEntity() {
            return WebMember.builder()
                    .webMemberId(webMemberId)
                    .memberId(memberId)
                    .password(password)
                    .name(name)
                    .build();
        }
    }

    @Getter
    @ToString
    @NoArgsConstructor
    public static class LoginRequest {
        private String memberId;
        private String password;

        @Builder
        public LoginRequest(String memberId, String password) {
            this.memberId = memberId;
            this.password = password;
        }
    }

    @Getter
    @ToString
    @NoArgsConstructor
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;

        @Builder
        public LoginResponse(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }
}
