package com.ssafy.smru.dto;

import com.ssafy.smru.entity.AppMember;
import lombok.*;

import java.time.LocalDate;

public class AppMemberDto {
    @Getter
    @NoArgsConstructor
    @ToString
    public static class Request {
        private Long appMemberId;
        private String memberId;
        private String password;
        private String memberName;
        private LocalDate birth;
        private boolean gender;
        private String phoneNumber;
        private boolean deleted;
        private MedicalInfoDto medicalInfoDto;

        @Builder
        public Request(Long appMemberId, String memberId, String password, String memberName, LocalDate birth, boolean gender, String phoneNumber, boolean deleted, MedicalInfoDto medicalInfoDto) {
            this.appMemberId = appMemberId;
            this.memberId = memberId;
            this.password = password;
            this.memberName = memberName;
            this.birth = birth;
            this.gender = gender;
            this.phoneNumber = phoneNumber;
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
                    .phoneNumber(phoneNumber)
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
        private String phoneNumber;
        private LocalDate birth;
        private boolean gender;

        public static Response fromEntity(AppMember member) {
            return Response.builder()
                    .appMemberId(member.getAppMemberId())
                    .memberId(member.getMemberId())
                    .memberName(member.getMemberName())
                    .phoneNumber(member.getPhoneNumber())
                    .gender(member.isGender())
                    .birth(member.getBirth())
                    .build();
        }
    }


}
