import { io } from 'socket.io-client';
import { SIGNALING_SERVER_URL } from '../config/apiConfig';

export let socket = io.connect(SIGNALING_SERVER_URL, {
  path:'/api/signaling',
  // transports: ['websocket'],
  // autoConnect: false,
});

export let myStream;
export let myPeerConnection;
let roomName;
let myDataChannel;


// Socket 연결 초기화
export const initSocketConnection = () => {
  if (socket.connected) return;
  socket.connect();
  console.log("소켓 연결 초기화");
};

// 메시지 전송 함수
export const handleSendMsg = (roomId, msg, userId) => {
  if (!socket) return;
  console.log("메세지 전송: roomId, msg, userId", { roomId, msg, userId });
  socket.emit('message', {
    roomId,
    message: msg,
    userId,
    timestamp: Date.now(),
  });
};

// Socket 연결 해제
export const disconnectSocket = () => {
  if (!socket || socket.connected === false) return;
  socket.disconnect();
  socket = undefined;
  console.log("소켓 연결 해제");
};

// 방에 참가
export const joinRoom = async (room) => {
  roomName = room;
  socket.emit('방 참여', roomName);
  console.log(`참여 방 번호: ${roomName}`);
};

// 사용 가능한 카메라 가져오기
export const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    console.log("사용 가능한 카메라:", cameras);
    return cameras;
  } catch (error) {
    console.error("카메라 설정 에러:", error);
  }
};

// 미디어 스트림 가져오기
export const getMedia = async (deviceId) => {
  const initialConstraints = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );
    console.log("미디어 스트림:", myStream);
    return myStream;
  } catch (error) {
    console.error("미디어 스트림 오류:", error);
  }
};

// 피어 연결 생성 및 ICE 서버 설정 (STUN 서버 사용)
export const makeConnection = () => {
  if (!myStream) {
    console.error("스트림 미설정");
    return;
  }

  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          // 'https://i11b305.p.ssafy.io/api/stun/info',
          // 'stun:localhost:3478',
          // 'https://i11b305.p.ssafy.io/stun/info'
        ],
      },
    ],
  });

  myPeerConnection.addEventListener('icecandidate', handleIceEvent);
  myPeerConnection.addEventListener('track', handleAddStream);

  myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
  console.log("RTCPeerConnection 연결");
};

// 통화 종료
export const leaveCall = () => {
  socket.emit('통화 종료', roomName);
  console.log(`통화종료, 방에서 나가기: ${roomName}`);
};

// ICE 후보 처리 이벤트
const handleIceEvent = (data) => {
  if (data.candidate) {
    console.log("ICE 후보자 전송:", data.candidate);
    socket.emit('ice', data.candidate, roomName);
  }
};

// 스트림 추가 처리 이벤트
const handleAddStream = (data) => {
  console.log("Received remote stream:", data.streams[0]);
  const event = new CustomEvent('addStream', { detail: { stream: data.streams[0] } });
  window.dispatchEvent(event);
};

// 메시지 전송 함수
export const sendMessage = (roomId, message, userId) => {
  console.log("새로운 메세지 전송:", { roomId, message, userId });
  socket.emit('새로운 메세지 : RoomId, message, userId', { roomId, message, userId });
};

// 메시지 수신 이벤트
export const receiveMessage = (callback) => {
  socket.on('new_message', (data) => {
    console.log("새로운 메세지 수신:", data);
    callback(data);
  });
};

// Socket 메시지 이벤트 처리
socket.on('message', async (data) => {
  console.log("소켓메세지 처리 이벤트, 메시지 유형별로 데이터/ Data: ", data);
  switch (data.type) {
    case 'offer':
      await handleOffer(data.offer);
      break;
    case 'answer':
      await handleAnswer(data.answer);
      break;
    case 'ice':
      await handleCandidate(data.candidate);
      break;
    case 'welcome':
      await handleWelcome();
      break;
    case 'leave_call':
      leaveCall();
      break;
  }
});

// 환영 메시지 처리
const handleWelcome = async () => {
  myDataChannel = myPeerConnection.createDataChannel('chat');
  myDataChannel.addEventListener('message', (event) => {
    console.log("Data channel message:", event.data);
  });

  const offer = await myPeerConnection.createOffer();
  await myPeerConnection.setLocalDescription(offer);
  socket.emit('offer', { type: 'offer', offer, roomName });
  console.log("Sent offer:", offer);
};

// 오퍼 처리
const handleOffer = async (offer) => {
  console.log("Received offer:", offer);
  await myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  await myPeerConnection.setLocalDescription(answer);
  socket.emit('answer', { type: 'answer', answer, roomName });
  console.log("Sent answer:", answer);
};

// 응답 처리
const handleAnswer = async (answer) => {
  console.log("Received answer:", answer);
  await myPeerConnection.setRemoteDescription(answer);
};

// ICE 후보 처리
const handleCandidate = async (candidate) => {
  if (candidate) {
    console.log("Received ICE candidate:", candidate);
    await myPeerConnection.addIceCandidate(candidate);
  }
};

// 채팅 참가 처리
socket.on('join_chat', (partnerNickname) => {
  console.log(`Joining chat with: ${partnerNickname}`);
  myPeerConnection.addEventListener('datachannel', (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener('message', (event) => {
      console.log("Data channel message received:", event.data);
      const chatEvent = new CustomEvent('chatMessage', { detail: { message: event.data, alignment: 'left' } });
      window.dispatchEvent(chatEvent);
    });
  });
});

// 통화 종료 처리
socket.on('leave_call', () => {
  console.log("Peer left the call");
  if (myPeerConnection) {
    myPeerConnection.close();
    myPeerConnection = null;
  }
  if (myStream) {
    myStream.getTracks().forEach(track => track.stop());
    myStream = null;
  }
});
