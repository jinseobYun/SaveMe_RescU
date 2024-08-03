package com.ssafy.smru.service.app;

import com.ssafy.smru.dto.app.EmergencyContactDto;
import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.app.EmergencyContact;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.repository.app.EmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyContactService {

    private final EmergencyContactRepository emergencyContactRepository;
    private final AppMemberRepository appMemberRepository;


    // 유저 Id를 받아와 유저의 전체 비상 연락망을 조회
    public List<EmergencyContactDto.Response> getEmergencyContactsByMemberId(String memberId) {
        List<EmergencyContact> emergencyContacts = emergencyContactRepository.findByAppMember_MemberId(memberId);
        if (emergencyContacts.isEmpty()) {
            throw new ResourceNotFoundException("비상연락망이 존재하지 않습니다.");
        }
        return emergencyContacts.stream()
                .map(EmergencyContactDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // 유저 아이디로 appMember Entity 불러와 연락처, 관계를 합쳐 EmergencyContact Entity를 만들고 Db에 저장
    public EmergencyContactDto.Response createEmergencyContact(String memberId, EmergencyContactDto.Request request) {
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("등록된 사용자가 아닙니다."));

        EmergencyContact emergencyContact = request.toEntity(appMember);
        emergencyContact = emergencyContactRepository.save(emergencyContact);

        return EmergencyContactDto.Response.fromEntity(emergencyContact);
    }

    // 비상연락망 고유 아이디와 비상연락망 객체를 받아와 수정
    public EmergencyContactDto.Response updateEmergencyContact(Long emergencyContactId, EmergencyContactDto.Request request, String memberId) {
        EmergencyContact emergencyContact = emergencyContactRepository.findById(emergencyContactId)
                .orElseThrow(() -> new ResourceNotFoundException("비상연락망이 존재하지 않습니다."));

        if (!emergencyContact.getAppMember().getMemberId().equals(memberId)) {
            throw new UnauthorizedException("해당 정보를 수정할 권한이 없습니다.");
        }

        emergencyContact.changeRelation(request.getRelation());
        emergencyContact.changePhoneNumber(request.getPhoneNumber());

        emergencyContact = emergencyContactRepository.save(emergencyContact);

        return EmergencyContactDto.Response.fromEntity(emergencyContact);
    }

    public void deleteEmergencyContact(Long emergencyContactId, String memberId) {
        EmergencyContact emergencyContact = emergencyContactRepository.findById(emergencyContactId)
                .orElseThrow(() -> new ResourceNotFoundException("비상연락망이 존재하지 않습니다."));

        if (!emergencyContact.getAppMember().getMemberId().equals(memberId)) {
            throw new UnauthorizedException("해당 정보를 삭제할 권한이 없습니다.");
        }

        emergencyContactRepository.delete(emergencyContact);
    }

}
