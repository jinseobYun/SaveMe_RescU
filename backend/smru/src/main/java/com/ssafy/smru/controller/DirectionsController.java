package com.ssafy.smru.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.smru.exception.ApiException;
import com.ssafy.smru.service.DirectionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;


@RestController
@RequestMapping("/api/v1/web")
@RequiredArgsConstructor
public class DirectionsController {

    private final DirectionsService directionsService;

    // 일대일, 일대다 거리 정보 요청 처리

    // 일대일로 좌표를 받아 거리 정보 반환
    @GetMapping("/directions")
    public Mono<ResponseEntity<String>> getDirections(
            @RequestParam String originX,
            @RequestParam String originY,
            @RequestParam String destinationX,
            @RequestParam String destinationY) {
        // 비어있는 경우
        if (originX == null || originY == null || destinationX == null || destinationY == null || originX.trim().isEmpty() || originY.trim().isEmpty() || destinationX.trim().isEmpty() || destinationY.trim().isEmpty()){
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("입력 값을 확인하세요"));
        }
        // 위,경도를 소수점으로 변환하는 과정에서 오류 발생시 return
        try {
            BigDecimal x = new BigDecimal(originX);
            BigDecimal y = new BigDecimal(originY);
            BigDecimal z = new BigDecimal(destinationX);
            BigDecimal w = new BigDecimal(destinationY);
        }catch (Exception e){
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("입력 값을 확인하세요"));
        }

        // response에는 String으로 정보가 담겨있음
        return directionsService.getDirections(originX, originY, destinationX, destinationY)
                .map(response -> {
                    // string -> json으로 파싱하여 result_code를 확인
                    int resultCode = getResultCodeFromString(response);
                    // 정상 처리 코드 0 => response 보내기
                    if (resultCode == 0) {
                        return ResponseEntity.ok(response);
                    } else {
                        // 아닌 경우 응답 코드로 응답 메세지 받고 bad_request
                        String resultMsg = getResultMessage(resultCode);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultMsg);
                    }
                })
                // 에러를 반환 받으면 해당 에러의 statusCode 와 같이 메세지를 보냄 
                .onErrorResume(ApiException.class, ex -> Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage())));
    }

    // String 으로 된 JSON 문자열을 json으로 변환 후 결과 코드 반환 하는 매서드
    private int getResultCodeFromString(String string) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(string);
            return root.path("routes").get(0).path("result_code").asInt();
        } catch (Exception e) {
            throw new RuntimeException("JSON으로 변환화는 과정에서 오류 발생", e);
        }
    }

    // 카카오 API 에 나와있는 결과 코드
    private String getResultMessage(int resultCode) {
        switch (resultCode) {
            case 0: return "길찾기 성공";
            case 1: return "길찾기 결과를 찾을 수 없음";
            case 101: return "경유지 지점 주변의 도로를 탐색할 수 없음";
            case 102: return "시작 지점 주변의 도로를 탐색할 수 없음";
            case 103: return "도착 지점 주변의 도로를 탐색할 수 없음";
            case 104: return "출발지와 도착지가 5 m 이내로 설정된 경우 경로를 탐색할 수 없음";
            case 105: return "시작 지점 주변의 도로에 유고 정보(교통 장애)가 있음";
            case 106: return "도착 지점 주변의 도로에 유고 정보(교통 장애)가 있음";
            case 107: return "경유지 주변의 도로에 유고 정보(교통 장애)가 있음. result_message에 경유지의 순번이 표시되며 번호는 1번부터 시작함";
            case 201: return "다중 출발지: 출발지가 탐색 영역에 포함되지 않음";
            case 202: return "다중 출발지: 출발지 최대 개수 초과 도로 선택 실패";
            case 203: return "다중 출발지: 목적지 도로 선택 실패";
            case 204: return "다중 출발지: 경로 탐색 처리 시간 제한";
            case 205: return "다중 출발지: 출발지 주변의 유고 정보(교통 장애)로 인한 통행 불가";
            case 206: return "다중 출발지: 목적지 주변의 유고 정보(교통 장애)로 인한 통행 불가";
            case 207: return "다중 출발지: 출발지가 설정한 길찾기 반경 범위를 벗어남";
            case 301: return "다중 목적지: 출발지 도로 선택 실패";
            case 302: return "다중 목적지: 목적지 도로 선택 실패";
            case 303: return "다중 목적지: 목적지 최대 개수 초과로 인해 경로 탐색 실패";
            case 304: return "다중 목적지: 목적지가 설정한 길찾기 반경 범위를 벗어남";
            default: return "알 수 없는 오류";
        }
    }
}
