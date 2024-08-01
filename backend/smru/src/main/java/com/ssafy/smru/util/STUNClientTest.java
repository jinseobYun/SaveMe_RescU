package com.ssafy.smru.util;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

// 테스트 클래스임
public class STUNClientTest {
    public static void main(String[] args) {
        DatagramSocket socket = null;

        try {
            // 클라이언트 소켓 생성
            socket = new DatagramSocket();

            // STUN 서버 주소와 포트
            InetAddress serverAddress = InetAddress.getByName("localhost");
            int serverPort = 3478;

            // STUN 요청 메시지
            String requestMessage = "STUN Request";
            byte[] buffer = requestMessage.getBytes();

            // 요청 패킷 생성
            DatagramPacket requestPacket = new DatagramPacket(buffer, buffer.length, serverAddress, serverPort);
            System.out.println("STUN 서버에 요청 전송: " + requestMessage);
            socket.send(requestPacket);

            // 서버의 응답 수신
            byte[] responseBuffer = new byte[1024];
            DatagramPacket responsePacket = new DatagramPacket(responseBuffer, responseBuffer.length);
            socket.receive(responsePacket);

            // 응답 메시지 출력
            String responseMessage = new String(responsePacket.getData(), 0, responsePacket.getLength());
            System.out.println("서버 응답: " + responseMessage);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (socket != null && !socket.isClosed()) {
                socket.close();
            }
        }
    }
}

