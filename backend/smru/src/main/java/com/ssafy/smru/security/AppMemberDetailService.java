package com.ssafy.smru.security;

import com.ssafy.smru.entity.AppMember;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomMemberDetailService implements UserDetailsService {
    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
    	AppMember member = memberMapper.member(id);
    	if (member == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"입력된 정보와 일치하는 사용자가 없습니다.");
    	UserDetails userDetails = createUserDetails(member);
        return userDetails;
    }

    private UserDetails createUserDetails(MemberDto member) {
        return User.builder()
                .username(member.getId())
                .password(member.getPassword())
                //.roles(admin.getRoles().toArray(new String[0]))
                .build();
    }
}
