package com.ssafy.smru.security;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.WebMember;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.repository.WebMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Slf4j
@Service
@RequiredArgsConstructor
public class MemberDetailsService implements UserDetailsService {
    private final AppMemberRepository appMemberRepository;
    private final WebMemberRepository webMemberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
        UserDetails userDetails = null;
        if (memberId.startsWith("app:")) {
            memberId = memberId.substring(4);
            AppMember member = appMemberRepository.findByMemberId(memberId)
                    .orElseThrow(() -> new UnauthorizedException("아이디 또는 비밀번호가 일치하지 않습니다."));
            userDetails = createUserDetails(member);
        } else {
            memberId = memberId.substring(4);
            WebMember member = webMemberRepository.findByMemberId(memberId)
                    .orElseThrow(() -> new UnauthorizedException("아이디 또는 비밀번호가 일치하지 않습니다."));
            userDetails = createUserDetails(member);
        }
        return userDetails;
    }

    private UserDetails createUserDetails(AppMember member) {
        log.info(member.toString());
        return User.builder()
                .username(member.getUsername())
                .password(member.getPassword())
                .build();
    }
    private UserDetails createUserDetails(WebMember member) {
        log.info(member.toString());
        return User.builder()
                .username(member.getUsername())
                .password(member.getPassword())
                .roles(member.getRoleId() + "")
                .build();
    }
}