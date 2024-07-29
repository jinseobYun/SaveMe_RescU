const socket = io();

// Global variables
let myStream;
let muted = true;
let cameraOff = true;
let nickname;
let roomName;
let myPeerConnection;
let myDataChannel;

// Select mike & camera
const camerasSelect = document.getElementById("cameras");
const mikesSelect = document.getElementById("mikes");
const myFace = document.getElementById("myFace");
const peerFace = document.getElementById("peerFace");

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices
    .filter((device) => device.kind === "videoinput")
    .map((device) => device.deviceId);
  const mikes = devices
    .filter((device) => device.kind === "audioinput")
    .map((device) => device.deviceId);
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const userConstrains = {
    audio: mikes.includes(deviceId) ? { deviceId: { exact: deviceId } } : true,
    video: cameras.includes(deviceId)
      ? { deviceId: { exact: deviceId } }
      : { facingMode: "user" },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? userConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    myStream.getAudioTracks()[0].enabled = !muted;
    myStream.getVideoTracks()[0].enabled = !cameraOff;
    await myPeerConnection.addStream(myStream);
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

// Change mike & camera
async function handleCameraChange() {
  let index;
  //전면 1 후면 0
  if (isCameraFront) index = 0;
  else index = 1;
  setIsCameraFront(!isCameraFront);
  await getMedia(cameras[index].deviceId);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
}

async function handleMikeChange() {
  await getMedia(mikesSelect.value);
  if (myPeerConnection) {
    const audioTrack = myStream.getAudioTracks()[0];
    const audioSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "audio");
    audioSender.replaceTrack(audioTrack);
  }
}

// mike & camera on/off
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");

function handleMuteClick() {
  const curState = myStream.getAudioTracks()[0].enabled;
  myStream.getAudioTracks()[0].enabled = !curState;
  muteBtn.innerText = muted ? "Mute" : "Unmute";
  muted = !muted;
}

function handleCameraClick() {
  const curState = myStream.getVideoTracks()[0].enabled;
  myStream.getVideoTracks()[0].enabled = !curState;
  cameraBtn.innerText = cameraOff ? "Cam Off" : "Cam On";
  cameraOff = !cameraOff;
}

function initButton() {
  muteBtn.innerText = muted ? "Unmute" : "Mute";
  cameraBtn.innerText = cameraOff ? "Cam On" : "Cam Off";
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);
mikesSelect.addEventListener("input", handleMikeChange);

// Enter room (join a room)
async function initCall() {
  switchScreen();
  makeConnection();
  await getMedia();
}

function handleEnterRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = document.getElementById("roomName");
  roomName = roomNameInput.value;
  if (nickname) {
    socket.emit("check_room", nickname, roomName);
    roomNameInput.value = "";
  } else {
    alert("You have to save your nickname first.");
  }
}

enterRoomForm.addEventListener("submit", handleEnterRoomSubmit);

// Chat
const chat = document.getElementById("chat");
const messageForm = document.getElementById("message");
const messageInput = messageForm.querySelector("textarea");
const messageSendBtn = messageForm.querySelector("button");
const ALIGN_LEFT = "left";
const ALIGN_RIGHT = "right";
messageSendBtn.disabled = true;

function addMessage(message, alignment, sender) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  const messageSpan = document.createElement("span");

  message = message.trim();

  if (message) {
    if (sender && alignment === "left") {
      const nicknameSpan = document.createElement("span");
      nicknameSpan.classList.add("chat__nickname");
      nicknameSpan.innerText = sender;
      li.appendChild(nicknameSpan);
    }

    messageSpan.innerText = message;
    messageSpan.classList.add("chat__message");
    li.appendChild(messageSpan);

    switch (alignment) {
      case "left":
        li.classList.add("chat--align-left");
        break;
      case "right":
        li.classList.add("chat--align-right");
        break;
      default:
        li.classList.add("chat--align-center");
        break;
    }

    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
  }
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const message = messageInput.value;
  messageInput.value = "";
  addMessage(message, ALIGN_RIGHT, nickname);
  try {
    myDataChannel.send(message);
  } catch (e) {
    console.log(e);
  }
  messageSendBtn.disabled = true;
}

function handleMessageEnterKeydown(event) {
  const { keyCode } = event;
  const { shiftKey: SHIFT } = event;
  const ENTER = 13;
  if (keyCode === ENTER && !SHIFT) {
    event.preventDefault();
    messageSendBtn.click();
  }
  if (keyCode === ENTER && SHIFT) {
    event.preventDefault();
    messageInput.value += "\n";
  }
}

messageInput.addEventListener("input", () => {
  messageSendBtn.disabled = messageInput.value.trim() === "" ? true : false;
});
messageForm.addEventListener("focusin", () => (messageInput.placeholder = ""));
messageForm.addEventListener(
  "focusout",
  () => (messageInput.placeholder = "message")
);
messageForm.addEventListener("submit", handleMessageSubmit);
messageForm.addEventListener("keydown", handleMessageEnterKeydown);

socket.on("start_chat", (partnerNickname) => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  addMessage(`${partnerNickname} arrived!`);
  myDataChannel.addEventListener("message", (event) => {
    addMessage(event.data, ALIGN_LEFT, partnerNickname);
  });
  socket.emit("join_chat", nickname, roomName);
});

socket.on("join_chat", (partnerNickname) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    addMessage(`${partnerNickname} arrived!`);
    myDataChannel.addEventListener("message", (event) => {
      addMessage(event.data, ALIGN_LEFT, partnerNickname);
    });
  });
});

socket.on("send_offer", async () => {
  const offer = await myPeerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => myPeerConnection.setRemoteDescription(answer));

socket.on("ice", (ice) => myPeerConnection.addIceCandidate(ice));

socket.on("leave_chat", (partnerNickname) =>
  addMessage(`${partnerNickname} left`)
);

socket.on("leave_call", async () => {
  try {
    peerFace.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
      peerFace.srcObject.removeTrack(track);
    });
  } catch (e) {
    console.log(e);
  }
  await restartCall();
});

async function restartCall() {
  makeConnection();
  await getMedia();
  socket.emit("join_room", nickname, roomName);
}

// WebRTC
function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", (data) =>
    socket.emit("ice", data.candidate, roomName)
  );
  myPeerConnection.addEventListener(
    "addstream",
    (data) => (peerFace.srcObject = data.stream)
  );
}
