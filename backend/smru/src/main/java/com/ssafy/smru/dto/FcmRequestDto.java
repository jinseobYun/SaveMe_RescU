package com.ssafy.smru.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FcmRequestDto {
    private String tagId;
    private String hospitalName;
    private String hospitalAddress;
}
