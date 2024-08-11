import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  initOpenVidu,
  leaveSession,
  mainStreamManager,
  subscribers,
  toggleAudio,
  toggleVideo,
} from "../../util/openvidu";
import styled from "styled-components";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Button from "../elements/Button";
import "./WebRTC.css";
import UserVideoComponent from "./UserVideoComponent";

const WebRTC = () => {
  const [muted, setMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  // 상대방 스트림 상태 관리
  const [remoteStream, setRemoteStream] = useState(null);
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  //remoteVideo 자체를 state로 관리

  const handleMuteClick = () => {
    const enabled = toggleAudio();
    setMuted(enabled);
  };

  const handleCameraClick = () => {
    const enabled = toggleVideo();
    setCameraOff(enabled);
  };

  useEffect(() => {
    const user = { username: "myname", userno: 1 }; // 실제 사용자 정보로 대체
    // const sessionId = "ses_WEyWspxXTD"; // 실제 세션 ID로 대체
    const sessionId = "ses_G4tWX7SMuX"; // 실제 세션 ID로 대체

    initOpenVidu(sessionId, user).then(() => {
      console.log("OpenVidu Init 시작!");
      if (mainStreamManager) {
        localVideoRef.current.srcObject =
          mainStreamManager.stream.getMediaStream();
      }
      console.log("OpenVidu Init 성공!");
    });

    const handleStreamCreated = (event) => {
      console.log("상대방 접속 시작!");
      console.log("만약 상대방이 먼저 접속해 있으면 이 이벤트 작동하나?", event.detail.subscriber)
      const subscriber = event.detail.subscriber;
      if (subscriber) {
        setTimeout(() => {
          const stream = subscriber.stream.getMediaStream();
          console.log("상대방 MediaStream정보 : ", stream);
          if (stream) {
            setRemoteStream(stream);
            console.log("상대방 MediaStream 연결 완료");
          }
        }, 1000);
      }
    };

    window.addEventListener("streamCreated", handleStreamCreated);
    
    return () => {
      leaveSession();
    };
  }, []);

  const onClickCallEnd = () => {
    leaveSession();
    navigate("/");
  };

  useEffect(() => {
    if (remoteStream) {
      if (remoteVideoRef.current) {
        console.log("상대방 Stream 현재 연결 정보:", remoteVideoRef.current);
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [remoteStream]);

  return (
    <VideoContainer>
      <div className="remote-position">
        <Video ref={remoteVideoRef} autoPlay playsInline />
        <div className="local-position">
          <LocalVideo ref={localVideoRef} autoPlay playsInline />
        </div>
      </div>
      <div className="control-panel">
        <div className="rtc-btn">
          <Button
            _onClick={handleCameraClick}
            $bg={{
              default: "var(--white-color-100)",
              hover: "var(--bg-baige-color)",
            }}
            $width="70px"
            $height="70px"
            $radius="40px"
            $border="none"
          >
            {cameraOff ? (
              <VideocamIcon style={{ fontSize: "36px" }} />
            ) : (
              <VideocamOffIcon style={{ fontSize: "36px" }} />
            )}
          </Button>
        </div>
        <div className="rtc-btn">
          <Button
            _onClick={onClickCallEnd}
            $bg={{
              default: "var(--button-red-color)",
              hover: "var(--bg-baige-color)",
            }}
            $width="70px"
            $height="70px"
            $radius="40px"
          >
            <CallEndIcon style={{ fontSize: "36px" }} />
          </Button>
        </div>
        <div className="rtc-btn">
          <Button
            _onClick={handleMuteClick}
            $bg={{
              default: "var(--white-color-100)",
              hover: "var(--bg-baige-color)",
            }}
            $width="70px"
            $height="70px"
            $radius="40px"
            $border="none"
          >
            {muted ? (
              <MicNoneIcon style={{ fontSize: "36px" }} />
            ) : (
              <MicOffIcon style={{ fontSize: "36px" }} />
            )}
          </Button>
        </div>
      </div>
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const LocalVideo = styled.video`
  width: 350px;
  height: 300px;
  z-index: 4;
`;

export default WebRTC;
