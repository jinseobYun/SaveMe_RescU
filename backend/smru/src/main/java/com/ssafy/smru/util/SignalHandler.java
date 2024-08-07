package com.ssafy.smru.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.smru.dto.WebSocketMessage;
import com.ssafy.smru.repository.SessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.*;

@Slf4j
@Component
public class SignalHandler extends TextWebSocketHandler {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final SessionRepository sessionRepositoryRepo = SessionRepository.getInstance();  // 세션 데이터 저장소
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String MSG_TYPE_JOIN_ROOM = "join_room";
    private static final String MSG_TYPE_OFFER = "offer";
    private static final String MSG_TYPE_ANSWER = "answer";
    private static final String MSG_TYPE_CANDIDATE = "candidate";

        // 웹소켓이 연결되면 실행되는 메소드
    @Override
    public void afterConnectionEstablished(final WebSocketSession session) {
    }

    // 클라이언트로 부터 텍스트 메시지가 수신되었을때 호출되는 메서드
    @Override
    protected void handleTextMessage(final WebSocketSession session, final TextMessage textMessage) {

        try {
             // 수신된 텍스트 메시지를 WebSocketMessage 로 변환
            WebSocketMessage message = objectMapper.readValue(textMessage.getPayload(), WebSocketMessage.class);
            String userName = message.getSender();
            String data = message.getData();
            Long roomId = message.getRoomId();

            log.info("=========== origin message INFO");
            log.info("==========session.Id : {}, getType : {},  getRoomId :  {}", session.getId(), message.getType(), roomId.toString());

            // 메시지 타입에 따라 switch 처리
            switch (message.getType()) {
                // 타입이 join_room 일 경우
                case MSG_TYPE_JOIN_ROOM:
                        // 방이 있으면
                    if (sessionRepositoryRepo.hasRoom(roomId)) {
                        log.info("==========join 0 : 방 있음 :" + roomId);
                        log.info("==========join 1 : (join 전) Client List - \n {} \n", Optional.ofNullable(sessionRepositoryRepo.getClientList(roomId)));

                        // 세션 저장: 기존 방의 세션 목록에 새로운 클라이언트 세션 정보를 저장
                        sessionRepositoryRepo.addClient(roomId, session);
                        // 방이 없으면
                    } else {
                        log.info("==========join 0 : 방 없음 :" + roomId);
                        // 세션 저장: 새로운 방을 만들고 새로운 클라이언트 세션 정보를 저장
                        sessionRepositoryRepo.addClientInNewRoom(roomId, session);
                    }

                    log.info("==========join 2 : (join 후) Client List - \n {} \n", Optional.ofNullable(sessionRepositoryRepo.getClientList(roomId)));

                    // 세션 저장 : 이 세션이 어느 방에 들어가 있는지 저장
                    sessionRepositoryRepo.saveRoomIdToSession(session, roomId);
                    log.info("==========join 3 : 지금 세션이 들어간 방 :" + Optional.ofNullable(sessionRepositoryRepo.getRoomId(session)));

                    // 방안 참가자 중 자신을 제외한 나머지 사람들의 Session ID를 List로 저장
                    List<String> exportClientList = new ArrayList<>();
                    for (Map.Entry<String, WebSocketSession> entry : sessionRepositoryRepo.getClientList(roomId).entrySet()) {
                        if (entry.getValue() != session) {
                            exportClientList.add(entry.getKey());
                        }
                    }

                    log.info("==========join 4 : allUsers로 Client List : {}", exportClientList);

                    // 접속한 본인에게 방안 참가자들 정보를 전송
                    sendMessage(session,
                            new WebSocketMessage().builder()
                                    .type("all_users")
                                    .sender(userName)
                                    .data(message.getData())
                                    .allUsers(exportClientList)
                                    .candidate(message.getCandidate())
                                    .sdp(message.getSdp())
                                    .build());

                    break;

                case MSG_TYPE_OFFER:
                case MSG_TYPE_ANSWER:
                case MSG_TYPE_CANDIDATE:
                        // 타입이 오퍼,앤서,캔디데이트 일 경우
                    // 방이 존재 할 경우
                    if (sessionRepositoryRepo.hasRoom(roomId)) {

                        Map<String, WebSocketSession> clientList = sessionRepositoryRepo.getClientList(roomId);

                        log.info("=========={} 5 : 보내는 사람 - {}, 받는 사람 - {}" + message.getType(), session.getId(), message.getReceiver());

                        if (clientList.containsKey(message.getReceiver())) {
                            WebSocketSession ws = clientList.get(message.getReceiver());
                            sendMessage(ws,
                                    new WebSocketMessage().builder()
                                            .type(message.getType())
                                            .sender(session.getId())            // 보낸사람 session Id
                                            .receiver(message.getReceiver())    // 받을사람 session Id
                                            .data(message.getData())
                                            .offer(message.getOffer())
                                            .answer(message.getAnswer())
                                            .candidate(message.getCandidate())
                                            .sdp(message.getSdp())
                                            .build());
                        }
                    }
                    break;

                default:
                    log.info("======================================== DEFAULT");
                    log.info("============== 들어온 타입 : " + message.getType());

            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    // 웹소켓 연결이 끊어지면 실행되는 메소드
    @Override
    public void afterConnectionClosed(final WebSocketSession session, final CloseStatus status) {
        log.info("======== 웹소켓 연결 해제 : {}", session.getId());
        // 끊어진 세션이 어느방에 있었는지 조회
        Long roomId = Optional.ofNullable(sessionRepositoryRepo.getRoomId(session)).orElseThrow(
                () -> new IllegalArgumentException("해당 세션이 있는 방정보가 없음!")
        );

        // 1) 방 참가자들 세션 정보들 사이에서 삭제
        log.info("==========leave 1 : (삭제 전) Client List - \n {} \n", Optional.ofNullable(sessionRepositoryRepo.getClientList(roomId)));
        sessionRepositoryRepo.deleteClient(roomId, session);
        log.info("==========leave 2 : (삭제 후) Client List - \n {} \n", Optional.ofNullable(sessionRepositoryRepo.getClientList(roomId)));


        // 2) 별도 해당 참가자 세션 정보도 삭제
        log.info("==========leave 3 : (삭제 전) roomId to Session - \n {} \n", Optional.ofNullable(sessionRepositoryRepo.searchRoomIdToSession(roomId)));
        sessionRepositoryRepo.deleteRoomIdToSession(session);
        log.info("==========leave 4 : (삭제 후) roomId to Session - \n {} \n", Optional.ofNullable(sessionRepositoryRepo.searchRoomIdToSession(roomId)));


        // 본인 제외 모두에게 전달
        Map<String, WebSocketSession> clientList = Optional.ofNullable(sessionRepositoryRepo.getClientList(roomId))
                .orElseThrow(
                        () -> new IllegalArgumentException("clientList 없음")
                );
        for(Map.Entry<String, WebSocketSession> oneClient : clientList.entrySet()){
            sendMessage(oneClient.getValue(),
                    new WebSocketMessage().builder()
                            .type("leave")
                            .sender(session.getId())
                            .receiver(oneClient.getKey())
                            .build());
        }

    }

    // 메세지 발송
    private void sendMessage(WebSocketSession session, WebSocketMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            log.info("========== 발송 to : " + session.getId());
            log.info("========== 발송 내용 : " + json);
            session.sendMessage(new TextMessage(json));
        } catch (IOException e) {
            log.info("============== 발생한 에러 메세지: " + e.getMessage());
        }
    }
}