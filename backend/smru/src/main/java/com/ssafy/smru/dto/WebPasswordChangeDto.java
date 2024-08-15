package com.ssafy.smru.dto;

import lombok.*;

@Getter
@NoArgsConstructor
public class WebPasswordChangeDto {

    @Getter
    @NoArgsConstructor
    @Setter
    public static class Request{
        private String currentPassword;
        private String newPassword;
        private String newPasswordConfirm;

        @Builder
        public Request(String currentPassword, String newPassword, String newPasswordConfirm) {
            this.currentPassword = currentPassword;
            this.newPassword = newPassword;
            this.newPasswordConfirm = newPasswordConfirm;
        }
    }

}
