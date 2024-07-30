package com.ssafy.smru.dto.app;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.app.EmergencyContact;
import lombok.*;

public class EmergencyContactDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String relation;
        private String phoneNumber;

        public EmergencyContact toEntity(AppMember appMember) {
            return EmergencyContact.builder()
                    .relation(this.relation)
                    .phoneNumber(this.phoneNumber)
                    .appMember(appMember)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long emergencyContactId;
        private String relation;
        private String phoneNumber;

        public static Response fromEntity(EmergencyContact emergencyContact) {
            return Response.builder()
                    .emergencyContactId(emergencyContact.getEmergencyContactId())
                    .relation(emergencyContact.getRelation())
                    .phoneNumber(emergencyContact.getPhoneNumber())
                    .build();
        }
    }
}
