package com.ssafy.smru.service;

import com.ssafy.smru.entity.EmergencyRoom;
import com.ssafy.smru.util.EmergencyRoomDomParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/openAPI.properties")
public class EmergencyRoomServiceImpl implements EmergencyRoomService {
    private final RedisTemplate<String, EmergencyRoom> redisTemplate;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final int TEMPO = 3600000;
    @Value("${emergency.api.key}")
    private String apiServiceKey;
    @Value("${emergency.api.url}")
    private String apiServiceUrl;
    @Override
    @Scheduled(fixedRate = TEMPO)
    public void getEmergencyRoomData() {
        String key = "EmergencyRoomList";

        // 1. 현재 Redis의 EmergencyRoom 목록을 비움
        redisTemplate.delete(key);

        // 2. 새로운 EmergencyRoom 데이터 생성
        List<EmergencyRoom> newEmergencyRooms = fetchEmergencyRoomData();
        // 3. 새로운 EmergencyRoom 데이터를 Redis에 설정
        for (EmergencyRoom er : newEmergencyRooms) {
            redisTemplate.opsForList().rightPush(key, er);
        }

        log.info("EmergencyRoom data updated in Redis.");
    }
    private List<EmergencyRoom> fetchEmergencyRoomData() {
        // 실제로 데이터를 불러오는 로직을 여기에 구현
        // 여기서는 예제 데이터를 사용
        // API 호출
        String url = apiServiceUrl
                + "?serviceKey=" + apiServiceKey
                + "&pageNo=1&numOfRows=500";
        String response = restTemplate.getForObject(url, String.class);
        //log.info("response" + response);

        // XML 파싱
        try {
            return EmergencyRoomDomParser.fetchEmergencyRoomList(response);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
