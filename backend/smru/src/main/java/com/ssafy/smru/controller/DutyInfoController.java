package com.ssafy.smru.controller;

import com.ssafy.smru.dto.HospitalDTO;
import com.ssafy.smru.service.DutyInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/web")
@RequiredArgsConstructor
public class DutyInfoController {

    private final DutyInfoService dutyInfoService;

    @GetMapping("/nearest-hospitals")
    public ResponseEntity<?> getNearestHospitals(@RequestParam String lat, @RequestParam String lon) {
        if (lat == null || lon == null) {
            return ResponseEntity.badRequest().body("입력 값을 확인하세요");
        }
        try {
            List<HospitalDTO> hospitals = dutyInfoService.findNearestHospitals(lat, lon);
            if(hospitals!= null && !hospitals.isEmpty()){
                hospitals = dutyInfoService.addEmergencyRoomInfoToHospitals(hospitals);
            }
            return ResponseEntity.ok(hospitals);
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("유효한 좌표 값을 입력하세요");
        }
    }


}
