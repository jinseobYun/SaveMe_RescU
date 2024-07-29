package com.ssafy.smru.service;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.security.TokenInfo;

public interface AppMemberService {
    int register(AppMemberDto.Request dto);
    TokenInfo login(AppMemberDto.Request dto);
}
