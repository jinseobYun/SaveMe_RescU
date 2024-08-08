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


    public ReportInfoDto.Response getReportInfo(String patientId, String reporterID, String lat, String lon) {

        // 신고 시각
        // 서울 시간 기준 현재 시간 저장
        // 출력 포맷 설정
        ZonedDateTime currentTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = currentTime.format(formatter);

        // 신고자 위치 기준 도로명, 지번 주소 요청 API 처리
        GeoCoderResponseDto callGeoCoderApi = geoCoderApiService.getDirections(lat, lon);
        // 주소를 찾을 수 없는 경우 기본 값
        String roadNameAddress = "주소를 찾을 수 없습니다.";
        String lotNumberAddress = "주소를 찾을 수 없습니다.";
        // 주소가 있는 경우 업데이트 
        if (callGeoCoderApi != null && !callGeoCoderApi.getDocuments().isEmpty()) {
            roadNameAddress = callGeoCoderApi.getDocuments().get(0).getRoadAddress().getAddressName();
            lotNumberAddress = callGeoCoderApi.getDocuments().get(0).getAddress().getAddressName();
        }
        // 신고자 위치 기준 주변 119 관할센터 정보
        List<RescueTeam> rescueTeams = findNearestResqueTeams(lat, lon);

        // 신고자, 태깅 정보 외 정보로 신고 정보 Dto 생성
        ReportInfoDto.Response reportInfoDto = ReportInfoDto.Response.builder()
                .latitude(lat)
                .longitude(lon)
                .reportedTime(formattedTime)
                .rescueTeams(rescueTeams)
                .lotNumberAddress(lotNumberAddress)
                .roadNameAddress(roadNameAddress)
                .reporterName("신고자 정보 없음")
                .reporterPhone("등록된 번호 없음")
                .build();

        //  받아온 아이디로 DB 에서 조회
        AppMemberDto.Response patient = appMemberService.getMemberByMemberId(patientId);
        System.out.println( ":" + patient.isGender());
        // 태깅된 정보는 null 로 초기화 
        MedicalInformationDto.ReportInfoResponse taggingTotalInfo = new MedicalInformationDto.ReportInfoResponse();
        // 태깅된 아이디로 불러온 회원이 존재하면
        if (patient != null) {
            // 태깅 정보 업데이트 
            taggingTotalInfo.updateMember(patient);

            // 태깅된 ID로 의료정보 불러오기
            MedicalInformationDto.Response patientMedicalInformation = medicalInformationService.getMedicalInformationByMemberId(patientId);
            // 환자 의료 정보가 비어있지 않으면 태깅 정보를 업데이트
            if (patientMedicalInformation != null) {
                taggingTotalInfo = MedicalInformationDto
                        .ReportInfoResponse
                        .writeReportInfoResponse(patientMedicalInformation, patient);
            }

            reportInfoDto.setTaggingMedicalInformation(taggingTotalInfo);
        }

        // 환자 response data 담기

        // 신고자 회원 정보
        AppMemberDto.Response reporter = appMemberService.getMemberByMemberId(reporterID);
        System.out.println(reporter.isGender());

        MedicalInformationDto.ReportInfoResponse reporterTotalInfo = new MedicalInformationDto.ReportInfoResponse();
        if (reporter != null) {
            reporterTotalInfo.updateMember(reporter);

            MedicalInformationDto.Response reporterMedicalInformation = medicalInformationService.getMedicalInformationByMemberId(reporterID);
            if (reporterMedicalInformation != null) {
                reporterTotalInfo = MedicalInformationDto
                        .ReportInfoResponse
                        .writeReportInfoResponse(reporterMedicalInformation, reporter);
            }
        
            reportInfoDto.setReporterName(reporter.getMemberName());
            reportInfoDto.setReporterPhone(reporter.getPhoneNumber());

            reportInfoDto.setReporterMedicalInformation(reporterTotalInfo);

        }

        return reportInfoDto;

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
