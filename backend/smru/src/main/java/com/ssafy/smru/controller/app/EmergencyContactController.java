package com.ssafy.smru.controller.app;


import com.ssafy.smru.dto.app.EmergencyContactDto;
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

    @GetMapping
    public ResponseEntity<?> getEmergencyContacts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            memberId = userDetails.getUsername();
            System.out.println(memberId);

        }
        List<EmergencyContactDto.Response> findList = emergencyContactService.getEmergencyContactsByMemberId(memberId);

        return new ResponseEntity<List<EmergencyContactDto.Response>>(findList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?>  createEmergencyContact(@RequestBody EmergencyContactDto.Request request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String memberId = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            memberId = userDetails.getUsername();
        }
        emergencyContactService.createEmergencyContact(memberId, request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{emergencyContactId}")
    public ResponseEntity<?> updateEmergencyContact(@PathVariable("emergencyContactId") Long emergencyContactId, @RequestBody EmergencyContactDto.Request request) {
        emergencyContactService.updateEmergencyContact(emergencyContactId, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteEmergencyContact(@RequestParam Long emergencyContactId) {
        try {
            emergencyContactService.deleteEmergencyContact(emergencyContactId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
