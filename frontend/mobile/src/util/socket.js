import { io } from 'socket.io-client';

export let socket = io.connect(import.meta.env.VITE_SOCKET_SERVER_URL, {
  transports: ['websocket'],
});

export let myStream;
export let myPeerConnection;
let roomName;
let myDataChannel;

export const initSocketConnection = () => {
  if (socket) return;
  socket.connect();
};

export const handleSendMsg = (roomId, msg, userId) => {
  if (!socket) return;
  socket.emit('message', {
    roomId,
    message: msg,
    userId,
    timestamp: Date.now(),
  });
};

export const disconnectSocket = () => {
  if (!socket || socket.connected === false) return;
  socket.disconnect();
  socket = undefined;
};

export const joinRoom = async (room) => {
  roomName = room;
  socket.emit('join_room', roomName);
};

export const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    return cameras;
  } catch (error) {
    console.log(error);
  }
};

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
    return myStream;
  } catch (error) {
    console.log(error);
  }
};

export const makeConnection = () => {
  if (!myStream) {
    console.error("Stream is not initialized");
    return;
  }

  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  });

  myPeerConnection.addEventListener('icecandidate', handleIceEvent);
  myPeerConnection.addEventListener('addstream', handleAddStream);

  myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
};

export const leaveCall = () => {
  socket.emit('leave_call', roomName);
};

const handleIceEvent = (data) => {
  socket.emit('ice', data.candidate, roomName);
};

const handleAddStream = (data) => {
  const event = new CustomEvent('addStream', { detail: { stream: data.streams[0] } });
  window.dispatchEvent(event);
};
// 메시지 전송 함수
export const sendMessage = (roomId, message, userId) => {
  socket.emit('new_message', { roomId, message, userId });
};

// 메시지 수신 이벤트
export const receiveMessage = (callback) => {
  socket.on('new_message', (data) => {
    callback(data);
  });
};

socket.on('welcome', async () => {
  myDataChannel = myPeerConnection.createDataChannel('chat');
  myDataChannel.addEventListener('message', (event) => {
    console.log(event.data);
  });

  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit('offer', offer, roomName);
});

socket.on('offer', async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit('answer', answer, roomName);
});

socket.on('answer', (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

socket.on('ice', (ice) => {
  myPeerConnection.addIceCandidate(ice);
});
socket.on('join_chat', (partnerNickname) => {
  myPeerConnection.addEventListener('datachannel', (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener('message', (event) => {
      const chatEvent = new CustomEvent('chatMessage', { detail: { message: event.data, alignment: 'left' } });
      window.dispatchEvent(chatEvent);
    });
  });
});

socket.on('leave_call', () => {
  if (myPeerConnection) {
    myPeerConnection.close();
    myPeerConnection = null;
  }
  if (myStream) {
    myStream.getTracks().forEach(track => track.stop());
    myStream = null;
  }
});