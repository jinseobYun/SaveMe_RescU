import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { initOpenVidu, leaveSession, mainStreamManager, subscribers, toggleAudio, toggleVideo } from "../../util/openvidu";
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
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);


  const session = useRef(null);
  const OV = useRef(null);

  const handleMuteClick = () => {
    const enabled = toggleAudio();
    setMuted(!enabled);
  };

  const handleCameraClick = () => {
    const enabled = toggleVideo();
    setCameraOff(!enabled);
  };

  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(device => device.deviceId !== currentVideoDevice.deviceId);

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          if (session) {
            await session.unpublish(mainStreamManager);
            await session.publish(newPublisher);
            setCurrentVideoDevice(newVideoDevice[0]);
            setMainStreamManager(newPublisher);
            setPublisher(newPublisher);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentVideoDevice, session, mainStreamManager]);

  useEffect(() => {
    const user = { username: "myname", userno: 1 }; // 실제 사용자 정보로 대체
    const sessionId = "ses_WEyWspxXTD"; // 실제 세션 ID로 대체

    initOpenVidu(sessionId, user.username).then(() => {
      console.log("OpenVidu Init 시작!!!!!!!!!!!!!")
      localVideoRef.current.srcObject = mainStreamManager.stream.getMediaStream();
      console.log("OpenVidu Init 성공!!!!!!!!!!!!!")
    });

    window.addEventListener("streamCreated", (event) => {
      console.log("상대방접속 시작!!!!!!!!!!!!!")
      remoteVideoRef.current.srcObject = event.detail.subscriber.stream.getMediaStream();
      console.log("상대방 컴퓨터 연결 완료!!!!!!!!!!!!!")
    });

    return () => {
      leaveSession();
    };
  }, []);

  const onClickCallEnd = () => {
    leaveSession();
    navigate("/");
  };

  return (
    <VideoContainer>
      <div className="remote-position">
        <Video ref={remoteVideoRef} autoPlay playsInline />
        <div className="local-position">
          <LocalVideo ref={localVideoRef} muted autoPlay playsInline />
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
            {cameraOff ? <VideocamIcon style={{ fontSize: "36px" }} /> : <VideocamOffIcon style={{ fontSize: "36px" }} />}
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
            {muted ? <MicNoneIcon style={{ fontSize: "36px" }} /> : <MicOffIcon style={{ fontSize: "36px" }} />}
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
  background-color: white;
`;

const LocalVideo = styled.video`
  width: 350px;
  height: 300px;
  z-index: 4;
`;

export default WebRTC;
