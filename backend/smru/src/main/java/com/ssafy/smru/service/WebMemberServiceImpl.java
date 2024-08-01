package com.ssafy.smru.service;

import com.ssafy.smru.dto.WebMemberDto;
import com.ssafy.smru.dto.WebPasswordChangeDto;
import com.ssafy.smru.entity.WebMember;
import com.ssafy.smru.entity.WebMemberRole;
import com.ssafy.smru.repository.WebMemberRepository;
import com.ssafy.smru.repository.WebMemberRoleRepository;
import com.ssafy.smru.security.TokenInfo;
import com.ssafy.smru.security.WebJwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebMemberServiceImpl implements WebMemberService {
    private final WebMemberRepository webMemberRepository;
    private final WebMemberRoleRepository webMemberRoleRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final WebJwtProvider webJwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public int register(WebMemberDto.Request dto) {
        //--- 1. 회원가입 입력 유효성 검사
        //validateMemberSignUpDto(dto);
        //--- 2. id 생성 후 저장
        try {
            WebMember webMember = dto.toEntity();
            System.out.println(webMember.getMemberId());
            System.out.println(webMember.getWebMemberId());
            WebMemberRole role = webMemberRoleRepository.findById(1)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid role ID"));
            webMember.changeRole(role);
            webMember.changePassword(passwordEncoder.encode(webMember.getPassword()));
            webMemberRepository.save(webMember);
            return 0;
        } catch (DataIntegrityViolationException e) {
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 2;
        }
    }
    // 로그인
    @Override
    @Transactional
    public TokenInfo login(WebMemberDto.LoginRequest dto) {
        //--- 1. ID, 암호화된 PW를 기반으로 Authentication 객체 생성
        // 이 때 authentication 은 인증 여부를 확인하는 authenticated 값이 false 로 설정되어있음.
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken("web:"+dto.getMemberId(), dto.getPassword());
        System.out.println("이게 토큰이야" + token);
        //--- 2. 실제 검증 과정 (사용자 비밀번호 확인)
        // authenticate 함수가 실행되면, CustomUserDetailsService 에서 구현한 loadUserByUsername 함수가 자동으로 실행 됨.
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(token);
        System.out.println(1);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        System.out.println(2);
        WebMember webMember = webMemberRepository.findByMemberId(dto.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "입력된 정보와 일치하는 사용자가 없습니다."));
        System.out.println(3);
        System.out.println(webMember);
        //--- 3. 인증 정보를 기반으로 JWT 생성
        return webJwtProvider.generateToken(authentication, webMember.getWebMemberId(), webMember.getRole().getRoleId());
    }

    // 비밀번호 변경
    @Override
    @Transactional
    public void changePassword(String memberId, WebPasswordChangeDto.Request dto){
        WebMember webMember = webMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저 "));

        if(!passwordEncoder.matches(dto.getCurrentPassword(),webMember.getPassword())){
            throw new IllegalArgumentException("현재 비밀번호와 다릅니다");
        }

        if(!dto.getNewPassword().equals(dto.getNewPasswordConfirm())){
            throw new IllegalArgumentException("새 비밀번호와 확인 비밀번호가 일치하지 않습니다");
        }
        webMember.changePassword(passwordEncoder.encode(dto.getNewPassword()));
        webMemberRepository.save(webMember);


    }

}