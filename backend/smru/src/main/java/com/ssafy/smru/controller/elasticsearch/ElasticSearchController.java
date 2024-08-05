package com.ssafy.smru.controller.elasticsearch;

import com.ssafy.smru.entity.app.MedicineEs;
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
@RequestMapping("/api/v1/app/search")
@RequiredArgsConstructor
public class ElasticSearchController {

    private final ElasticSearchService elasticSearchService;


    @GetMapping
    public ResponseEntity<?> searchByMedicineName(@RequestParam String medicineName) {
        try {
            System.out.println("------------------inES-------------------");

            Long start = System.currentTimeMillis();
            List<MedicineEs> medicineList = elasticSearchService.searchByMedicineName(medicineName);
            Long end = System.currentTimeMillis();
            System.out.println(end-start);

            return new ResponseEntity<>(medicineList,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
