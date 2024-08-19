package com.ssafy.smru.controller.elasticsearch;

import com.ssafy.smru.entity.app.CdInfoEs;
import com.ssafy.smru.entity.app.MedicineEs;
import com.ssafy.smru.service.elasticsearch.CdinfoService;
import com.ssafy.smru.service.elasticsearch.ElasticSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/app")
@RequiredArgsConstructor
public class ElasticSearchController {

    private final ElasticSearchService elasticSearchService;

    private final CdinfoService cdinfoService;

    @GetMapping("/search")
    public ResponseEntity<?> searchByMedicineName(@RequestParam String medicineName) {
        if (medicineName == null || medicineName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청입니다.");
        }
        try {

            List<MedicineEs> medicineList = elasticSearchService.searchByMedicineName(medicineName);

            return new ResponseEntity<>(medicineList,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/search-2")
    public ResponseEntity<?> searchByCdName(@RequestParam String cdName) {
        if (cdName == null || cdName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청입니다.");
        }
        try {
            List<CdInfoEs> cdInfoList = cdinfoService.searchByCdName(cdName);

            return new ResponseEntity<>(cdInfoList,HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
