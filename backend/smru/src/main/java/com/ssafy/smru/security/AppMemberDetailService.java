package com.ssafy.smru.security;

import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.repository.AppMemberRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Slf4j
public class AppMemberDetailService implements UserDetailsService {
    @Autowired
    private AppMemberRepository appMemberRepository;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
    	AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다. 다시 시도해주세요."));
    	UserDetails userDetails = createUserDetails(member);
        return userDetails;
    }

    private UserDetails createUserDetails(AppMember member) {
        log.info(member.toString());
        return User.builder()
                .username(member.getUsername())
                .password(member.getPassword())
                //.roles(admin.getRoles().toArray(new String[0]))
                .build();
    }
}
