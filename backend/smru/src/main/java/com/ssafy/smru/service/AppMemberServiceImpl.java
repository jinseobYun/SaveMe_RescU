package com.ssafy.smru.service;

import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.app.AppMemberRegisterDto;
import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.exception.ResourceConflictException;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.security.AppJwtProvider;
import com.ssafy.smru.security.TokenInfo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class AppMemberServiceImpl implements AppMemberService {
    private final AppMemberRepository appMemberRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final AppJwtProvider appJwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(AppMemberRegisterDto.Request dto) {
        //--- 1. 회원가입 입력 유효성 검사
        //validateMemberSignUpDto(dto);
        //--- 2. id 생성 후 저장


        if(checkPhoneNumberDuplicate(dto.getPhone())){
            throw new ResourceConflictException("같은 휴대폰 번호로 가입한 회원이 존재합니다.");
        }

        if(!checkMemberIdDuplicate(dto.getMemberId())){
            throw new ResourceConflictException("같은 아이디로 가입한 회원이 존재합니다.");
        }

        AppMember appMember = dto.toEntity();
        appMember.changePassword(passwordEncoder.encode(appMember.getPassword()));
        appMemberRepository.save(appMember);


    }

    @Override
    @Transactional
    public TokenInfo login(AppMemberDto.Request dto) {

        //--- 1. ID, 암호화된 PW를 기반으로 Authentication 객체 생성
        // 이 때 authentication 은 인증 여부를 확인하는 authenticated 값이 false 로 설정되어있음.
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken("app:"+dto.getMemberId(), dto.getPassword());
        //--- 2. 실제 검증 과정 (사용자 비밀번호 확인)
        // authenticate 함수가 실행되면, CustomUserDetailsService 에서 구현한 loadUserByUsername 함수가 자동으로 실행 됨.
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        AppMember appMember = appMemberRepository.findByMemberId(dto.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 일치하지 않습니다."));
        //--- 3. 인증 정보를 기반으로 JWT 생성
        return appJwtProvider.generateToken(authentication, appMember.getAppMemberId());
    }


    // 아이디 중복확인 매서드
    @Override
    public boolean checkMemberIdDuplicate(String memberId) {
        return appMemberRepository.findByMemberId(memberId).isEmpty();
    }



    // 회원가입 인증시 휴대폰번호로
    @Override
    public AppMemberDto.Response getMemberByPhoneNumber(String phoneNumber) {
        AppMember appMember = appMemberRepository.findByPhone(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException(""));
        return AppMemberDto.Response.fromEntity(appMember);
    }


    // 아이디 찾기시 입력값으로 member조회
    @Override
    public AppMemberDto.Response getMemberByPhoneNumberAndMemberName(String phoneNumber,String memberName) {
        AppMember appMember = appMemberRepository.findByPhoneAndMemberName(phoneNumber,memberName)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        return AppMemberDto.Response.fromEntity(appMember);
    }

    @Override
    public AppMemberDto.Response getMemberByPhoneNumberAndMemberIdAndMemberName(String phoneNumber, String memberId, String memberName) {
        AppMember appMember = appMemberRepository.findByPhoneAndMemberIdAndMemberName(phoneNumber,memberId,memberName)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        return AppMemberDto.Response.fromEntity(appMember);
    }


    @Override
    public AppMemberDto.Response getMemberByMemberId(String memberId) {
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 ID로 등록된 사용자가 없습니다."));
        return AppMemberDto.Response.fromEntity(appMember);
    }


    @Override
    @Transactional
    public void updatePassword(String memberId, String newPassword) {

        AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        member.changePassword(passwordEncoder.encode(newPassword));
        appMemberRepository.save(member);
    }

    @Override
    public boolean checkPasswordMatchMemberId(String memberId, String currentPassword) {
        AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        return passwordEncoder.matches(currentPassword, member.getPassword());
    }

    @Override
    public boolean checkPhoneNumberDuplicate(String phone) {
        return appMemberRepository.findByPhone(phone).isPresent();
    }


    @Override
    public void updatePhoneNumber(String memberId, String newPhoneNumber) {
        AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        if(checkPhoneNumberDuplicate(newPhoneNumber)){
            throw new ResourceConflictException("이미 등록된 휴대폰 번호입니다.");
        }
        member.changePhone(newPhoneNumber);
        appMemberRepository.save(member);
    }
}
