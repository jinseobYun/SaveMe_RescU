package com.ssafy.smru.service;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.app.AppMemberRegisterDto;
import com.ssafy.smru.security.TokenInfo;

public interface AppMemberService {
    void register(AppMemberRegisterDto.Request dto);
    TokenInfo login(AppMemberDto.Request dto);
    boolean checkMemberIdDuplicate(String memberId);
    AppMemberDto.Response getMemberByPhoneNumber(String phoneNumber);
    void updatePassword(String memberId, String newPassword);
    AppMemberDto.Response getMemberByMemberId(String memberId);
    boolean checkPasswordMatchMemberId(String memberId, String currentPassword);
    boolean checkPhoneNumberDuplicate(String phone);

    void updatePhoneNumber(String currentUserName, String phone);
}
