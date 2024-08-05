import { io } from "socket.io-client";

export let socket = io.connect("ws://localhost:3000", {
  transports: ["websocket"],
  autoConnect: false,
});
const configuration = {
  iceServers: [
    {
      urls: import.meta.env.VITE_ICE_SERVERS,
    },
  ],
}
export let localStream;
export let remoteVideoStream;
export let myPeerConnection;
let roomId;
let chatChannel;


socket.on("message", (e) => {
  if (!localStream) {
    console.log("not ready yet");
    return;
  }
  switch (e.type) {
    case "offer":
      handleOffer(e.offer);
      break;
    case "answer":
      handleAnswer(e.answer);
      break;
    case "candidate":
      handleCandidate(e.candidate);
      break;
    case "leave":
      if (myPeerConnection) {
        hangup();
      }
      break;
    case "send_report_info":
      if (myPeerConnection) {
        handleReceiveReportInfo(e.data);
      }
    default:
      console.log("unhandled", e);
      break;
  }
});
async function makeCall() {
  try {
    myPeerConnection = new RTCPeerConnection(configuration);
    myPeerConnection.addEventListener('icecandidate', (data) => {
      const message = {
        type: "candidate",
        candidate: data.candidate,
      };
      socket.emit("message", message, roomId);
    }
    );

    myPeerConnection.addEventListener(
      'addstream',
      (data) => (remoteVideoStream = data.stream)
    );
    // myPeerConnection.onicecandidate = (e) => {
    //   const message = {
    //     type: "candidate",
    //     candidate: null,
    //   };
    //   if (e.candidate) {
    //     message.candidate = e.candidate.candidate;
    //     message.sdpMid = e.candidate.sdpMid;
    //     message.sdpMLineIndex = e.candidate.sdpMLineIndex;
    //   }
    //   socket.emit("message", message, roomId);
    // };

    // myPeerConnection.ontrack = (e) => (remoteVideo = e.streams[0]);

    // localStream
    //   .getTracks()
    //   .forEach((track) => myPeerConnection.addTrack(track, localStream));

    const offer = await myPeerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await myPeerConnection.setLocalDescription(offer);
    socket.emit("message", { type: "offer", offer: offer }, roomId);

  } catch (e) {
    console.log(e);
  }
}

async function handleOffer(offer) {
  // if (myPeerConnection) {
  //   console.error("existing peerconnection");
  //   return;
  // }
  try {
    myPeerConnection = new RTCPeerConnection(configuration);
    myPeerConnection.addEventListener('icecandidate', (data) => {
      const message = {
        type: "candidate",
        candidate: data.candidate,
      };
      socket.emit("message", message, roomId);
    }
    );

    await myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    await myPeerConnection.setLocalDescription(answer);
    socket.emit("message", { type: "answer", "answer": answer }, roomId);
  } catch (e) {
    console.log(e);
  }

}

async function handleAnswer(answer) {
  if (!myPeerConnection) {
    console.error("no peerconnection");
    return;
  }
  try {
    await myPeerConnection.setRemoteDescription(answer);
  } catch (e) {
    console.log(e);
  }
}

async function handleCandidate(candidate) {
  try {
    if (!myPeerConnection) {
      console.error("no peerconnection");
      return;
    }
    if (!candidate) {
      await myPeerConnection.addIceCandidate(null);
    } else {
      await myPeerConnection.addIceCandidate(candidate);
    }
  } catch (e) {
    console.log(e);
  }
}

export const handleSendMessage = async (data) => {

  try {

    chatChannel.send(data);

  } catch (e) {
    console.log(e);
  }
};
const handleReceiveMessage = async (data) => {
  //TODO - 작성한 메세지 보여주기
  // const chatEvent = new CustomEvent("chatMessage", {
  //   detail: { message: event.data, alignment: "left" },
  // });
  // window.dispatchEvent(chatEvent);
};


async function hangup() {
  if (myPeerConnection) {
    myPeerConnection.close();
    myPeerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  //TODO - web에서는 재연결해주기? 아니면 애초에 나가지 않기, 신고가 종료되었을때 로직 수행
  await restartCall();
}

async function restartCall() {
  makeCall();
  await getMedia();
  socket.emit('join_room', roomId);
}


async function handleReceiveReportInfo(data) {
  //FIXME - 상휘님이 적을 부분 
  console.log(data)
}

export const initSocketConnection = () => {
  socket.connect();
};

const initCall = async () => {
  await getMedia();
  makeCall();
};
export const disconnectSocket = () => {
  if (!socket || socket.connected === false) return;
  socket.disconnect();
  socket = undefined;
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
    localStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );

    return localStream;
  } catch (error) {
    console.log(error);
  }
};


socket.on('already_in_room', () =>
  alert(`You are already in the other room.\nYou can enter only one room.`)
);

socket.on('is_full', (roomId) => {
  alert(`${roomId} is full.`)
  //TODO - 룸 아이디 재요청 api
});
//데이터 채널을 열은 쪽 peerA
socket.on('start_chat', () => {
  chatChannel = myPeerConnection.createDataChannel('chat');
  console.log("보내는쪽 datachannel: " + chatChannel)
  chatChannel.addEventListener('message', (event) => {
    //TODO - 메세지 오는거
  });
  socket.emit('join_chat', roomId);
});
//peer B
socket.on('join_chat', () => {
  myPeerConnection.addEventListener('datachannel', (event) => {
    chatChannel = event.channel;
    console.log("받는쪽: " + chatChannel)
    chatChannel.addEventListener('message', (event) => {
      //TODO - 메세지 오는거
    });
  });
});

socket.on('is_available', async (id) => {
  await initCall();
  roomId = id;
  console.log("방에 들어간다")
  socket.emit('join_room', id);
});
