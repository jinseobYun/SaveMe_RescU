import { io } from "socket.io-client";

export let socket = io.connect(import.meta.env.VITE_SOCKET_SERVER_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export let localStream;
export let remoteVideoStream;
export let myPeerConnection;
let roomId;
let localChatChannel;

export const initSocketConnection = () => {
  if (socket) return;
  socket.connect();
};

export const disconnectSocket = () => {
  if (!socket || socket.connected === false) return;
  socket.disconnect();
  socket = undefined;
};

export const joinRoom = async (room) => {
  roomId = room;
  socket.emit("join_room", roomId);
};

export const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    return cameras;
  } catch (error) {
    console.log(error);
  }
};

export const getMedia = async (deviceId) => {
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
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

socket.on("message", (e) => {
  if (!localStream) {
    console.log("not ready yet");
    return;
  }
  switch (e.type) {
    case "offer":
      handleOffer(e);
      break;
    case "answer":
      handleAnswer(e);
      break;
    case "candidate":
      handleCandidate(e);
      break;
    case "ready":
      if (myPeerConnection) {
        return;
      }
      makeCall();
      break;
    case "leave":
      if (myPeerConnection) {
        hangup();
      }
      break;
    default:
      console.log("unhandled", e);
      break;
  }
});
async function makeCall() {
  try {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: import.meta.env.VITE_ICE_SERVERS,
        },
      ],
    });
    myPeerConnection.onicecandidate = (e) => {
      const message = {
        type: "candidate",
        candidate: null,
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.roomId = roomId;
      }
      socket.emit("message", message);
    };
    myPeerConnection.ontrack = (e) => (remoteVideo = e.streams[0]);
    localStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, localStream));
    const offer = await myPeerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    socket.emit("message", { type: "offer", roomId: offer.roomId });
    await myPeerConnection.setLocalDescription(offer);

    localChatChannel = myPeerConnection.createDataChannel("chat");
    localChatChannel.addEventListener("message", (event) => {
      //TODO - 화면에 메세지 온거 보여주기
      console.log(event.data);
    });
  } catch (e) {
    console.log(e);
  }
}

async function handleOffer(offer) {
  // if (myPeerConnection) {
  //   console.error("existing peerconnection");
  //   return;
  // }

  //   myPeerConnection = new RTCPeerConnection(configuration);
  //   myPeerConnection.onicecandidate = (e) => {
  //     const message = {
  //       type: "candidate",
  //       candidate: null,
  //     };
  //     if (e.candidate) {
  //       message.candidate = e.candidate.candidate;
  //       message.roomId = e.candidate.roomId;
  //     }
  //     socket.emit("message", message);
  //   };
  //   myPeerConnection.ontrack = (e) =>
  //     (remoteVideo.current.srcObject = e.streams[0]);
  //   localStream
  //     .getTracks()
  //     .forEach((track) => myPeerConnection.addTrack(track, localStream));

  myPeerConnection.addEventListener("datachannel", (event) => {
    localChatChannel = event.channel;
    localChatChannel.addEventListener("message", (event) => {
      //TODO - 화면에 메세지 온거 보여주기
      console.log(event.data);
      handleReceiveMessage(event.data);
    });
  });
  await myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  await myPeerConnection.setLocalDescription(answer);
  socket.emit("message", { type: "answer", roomId: answer.roomId });
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
  //TODO - 작성한 메세지 보여주기
  try {
    localChatChannel.send(data);
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
}
