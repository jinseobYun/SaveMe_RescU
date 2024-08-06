package com.ssafy.smru.service;


import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.GeoCoderResponseDto;
import com.ssafy.smru.dto.ReportInfoDto;
import com.ssafy.smru.dto.app.MedicalInformationDto;
import com.ssafy.smru.entity.RescueTeam;
import com.ssafy.smru.repository.RescueTeamRepository;
import com.ssafy.smru.service.app.MedicalInformationService;
import com.ssafy.smru.util.DistanceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

// 신고 시작시 환자 정보 전달 서비스
@Service
@RequiredArgsConstructor
public class ReportInfoService {


    private final AppMemberService appMemberService;
    private final MedicalInformationService medicalInformationService;
    private final GeoCoderApiService geoCoderApiService;
    private final RescueTeamRepository rescueTeamRepository;


    public ReportInfoDto.Response getReportInfo(String patientId, String reporterID, String lat, String lon ){

        // 신고 시각
        ZonedDateTime currentTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = currentTime.format(formatter);
        System.out.println("------------신고시각---------");
        // 환자 회원 정보
        AppMemberDto.Response patient = appMemberService.getMemberByMemberId(patientId);
        System.out.println("------------환자 id---------");
        // 환자 의료 정보
        MedicalInformationDto.Response patientMedicalInformation = medicalInformationService.getMedicalInformationByMemberId(patientId);
        System.out.println("------------환자 의료정보---------");
        // 환자 response data 담기
        MedicalInformationDto.ReportInfoResponse patientTotalInfo = MedicalInformationDto
                .ReportInfoResponse
                .writeReportInfoResponse(patientMedicalInformation,patient);
        System.out.println("------------환자 의료정보 합체---------");
        // 신고자 회원 정보
        AppMemberDto.Response reporter = appMemberService.getMemberByMemberId(reporterID);
        System.out.println("------------신고자 id---------");
        // 신고자 의료 정보
        MedicalInformationDto.Response reporterMedicalInformation = medicalInformationService.getMedicalInformationByMemberId(reporterID);
        System.out.println("------------신고자 의료정보---------");
        // 신고자 response data 담기
        MedicalInformationDto.ReportInfoResponse reporterTotalInfo = MedicalInformationDto
            .ReportInfoResponse
            .writeReportInfoResponse(reporterMedicalInformation,reporter);
        System.out.println("------------신고자 의료정보 합체---------");
        // 신고자 위치 기준 도로명, 지번 주소 요청 API 처리
        GeoCoderResponseDto callGeoCoderApi = geoCoderApiService.getDirections(lat,lon);
        String roadNameAddress = "주소를 찾을 수 없습니다.";
        String lotNumberAddress = "주소를 찾을 수 없습니다.";
        if(callGeoCoderApi != null && !callGeoCoderApi.getDocuments().isEmpty()) {
            roadNameAddress = callGeoCoderApi.getDocuments().get(0).getRoadAddress().getAddressName();
            lotNumberAddress = callGeoCoderApi.getDocuments().get(0).getAddress().getAddressName();
            System.out.println("------------신고자 위치 기준 도로명 지번 ---------");
        }

        // 신고자 위치 기준 주변 119 관할센터 정보
        List<RescueTeam> rescueTeams = findNearestResqueTeams(lat,lon);
        System.out.println("------------신고자 주변 119---------");
        // 응급실 데이터 처리

        return ReportInfoDto.Response.builder()
                .latitude(lat)
                .longitude(lon)
                .reportedTime(formattedTime)
//                .응급실 정보 담기
                .reporterName(reporter.getMemberName())
                .reporterPhone(reporter.getPhone())
//                .신고 디테일..?
                .rescueTeams(rescueTeams)
                .lotNumberAddress(lotNumberAddress)
                .roadNameAddress(roadNameAddress)
                .patientMedicalInformation(patientTotalInfo)
                .reporterMedicalInformation(reporterTotalInfo)
                .build();

    }


    // 주변 119 관할센터 구하기
    public List<RescueTeam> findNearestResqueTeams(String lat, String lon) {
        BigDecimal latitude = new BigDecimal(lat);
        BigDecimal longitude = new BigDecimal(lon);
        List<RescueTeam> rescueTeams = rescueTeamRepository.findAll();
        return rescueTeams.stream()
                .sorted(Comparator.comparing(rescueTeam -> DistanceUtil.calculateDistance(
                        latitude,
                        longitude,
                        new BigDecimal(rescueTeam.getLatitude()),
                        new BigDecimal(rescueTeam.getLongitude())
                )))
                .limit(5)
                .map(rescueTeam -> new RescueTeam(
                        rescueTeam.getRescueTeamId(),
                        rescueTeam.getTeamName(),
                        rescueTeam.getAddress(),
                        rescueTeam.getLatitude(),
                        rescueTeam.getLongitude(),
                        rescueTeam.getTel(),
                        DistanceUtil.calculateDistance(
                                latitude,
                                longitude,
                                new BigDecimal(rescueTeam.getLatitude()),
                                new BigDecimal(rescueTeam.getLongitude())
                        )
                ))
                .collect(Collectors.toList());
    }


}
