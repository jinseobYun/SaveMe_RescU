import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const ReportCallPage = () => {
  //SECTION - user settings
  const [isChatting, setIsChatting] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const navigate = useNavigate();
  const socketRef = useRef();
  const myPeerConnection = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let myStream;

  // function makeConnection() {
  //   myPeerConnection = new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: import.meta.env.VITE_ICE_SERVERS,
  //       },
  //     ],
  //   });
  //   myPeerConnection.addEventListener("icecandidate", (data) =>
  //     socket.emit("ice", data.candidate, roomName)
  //   );
  //   myPeerConnection.addEventListener(
  //     "addstream",
  //     (data) => (peerFace.srcObject = data.stream)
  //   );
  // }

  // async function getMedia(deviceId) {
  //   const devices = await navigator.mediaDevices.enumerateDevices();
  //   const cameras = devices
  //     .filter((device) => device.kind === "videoinput")
  //     .map((device) => device.deviceId);
  //   const mikes = devices
  //     .filter((device) => device.kind === "audioinput")
  //     .map((device) => device.deviceId);
  //   const initialConstrains = {
  //     audio: true,
  //     video: { facingMode: "user" },
  //   };
  //   const userConstrains = {
  //     audio: mikes.includes(deviceId)
  //       ? { deviceId: { exact: deviceId } }
  //       : true,
  //     video: cameras.includes(deviceId)
  //       ? { deviceId: { exact: deviceId } }
  //       : { facingMode: "user" },
  //   };

  //   try {
  //     myStream = await navigator.mediaDevices.getUserMedia(
  //       deviceId ? userConstrains : initialConstrains
  //     );
  //     myFace.srcObject = myStream;
  //     myStream.getAudioTracks()[0].enabled = !muted;
  //     myStream.getVideoTracks()[0].enabled = !cameraOff;
  //     await myPeerConnection.addStream(myStream);
  //     if (!deviceId) {
  //       await getDevices();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  // async function initCall() {
  //   makeConnection();
  //   await getMedia();
  // }

  // useEffect(() => {
  //   initCall();
  // });
  return (
    <>
      <PeerVideo>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </PeerVideo>
      <MyVideo>
        <video ref={localVideoRef} muted autoPlay playsInline />
      </MyVideo>
      <VideoBtn>
        <button onClick={() => setIsChatting(!isChatting)}>Chat</button>
        <button onClick={() => setIsMute(!isMute)}>Mute</button>
        <button onClick={() => setIsCameraOff(!isCameraOff)}>Camera</button>
      </VideoBtn>
    </>
  );
};

export default ReportCallPage;

const MyVideo = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
`;
const PeerVideo = styled.div`
left:1px
  width: 120px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 20px;
  position:fixed
  background-color: black;
`;
const VideoBtn = styled.div``;
