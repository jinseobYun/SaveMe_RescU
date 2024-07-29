package com.ssafy.smru.security;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.WebMember;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.repository.WebMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Slf4j
public class WebMemberDetailService implements UserDetailsService {
    private final WebMemberRepository webMemberRepository;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
        WebMember member = webMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다. 다시 시도해주세요."));
        UserDetails userDetails = createUserDetails(member);
        return userDetails;
    }

    private UserDetails createUserDetails(WebMember member) {
        return User.builder()
                .username(member.getMemberId())
                .password(member.getPassword())
                //.roles(admin.getRoles().toArray(new String[0]))
                .build();
    }
}
