package com.ssafy.smru.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.common.net.HttpHeaders;
import com.ssafy.smru.dto.AppMemberDto;
import com.ssafy.smru.dto.FcmMessageDto;
import com.ssafy.smru.dto.FcmRequestDto;
import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.PushNotification;
import com.ssafy.smru.entity.app.EmergencyContact;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.repository.FcmRepository;
import com.ssafy.smru.repository.app.EmergencyContactRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@PropertySource(value="classpath:/openAPI.properties")
@Slf4j
public class FcmService {
    @Value("${firebase.api.url}")
    private String API_URL;
    private final EmergencyContactRepository emergencyContactRepository;
    private final AppMemberRepository appMemberRepository;
    private final FcmRepository fcmRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void sendEmergencyPush(FcmRequestDto dto) throws IOException {
        AppMember appMember = appMemberRepository.findByNfcToken(dto.getTagId())
                .orElseThrow(() -> new NotFoundException("존재하지 않는 회원입니다."));
        // 비상 연락망에 푸시알림 전송
        List<String> phoneNumberList = emergencyContactRepository.findByAppMember_MemberId(dto.getTagId())
                .stream()
                .map(EmergencyContact::getPhoneNumber)
                .collect(Collectors.toList());
        List<AppMember> appMemberList = appMemberRepository.findAllByPhoneNumberIn(phoneNumberList);
        String title = "긴급 구조 알림";
        String body = appMember.getMemberName() + " 님이 " + dto.getHospitalName() + "(" + dto.getHospitalAddress() + ") (으)로 이송될 예정입니다.";


        for (AppMember member : appMemberList) {
            if (member == null || appMember.getDeviceToken() == null) continue;
            // 푸시 알림 DB에 저장
            PushNotification pushNotification = PushNotification.builder()
                    .title(title)
                    .body(body)
                    .notificationTime(LocalDateTime.now())
                    .appMember(member)
                    .build();
            fcmRepository.save(pushNotification);
            String message = makeMessage(appMember.getDeviceToken(), title, body);
            log.info(message);
            OkHttpClient client = new OkHttpClient();
            RequestBody requestBody = RequestBody.create(message,
                    MediaType.get("application/json; charset=utf-8"));
            Request request = new Request.Builder()
                    .url(API_URL)
                    .post(requestBody)
                    .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                    .addHeader(HttpHeaders.CONTENT_TYPE, "application/json; UTF-8")
                    .build();

            Response response = client.newCall(request).execute();
        }
    }

    public Map<String, Object> getPushNotificationList(String memberId) {
        Map<String, Object> result = new HashMap<>();
        AppMember appMember = appMemberRepository.findByMemberId(memberId)
                        .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
        List<PushNotification> pushNotificationList = fcmRepository.findAllByAppMember(appMember);
        result.put("pushNotificationList", pushNotificationList);
        return result;
    }

//    public void sendMessageTo(String targetToken, String title, String body) throws IOException {
//        String message = makeMessage(targetToken, title, body);
//        OkHttpClient client = new OkHttpClient();
//        RequestBody requestBody = RequestBody.create(message,
//                MediaType.get("application/json; charset=utf-8"));
//        Request request = new Request.Builder()
//                .url(API_URL)
//                .post(requestBody)
//                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
//                .addHeader(HttpHeaders.CONTENT_TYPE, "application/json; UTF-8")
//                .build();
//
//        Response response = client.newCall(request).execute();
//
//        System.out.println(response.body().string());
//    }


    private String makeMessage(String targetToken, String title, String body) throws JsonParseException, JsonProcessingException {
        FcmMessageDto fcmMessage = FcmMessageDto.builder()
                .message(FcmMessageDto.Message.builder()
                        .token(targetToken)
                        .notification(FcmMessageDto.Notification.builder()
                                .title(title)
                                .body(body)
                                .image(null)
                                .build()
                        ).build()).validateOnly(false).build();

        return objectMapper.writeValueAsString(fcmMessage);
    }

    private String getAccessToken() throws IOException {
        String firebaseConfigPath = "firebase_service_key.json";

        GoogleCredentials googleCredentials = GoogleCredentials
                .fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        googleCredentials.refreshIfExpired();
        return googleCredentials.getAccessToken().getTokenValue();
    }
}
