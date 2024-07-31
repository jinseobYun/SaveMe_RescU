package com.ssafy.smru.service;

import com.ssafy.smru.dto.WebMemberDto;
import com.ssafy.smru.security.TokenInfo;
import org.springframework.stereotype.Service;

public interface WebMemberService {
    int register(WebMemberDto.Request dto);
    TokenInfo login(WebMemberDto.LoginRequest dto);
}
