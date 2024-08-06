package com.ssafy.smru.dto.app;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.MedicalInfoDto;
import com.ssafy.smru.entity.AppMember;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

public class AppMemberRegisterDto {

    @Getter
    @NoArgsConstructor
    @ToString
    public static class Request {
        private Long appMemberId;

        @NotBlank(message = "회원 ID 는 필수 값입니다.")
        private String memberId;
        private String password;
        private String passwordConfirm;
        private String memberName;
        private LocalDate birth;
        private boolean gender;
        private String phone;
        private boolean deleted;
        private MedicalInfoDto medicalInfoDto;

        @Builder
        public Request(Long appMemberId, String memberId, String password, String memberName, LocalDate birth, boolean gender, String phone, boolean deleted, MedicalInfoDto medicalInfoDto) {
            this.appMemberId = appMemberId;
            this.memberId = memberId;
            this.password = password;
            this.passwordConfirm = password;
            this.memberName = memberName;
            this.birth = birth;
            this.gender = gender;
            this.phone = phone;
            this.deleted = deleted;
            this.medicalInfoDto = medicalInfoDto;
        }

        public AppMember toEntity() {
            return AppMember.builder()
                    .appMemberId(appMemberId)
                    .memberId(memberId)
                    .password(password)
                    .memberName(memberName)
                    .birth(birth)
                    .gender(gender)
                    .phone(phone)
                    .deleted(deleted)
                    .medicalInformation(null)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long appMemberId;
        private String memberId;
        private String memberName;
        private String phone;

        public static AppMemberDto.Response fromEntity(AppMember member) {
            return AppMemberDto.Response.builder()
                    .appMemberId(member.getAppMemberId())
                    .memberId(member.getMemberId())
                    .memberName(member.getMemberName())
                    .phone(member.getPhone())
                    .build();
        }
    }
}
