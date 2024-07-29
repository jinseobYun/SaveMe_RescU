import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import styled from "styled-components";

import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicOffIcon from "@mui/icons-material/MicOff";
import ForumIcon from "@mui/icons-material/Forum";
import CallEndIcon from "@mui/icons-material/CallEnd";

import { Button } from "@components/elements";

const ReportCallPage = () => {
  //SECTION - user settings
  const [isChatting, setIsChatting] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isCameraFront, setIsCameraFront] = useState(false);
  const navigate = useNavigate();
  const socketRef = useRef();
  const myPeerConnection = useRef(); //pcRef
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let myStream;
  // let cameras = [];
  // const onClickMute = () => {
  //   myStream
  //     .getAudioTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  //   setIsMute(!isMute);
  // };
  // const onClickCamera = () => {
  //   myStream
  //     .getVideoTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  //   setIsCameraOff(!isCameraOff);
  // };

  // async function onClickCameraChange() {
  //   let index;
  //   //전면 1 후면 0
  //   if (isCameraFront) index = 0;
  //   else index = 1;
  //   setIsCameraFront(!isCameraFront);
  //   await getMedia(cameras[index].deviceId);
  //   if (myPeerConnection) {
  //     const videoTrack = myStream.getVideoTracks()[0];
  //     const videoSender = myPeerConnection
  //       .getSenders()
  //       .find((sender) => sender.track.kind === "video");
  //     videoSender.replaceTrack(videoTrack);
  //   }
  // }

  // const makeConnection = async () => {
  //   //TODO - url 연결
  //   // socketRef = await io.connect(import.meta.env.VITE_SOCKET_SERVER_URL);
  //   socketRef = await io();
  //   myPeerConnection = new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: import.meta.env.VITE_ICE_SERVERS,
  //       },
  //     ],
  //   });
  //   myPeerConnection.addEventListener("icecandidate", (data) =>
  //     //TODO - roomname 연결
  //     // socket.emit("ice", data.candidate, roomName)
  //     socket.emit("ice", data.candidate, 1)
  //   );
  //   remoteVideoRef.addEventListener(
  //     "addstream",
  //     (data) => (remoteVideoRef.srcObject = data.stream[0])
  //   );
  //   myStream
  //     .getTracks()
  //     .forEach((track) => myPeerConnection.addTrack(track, myStream));
  // };

  // //SECTION - get user video
  // const getCameras = async () => {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     cameras = devices.filter((device) => device.kind === "videoinput");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const getMedia = async (deviceId) => {
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
  //     localVideoRef.srcObject = myStream;
  //     myStream.getAudioTracks()[0].enabled = !isMute;
  //     myStream.getVideoTracks()[0].enabled = !isCameraOff;
  //     if (!deviceId) {
  //       await getCameras();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // //SECTION - chatting
  const [chatBtnColor, setChatBtnColor] = useState();

  // const changeChatBtnColor = () => {
  //   if (isChatArrive) {
  //     setChatBtnColor("var(--main-yellow-color)");
  //   } else {
  //     setChatBtnColor("var(--white-color-200)");
  //   }
  // };
  // const arriveChat = () => {
  //   changeChatBtnColor();
  // };

  // async function initCall() {
  //   makeConnection();
  //   await getMedia();
  //   //TODO - web socket.on
  // }

  // const onClickCallEnd = () => {
  //   //TODO - socket.emit('callEnd', roomName);
  //   // socketRef.emit("disconnect", user.userId);

  //   navigate(-1);
  // };
  // useEffect(() => {
  //   initCall();
  //   return () => {
  //     if (socketRef) {
  //       socketRef.disconnect();
  //     }
  //     if (myPeerConnection) {
  //       myPeerConnection.close();
  //     }
  //   };
  // });

  return (
    <MyVideo>
      <video ref={localVideoRef} muted autoPlay playsInline />
      <VideoBtn>
        <Button
          // onClick={onClickCamera}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: "var(--white-color-200)" }}
          children={isCameraOff ? <VideocamIcon /> : <VideocamOffIcon />}
        />
        <Button
          // onClick={onClickMute}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: "var(--white-color-200)" }}
          children={isCameraOff ? <MicNoneIcon /> : <MicOffIcon />}
        />
        <Button
          // onClick={onClickCameraChange}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: "var(--white-color-200)" }}
          children={<CameraswitchIcon />}
        />
        <Button
          // onClick={onClickCallEnd}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: "var(--main-red-color)" }}
          children={<CallEndIcon sx={{ color: "#f4f4f4" }} />}
        />
      </VideoBtn>
      {isChatting ? (
        <></>
      ) : (
        <Button
          onClick={() => setIsChatting(!isChatting)}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: chatBtnColor }}
          children={<ForumIcon />}
        />
      )}

      <PeerVideo>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </PeerVideo>
    </MyVideo>
  );
};

export default ReportCallPage;

const MyVideo = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
`;
const PeerVideo = styled.div`
  left:1px
  bottom:1px;
  width: 120px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 20px;
  position:absolute;
  background-color: black;
  z-index:1;
`;
const VideoBtn = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 16px;
`;
