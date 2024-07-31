package com.ssafy.smru.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SecondDispatchOrderDto {


    @Getter
    @NoArgsConstructor
    public static class SecondInfoRequest{
        private Long dispatchOrderId;
        private String hpid;
        private String hospitalName;
        
    }

}
