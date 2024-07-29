package com.ssafy.smru.service;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.security.AppJwtProvider;
import com.ssafy.smru.security.TokenInfo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppMemberServiceImpl implements AppMemberService {
    private final AppMemberRepository appMemberRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final AppJwtProvider appJwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public int register(AppMemberDto.Request dto) {
        //--- 1. 회원가입 입력 유효성 검사
        //validateMemberSignUpDto(dto);
        //--- 2. id 생성 후 저장
        try {
            AppMember appMember = dto.toEntity();
            appMember.changePassword(passwordEncoder.encode(appMember.getPassword()));
            appMemberRepository.save(appMember);
            return 0;
        } catch (DataIntegrityViolationException e) {
            return 1;
        } catch (Exception e) {
            return 2;
        }
    }

    @Override
    @Transactional
    public TokenInfo login(AppMemberDto.Request dto) {
        //--- 1. ID, 암호화된 PW를 기반으로 Authentication 객체 생성
        // 이 때 authentication 은 인증 여부를 확인하는 authenticated 값이 false 로 설정되어있음.
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(dto.getMemberId(), dto.getPassword());
        //--- 2. 실제 검증 과정 (사용자 비밀번호 확인)
        // authenticate 함수가 실행되면, CustomUserDetailsService 에서 구현한 loadUserByUsername 함수가 자동으로 실행 됨.
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        AppMember appMember = appMemberRepository.findByMemberId(dto.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "입력된 정보와 일치하는 사용자가 없습니다."));
        System.out.println(appMember);
        //--- 3. 인증 정보를 기반으로 JWT 생성
        return appJwtProvider.generateToken(authentication, appMember.getAppMemberId());
    }

}
