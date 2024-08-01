// MedicalInformationController.java
package com.ssafy.smru.controller.app;

import com.ssafy.smru.dto.app.MedicalInformationDto;
import com.ssafy.smru.exception.EntityExistsException;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.exception.UnauthorizedException;
import com.ssafy.smru.service.app.MedicalInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/app/medical-info")
@RequiredArgsConstructor
public class MedicalInformationController {

    private final MedicalInformationService medicalInformationService;

    @GetMapping
    public ResponseEntity<?> getMedicalInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = authentication.getName();
        try {
            MedicalInformationDto.Response  response = medicalInformationService.getMedicalInformationByMemberId(memberId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버에서 오류가 발생했습니다.");
        }
    }


    @PostMapping
    public ResponseEntity<?> createMedicalInformation(@RequestBody MedicalInformationDto.Request request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        try {
            request.setMemberId(currentUserName);
            medicalInformationService.createMedicalInformation(request);
            return new ResponseEntity<>("의료정보 등록에 성공했습니다.", HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping
    public ResponseEntity<?> updateMedicalInformation(@RequestBody MedicalInformationDto.Request request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = authentication.getName();
        try {
            medicalInformationService.modifyMedicalInformation(memberId,request);

            return ResponseEntity.ok("의료 정보가 성공적으로 수정되었습니다.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버에서 오류가 발생했습니다.");
        }
    }


    @DeleteMapping
    public ResponseEntity<?> deleteMedicalInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = authentication.getName();
        try {
            medicalInformationService.deleteRequestProcess(memberId);

            return ResponseEntity.ok("의료 정보가 성공적으로 삭제되었습니다.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버에서 오류가 발생했습니다.");
        }
    }
}

