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
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
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
    @Transactional
    public int register(WebMemberDto.Request dto) {
        try {
            // DTO를 엔티티로 변환
            WebMember webMember = dto.toEntity();

            // 역할 조회
            WebMemberRole role = webMemberRoleRepository.findById(1)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid role ID"));

            // 역할 설정
            webMember.changeRole(role);

            // 중복 ID 체크
            Optional<WebMember> existingMember = webMemberRepository.findByMemberId(dto.getMemberId());
            if (existingMember.isPresent()) {
                return 1; // 중복 ID가 존재하는 경우
            }

            // 비밀번호 암호화
            webMember.changePassword(passwordEncoder.encode(webMember.getPassword()));

            // 회원 정보 저장
            webMemberRepository.save(webMember);
            return 0; // 성공적으로 등록된 경우
        } catch (Exception e) {

            return 2; // 예기치 않은 오류 발생
        }
    }
    // 로그인
    @Override
    @Transactional
    public TokenInfo login(WebMemberDto.LoginRequest dto) {
        // 1. 아이디 비번 입력값 유효성 검사
        if(dto.getMemberId()==null||dto.getPassword()==null||dto.getPassword().trim().isEmpty()||
        dto.getMemberId().trim().isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"아이디 혹은 비번을 입력하지 않으셨습니다.");
        }
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken("web:"+dto.getMemberId(), dto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(token);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        WebMember webMember = webMemberRepository.findByMemberId(dto.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "입력된 정보와 일치하는 사용자가 없습니다."));

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

    // 멤버 전체 조회
    @Override
    public List<WebMemberDto.Response> getAllMembers() {
        List<WebMember> members = webMemberRepository.findAll();
        return members.stream()
                .map(WebMemberDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // 토큰에서 조회
    @Override
    public String getMembername(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = authentication.getName();
//        System.out.println("1. 토큰에서 멤버아이디값 : " + memberId);
        WebMember webmember = webMemberRepository.findByMemberId(memberId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 아이디 입니다 "));
        System.out.println(webmember.getMemberId());
        System.out.println(webmember.getName());
        return webmember.getName();

    }

}
