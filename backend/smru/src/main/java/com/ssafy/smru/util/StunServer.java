package com.ssafy.smru.util;

import jakarta.annotation.PreDestroy;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;

@Component
@RestController
@RequestMapping("/api/stun")
public class StunServer implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(StunServer.class);
    private DatagramSocket socket;
    private boolean running = true;

    @Override
    public void run() {
        try {
            socket = new DatagramSocket(3478); // 기본 포트 3478
            logger.info("--------------STUN 서버 시작 port: 3478----------- ");

            while (running) {
                try {
                    byte[] buffer = new byte[512];
                    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                    socket.receive(packet);

                    // 클라이언트의 IP와 포트 정보 가져오기
                    InetAddress clientAddress = packet.getAddress();
                    int clientPort = packet.getPort();

                    // STUN 응답 생성
                    String response = "STUN Response: " + clientAddress.getHostAddress() + ":" + clientPort;
                    byte[] responseBuffer = response.getBytes();

                    // 응답 전송
                    DatagramPacket responsePacket = new DatagramPacket(responseBuffer, responseBuffer.length, clientAddress, clientPort);
                    socket.send(responsePacket);
                    logger.info("< IP 주소 : {} > < Port : {} >", clientAddress, clientPort);
                } catch (java.net.SocketException e) {
                    if (!running) {
                        logger.info("STUN 서버가 종료되었습니다.");
                    } else {
                        throw e;
                    }
                }
            }

        } catch (Exception e) {
            logger.error("Error in STUN server", e);
        }
    }

    @PreDestroy
    public void cleanup() {
        running = false;
        if (socket != null && !socket.isClosed()) {
            socket.close();
            logger.info("STUN 서버 소켓이 닫혔습니다.");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> getClientInfo(HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        int clientPort = request.getRemotePort();
        Map<String, String> response = new HashMap<>();
        response.put("ip", clientIp);
        response.put("port", String.valueOf(clientPort));
        return ResponseEntity.ok(response);
    }
}
