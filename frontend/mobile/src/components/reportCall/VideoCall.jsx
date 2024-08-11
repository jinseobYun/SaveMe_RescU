import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { OpenVidu } from "openvidu-browser";
import { getToken } from "@api/reportApi"; // getToken 함수 가져오기

import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicOffIcon from "@mui/icons-material/MicOff";
import { Button } from "@components/elements";

const VideoCall = ({ onEndCall, onNewMessage }) => {
  const [isChatting, setIsChatting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuAll, setShowMenuAll] = useState(false);

  const [muted, setMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);
  const [isCameraFront, setIsCameraFront] = useState(false);
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();

  const loginId = "login";
  const [sessionId, setSessionId] = useState("SessionA");
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const sessionRef = useRef(null);
  const OV = useRef(new OpenVidu());

  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== streamManager)
    );
  }, []);

  const joinSession = useCallback(async () => {
    const mySession = OV.current.initSession();
    sessionRef.current = mySession;

    mySession.on("streamCreated", (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
      subscriber.on("videoElementCreated", (event) => {
        remoteVideoRef.current.srcObject = event.element.srcObject;
      });
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });
    mySession.on("signal:chat", (event) => {
      onNewMessage(event.data, "left");
    });

    setSession(mySession);
  }, [deleteSubscriber, onNewMessage]);

  const connectSession = useCallback(async () => {
    if (!session) return;

    try {
      const token = await getToken(sessionId);
      console.log(token);
      await session.connect(token, { clientData: loginId });

      const publisher = OV.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        mirror: false,
      });

      session.publish(publisher);
      localVideoRef.current.srcObject = publisher.stream.getMediaStream();

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );

      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);
    } catch (error) {
      console.error("Error connecting to the session:", error);
    }
  }, [sessionId, session, loginId]);

  useEffect(() => {
    joinSession();
  }, [joinSession]);

  useEffect(() => {
    if (session) {
      connectSession();
    }
    return () => {
      if (session) {
        session.disconnect();
      }
    };
  }, [connectSession, session]);

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }

    OV.current = new OpenVidu();
    setSession(null);
    setSubscribers([]);
    setSessionId("SessionA");
    setPublisher(null);
  }, [session]);

  const switchCamera = useCallback(async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          if (session) {
            await session.publish(newPublisher);
            setCurrentVideoDevice(newVideoDevice[0]);
            setPublisher(newPublisher);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentVideoDevice, session]);

  const handleMuteClick = () => {
    const enabled = !muted;
    publisher.publishAudio(enabled);
    setMuted(enabled);
  };

  const handleCameraClick = () => {
    const enabled = !cameraOff;
    publisher.publishVideo(enabled);
    setCameraOff(enabled);
  };

  return (
    <>
      <PeerVideo ref={remoteVideoRef} autoPlay playsInline />
      <MyVideo ref={localVideoRef} autoPlay muted playsInline />
      <VideoBtn>
        <Button
          _onClick={handleCameraClick}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: "var(--white-color-200)" }}
          children={cameraOff ? <VideocamIcon /> : <VideocamOffIcon />}
        />
        <Button
          _onClick={handleMuteClick}
          $width="55px"
          $height="55px"
          $radius="50%"
          $bg={{ default: "var(--white-color-200)" }}
          children={muted ? <MicNoneIcon /> : <MicOffIcon />}
        />
      </VideoBtn>
    </>
  );
};

const PeerVideo = styled.video`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  background-color: pink;
`;

const MyVideo = styled.video`
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  width: 40vw;
  height: 30vh;
  flex-shrink: 0;
  border-radius: 20px;
  background-color: black;
`;

const VideoBtn = styled.div`
  position: absolute;
  left: 2rem;
  top: 2rem;
  display: inline-flex;
  gap: 16px;
`;

export default VideoCall;
