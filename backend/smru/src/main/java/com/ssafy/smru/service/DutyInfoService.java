package com.ssafy.smru.service;

import com.ssafy.smru.dto.HospitalDTO;
import com.ssafy.smru.entity.DutyInfo;
import com.ssafy.smru.repository.DutyInfoRepository;
import com.ssafy.smru.util.DistanceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DutyInfoService {

    private final DutyInfoRepository dutyInfoRepository;

    public List<HospitalDTO> findNearestHospitals(String lat, String lon) {
        BigDecimal latitude = new BigDecimal(lat);
        BigDecimal longitude = new BigDecimal(lon);
        List<DutyInfo> hospitals = dutyInfoRepository.findAll();
        return hospitals.stream()
                .sorted(Comparator.comparing(h -> DistanceUtil.calculateDistance(
                        latitude, 
                        longitude, 
                        h.getLatitude(),
                        h.getLongitude()
                )))
                .limit(5)
                .map(h -> new HospitalDTO(
                        h.getRnum(),
                        h.getDutyAddr(),
                        h.getDutyEmcls(),
                        h.getDutyEmclsName(),
                        h.getDutyName(),
                        h.getDutyTel1(),
                        h.getDutyTel3(),
                        h.getHpid(),
                        h.getPhpid(),
                        h.getLatitude(),
                        h.getLongitude(),
                        DistanceUtil.calculateDistance(latitude, longitude, h.getLatitude(),h.getLongitude()) +  " km"
                ))
                .collect(Collectors.toList());
    }
}
