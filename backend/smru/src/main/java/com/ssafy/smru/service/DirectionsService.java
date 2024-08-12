package com.ssafy.smru.service;

import com.ssafy.smru.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

@Service
@PropertySource(value="classpath:/openAPI.properties")
public class DirectionsService {

    // kakao api key 설정
    @Value("${kakao.api.key}")
    private String apiKey;

    // WebClient 로 api 요청
    private final WebClient webClient;

    // 카카오 api 주소
    @Value("${kakao.api.url}")
    private String baseURL;

    // 길 찾기 api path
    @Value("${kakao.api.one.path}")
    private String onePath;

    // 다중 도착지 길찾기 api path
    @Value("${kakao.api.many.path}")
    private String manyPath;


    public DirectionsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // 하나의 출발지와 하나의 도착지상의 경로를 불러오는 API
    public Mono<String> getDirections(String latitudeA, String longitudeA, String latitudeB, String longitudeB) {
        // UriComponentsBuilder 로 httpUrl 을 생성 후 쿼리 파라미터 추가
        // 완성된 URI를 문자열로 만듦
        String uriString = UriComponentsBuilder.fromHttpUrl(baseURL + onePath)
                .queryParam("origin", longitudeA + "," + latitudeA)
                .queryParam("destination", longitudeB + "," + latitudeB)
                .queryParam("priority", "DISTANCE")
                .queryParam("avoid","ferries")
                .toUriString();

        // webClient 로 지정된 Uri에 get 요청
        // 헤더에 api key 와 content type : JSON 으로 설정
        // .retrieve 로 response 를 받아옴
        // onStatus => response 에서 상태 추출
        // 4xx , 5xx 에러의 경우 에러 메세지와 코드를 추출해서 에러 리턴
        // 정상 처리시 문자열로 리턴
        return webClient.get().uri(uriString)
                .header(HttpHeaders.AUTHORIZATION, "KakaoAK " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(body -> {
                            HttpStatusCode statusCode = response.statusCode();
                            return Mono.error(new ApiException(statusCode.value(), body));
                        }))
                .bodyToMono(String.class);
    }
}
