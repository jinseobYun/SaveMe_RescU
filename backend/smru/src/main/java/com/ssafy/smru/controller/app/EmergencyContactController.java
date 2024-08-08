package com.ssafy.smru.controller.app;


import com.ssafy.smru.dto.app.EmergencyContactDto;
import com.ssafy.smru.exception.ResourceConflictException;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.service.app.EmergencyContactService;
import com.ssafy.smru.util.RegularExpression;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/app/emergency-info")
@RequiredArgsConstructor
public class EmergencyContactController {


    private final EmergencyContactService emergencyContactService;

    private RegularExpression regularExpression = new RegularExpression();

    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername();
        }
        throw new UnauthorizedException("인증된 사용자가 아닙니다.");
    }

    @GetMapping
    public ResponseEntity<?> getEmergencyContacts() {
        try {
            String memberId = getAuthenticatedUserId();
            List<EmergencyContactDto.Response> contacts = emergencyContactService.getEmergencyContactsByMemberId(memberId);
            if (contacts == null || contacts.isEmpty()) {
                return new ResponseEntity<>("등록된 비상연락망이 없습니다.", HttpStatus.OK);
            }
            return new ResponseEntity<>(contacts, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEmergencyContact(@RequestBody EmergencyContactDto.Request request) {
        try {
            // 인증된 memberId 불러오기
            String memberId = getAuthenticatedUserId();

            // 휴대폰 번호 입력 검증
            if (!regularExpression.isPhone(request.getPhoneNumber())) {
                return new ResponseEntity<>("올바르지 않은 형식의 데이터입니다.", HttpStatus.BAD_REQUEST);
            }

            // 비상연락망 저장
            EmergencyContactDto.Response response = emergencyContactService.createEmergencyContact(memberId, request);
            Map<String,Object> map = new HashMap<>();
            map.put("message", "비상연락망이 정상적으로 등록되었습니다.");
            map.put("emergencyContactId", response.getEmergencyContactId());
            return new ResponseEntity<>(map, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ResourceConflictException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{emergencyContactId}")
    public ResponseEntity<?> updateEmergencyContact(@PathVariable("emergencyContactId") Long emergencyContactId, @RequestBody EmergencyContactDto.Request request) {
        try {
            String memberId = getAuthenticatedUserId();

            // 휴대폰 번호 입력 검증
            if (!regularExpression.isPhone(request.getPhoneNumber())) {
                return new ResponseEntity<>("올바르지 않은 형식의 데이터입니다.", HttpStatus.BAD_REQUEST);
            }
            emergencyContactService.updateEmergencyContact(emergencyContactId, request, memberId);
            return new ResponseEntity<>("비상연락망을 정상적으로 수정했습니다.", HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteEmergencyContact(@RequestParam Long emergencyContactId) {
        if (emergencyContactId == null) {
            return new ResponseEntity<>("잘못된 요청입니다.", HttpStatus.BAD_REQUEST);
        }
        try {

            String memberId = getAuthenticatedUserId();
            emergencyContactService.deleteEmergencyContact(emergencyContactId, memberId);
            return new ResponseEntity<>("비상연락망을 정상적으로 삭제했습니다.", HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}