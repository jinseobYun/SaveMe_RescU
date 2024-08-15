package com.ssafy.smru.service.app;

import com.ssafy.smru.dto.app.EmergencyContactDto;
import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.app.EmergencyContact;
import com.ssafy.smru.exception.ResourceConflictException;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.repository.app.EmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

// 비상연락망 서비스
@Service
@RequiredArgsConstructor
public class EmergencyContactService {

    // 비상연락망 레퍼지토리 의존성 주입
    private final EmergencyContactRepository emergencyContactRepository;

    // 어플 사용자 레퍼지토리 의존성 주입
    private final AppMemberRepository appMemberRepository;


    // 유저 Id를 받아와 유저의 전체 비상 연락망을 조회

    @Transactional(readOnly = true) // 읽기전용으로 설정
    public List<EmergencyContactDto.Response> getEmergencyContactsByMemberId(String memberId) {
        //  DB에 member가 없는 경우 예외 처리
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new UnauthorizedException("등록된 사용자가 아닙니다."));

        // DB에서 유저의 비상연락망을 전체 조회
        List<EmergencyContact> emergencyContacts = emergencyContactRepository.findByAppMember_MemberId(memberId);
        // 비상연락망 리스트가 비어있으면 ResoucreNotFound 예외처리
        if (emergencyContacts.isEmpty()) {
            return null;
        }
        // dto로 변환 후 return
        return emergencyContacts.stream()
                .map(EmergencyContactDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // 앱 사용자의 비상연락망 추가
    public EmergencyContactDto.Response createEmergencyContact(String memberId, EmergencyContactDto.Request request) {
        // DB에 member가 없는 경우 예외 처리
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new UnauthorizedException("등록된 사용자가 아닙니다."));

        // 휴대폰 번호로 이미 등록되어 있는지 DB에 조회
        Optional<EmergencyContact> emergencyContacts = emergencyContactRepository.findByPhoneNumberAndAppMember(request.getPhoneNumber(), appMember);
        // 기존의 비상연락망이 있는 경우 예외처리
        emergencyContacts.ifPresent(e-> {
            throw new ResourceConflictException("이미 등록된 휴대폰 번호입니다.");
        });
        // 비상연락망 DTO 와 앱 사용자 정보를 이용해 비상연락망 Entity를 만들고
        EmergencyContact emergencyContact = request.toEntity(appMember);
        // DB 에 저장
        emergencyContact = emergencyContactRepository.save(emergencyContact);
        // Entity로 변환후 리턴해줌
        return EmergencyContactDto.Response.fromEntity(emergencyContact);
    }

    // 비상연락망 고유 아이디와 비상연락망 객체를 받아와 수정
    public EmergencyContactDto.Response updateEmergencyContact(Long emergencyContactId, EmergencyContactDto.Request request, String memberId) {
        // 비상연락망 고유 아이디로 DB 에서 조회 후 없으면 예외처리 
        EmergencyContact emergencyContact = emergencyContactRepository.findById(emergencyContactId)
                .orElseThrow(() -> new ResourceNotFoundException("비상연락망이 존재하지 않습니다."));
        
        // 사용자 아이디로 DB에서 조회 후 없으면 예외처리
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(()-> new UnauthorizedException("등록된 사용자가 아닙니다."));

        // 비상연락망을 등록한 사용자와 현재 수정하려는 사용자와 비교 후
        // 다른 경우 예외처리
        if (!emergencyContact.getAppMember().equals(appMember)) {
            throw new UnauthorizedException("해당 정보를 수정할 권한이 없습니다.");
        }

            
        // 비상연락망 수정 후
        emergencyContact.changeRelation(request.getRelation());
        emergencyContact.changePhoneNumber(request.getPhoneNumber());

        // 저장
        emergencyContact = emergencyContactRepository.save(emergencyContact);

        // Dto로 변환 후 return
        return EmergencyContactDto.Response.fromEntity(emergencyContact);
    }

    // 비상연락망 삭제
    public void deleteEmergencyContact(Long emergencyContactId, String memberId) {

        // 비상연락망 고유 ID 로 DB 에서 조회
        // 없는 경우 예외 처리
        EmergencyContact emergencyContact = emergencyContactRepository.findById(emergencyContactId)
                .orElseThrow(() -> new ResourceNotFoundException("비상연락망이 존재하지 않습니다."));

        // 사용자 아이디로 DB에서 조회 후 없으면 예외처리
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(()-> new UnauthorizedException("등록된 사용자가 아닙니다."));

        if (!emergencyContact.getAppMember().equals(appMember)) {
            throw new UnauthorizedException("해당 정보를 삭제할 권한이 없습니다.");
        }

        emergencyContactRepository.delete(emergencyContact);
    }

}
