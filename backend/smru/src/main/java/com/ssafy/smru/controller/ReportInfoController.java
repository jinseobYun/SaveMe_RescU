package com.ssafy.smru.controller;


import com.ssafy.smru.dto.ReportInfoDto;
import com.ssafy.smru.service.ReportInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/app")
@RequiredArgsConstructor
public class ReportInfoController {


    private final ReportInfoService reportInfoService;

    @GetMapping("/dispatch-orders")
    private ResponseEntity<?> getGeo(@RequestParam("patientId") String patientId, @RequestParam("reporterId") String reporterId, @RequestParam("latitude") String latitude, @RequestParam("longitude") String longitude){
        try {
            ReportInfoDto.Response response = reportInfoService.getReportInfo(patientId, reporterId, latitude, longitude);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
