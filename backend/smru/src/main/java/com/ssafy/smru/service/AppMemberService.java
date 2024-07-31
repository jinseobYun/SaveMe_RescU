package com.ssafy.smru.service;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.security.TokenInfo;

public interface AppMemberService {
    int register(AppMemberDto.Request dto);
    TokenInfo login(AppMemberDto.Request dto);
    boolean idConfirm(AppMemberDto.Request dto);
    AppMemberDto.Response getMemberByPhoneNumber(String phoneNumber);
    void updatePassword(Long memberId, String newPassword);

    AppMemberDto.Response getMemberByMemberId(String memberId);
    boolean checkPassword(Long memberId, String currentPassword);

}
