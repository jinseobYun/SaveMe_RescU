package com.ssafy.smru.service;

import com.ssafy.smru.dto.GeoCoderResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GeoCoderApiService {

    // kakao api key 설정
    @Value("${kakao.api.key}")
    private String apiKey;

    // RestTemplate 로 API 요청
    private final RestTemplate restTemplate;

    // 카카오 api 주소
    @Value("${kakao.geoCoder.url}")
    private String baseURL;


    public GeoCoderApiService() {
        this.restTemplate = new RestTemplate();
    }

    // 위도 경도로 지번 ,도로명 주소 반환해주는 API
    public GeoCoderResponseDto getDirections(String latitude, String longitude) {
        String uriString = UriComponentsBuilder.fromHttpUrl(baseURL)
                .queryParam("input_coord", "WGS84")
                .queryParam("x", longitude)
                .queryParam("y", latitude)
                .toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<GeoCoderResponseDto> response = restTemplate.exchange(
                uriString,
                HttpMethod.GET,
                entity,
                GeoCoderResponseDto.class
        );

        return response.getBody();
    }
}
