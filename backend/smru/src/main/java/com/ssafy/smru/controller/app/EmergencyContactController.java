package com.ssafy.smru.controller.app;


import com.ssafy.smru.dto.app.EmergencyContactDto;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.service.app.EmergencyContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/v1/app/emergency-info")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService emergencyContactService;

    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername();
        }
        throw new UnauthorizedException("사용자가 인증되지 않았습니다.");
    }

    @GetMapping
    public ResponseEntity<?> getEmergencyContacts() {
        try {
            String memberId = getAuthenticatedUserId();
            List<EmergencyContactDto.Response> contacts = emergencyContactService.getEmergencyContactsByMemberId(memberId);
            return new ResponseEntity<List<EmergencyContactDto.Response>>(contacts, HttpStatus.OK);
        }catch (ResourceNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEmergencyContact(@RequestBody EmergencyContactDto.Request request) {
        try {
            String memberId = getAuthenticatedUserId();
            emergencyContactService.createEmergencyContact(memberId, request);
            return new ResponseEntity<>("비상연락망이 정상적으로 등록되었습니다.",HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{emergencyContactId}")
    public ResponseEntity<?> updateEmergencyContact(@PathVariable("emergencyContactId") Long emergencyContactId, @RequestBody EmergencyContactDto.Request request) {
        try {
            String memberId = getAuthenticatedUserId();
            emergencyContactService.updateEmergencyContact(emergencyContactId, request, memberId);
            return new ResponseEntity<>("비상연락망을 정상적으로 수정했습니다.",HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteEmergencyContact(@RequestParam Long emergencyContactId) {
        try {
            if(emergencyContactId  == null) {
                return new ResponseEntity<>("잘못된 요청입니다.",HttpStatus.BAD_REQUEST);
            }
            String memberId = getAuthenticatedUserId();
            emergencyContactService.deleteEmergencyContact(emergencyContactId, memberId);
            return new ResponseEntity<>("비상연락망을 정상적으로 삭제했습니다.",HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("처리 중 서버에서 오류가 발생했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}