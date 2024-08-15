package com.ssafy.smru.dto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

public class InitialTemplateDto {
    public static class Request {
        private Long initialTemplateId;
    }
    @Getter
    @NoArgsConstructor
    @ToString
    public static class Response {
        private Long initialTemplateId;
        private Object data;
        @Builder
        public Response(Long initialTemplateId, Object data) {
            this.initialTemplateId = initialTemplateId;
            this.data = data;
        }
    }
}
