import React, { useRef, useEffect, useState, forwardRef } from "react";
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
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import SendIcon from "@mui/icons-material/Send";

import { Button, Input, Grid } from "@components/elements";
import { socket } from "";
const ReportCallPage = () => {
  //SECTION - user settings
  const [isChatting, setIsChatting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuAll, setShowMenuAll] = useState(false);

  const [isMute, setIsMute] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isCameraFront, setIsCameraFront] = useState(false);
  const [chatBtnColor, setChatBtnColor] = useState();

  const navigate = useNavigate();
  const socketRef = useRef();
  const myPeerConnection = useRef(); //pcRef
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let myStream;

  const onClickScreen = () => {
    if (isChatting) {
      setShowMenu(true);
    } else {
      setShowMenuAll(true);
    }
  };
  const onClickMenu = () => {
    setShowMenu(false);
    setShowMenuAll(true);
  };
  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => {
        setShowMenu(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMenu]);

  useEffect(() => {
    if (showMenuAll) {
      setShowMenu(false);

      const timer = setTimeout(() => {
        setShowMenuAll(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMenuAll]);
  const startChatting = (event) => {
    event.stopPropagation();
    setIsChatting(true);
    setShowMenu(false);
    setShowMenuAll(false);
  };
  return (
    <PeerVideo onClick={onClickScreen}>
      <video ref={localVideoRef} muted autoPlay playsInline height="100%" />
      {showMenuAll && (
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
            $margin="0 0 0 6rem"
            $bg={{ default: "var(--main-red-color)" }}
            children={<CallEndIcon sx={{ color: "#f4f4f4" }} />}
          />
        </VideoBtn>
      )}
      {showMenu && isChatting && (
        <VideoBtn>
          <Button
            _onClick={onClickMenu}
            $width="55px"
            $height="55px"
            $radius="50%"
            $bg={{ default: "var(--white-color-200)" }}
            children={<MoreHorizOutlinedIcon />}
          />
        </VideoBtn>
      )}

      {isChatting ? (
        <ChatInputBox>
          <Input />
          <Button
            $width="39px"
            $height="48px"
            $bg={{ default: "transparent" }}
            children={<SendIcon />}
          />
        </ChatInputBox>
      ) : (
        <ChatBtn>
          <Button
            _onClick={startChatting}
            $width="55px"
            $height="55px"
            $radius="50%"
            $bg={{ default: chatBtnColor }}
            children={<ForumIcon />}
          />
        </ChatBtn>
      )}

      <MyVideo>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </MyVideo>
    </PeerVideo>
  );
};
export default ReportCallPage;

const PeerVideo = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
`;
const MyVideo = styled.div`
  left: 1rem;
  bottom: 1px;
  width: 40vw;
  height: 30vh;
  flex-shrink: 0;
  border-radius: 20px;
  position: absolute;
  background-color: black;
  z-index: 1;
`;
const VideoBtn = styled.div`
  height: 55px;
  flex-shrink: 0;
  position: absolute;
  left: 2rem;
  top: 2rem;
  display: inline-flex;
  align-items: flex-start;
  gap: 16px;
`;

const ChatInputBox = styled.div`
  display: flex;
  height: 48px;
  justify-content: center;
  align-items: flex-end;
  align-self: stretch;
  position: relative;
  bottom: 0;
`;

const ChatBtn = styled.div`
  width: 55px;
  height: 55px;
  flex-shrink: 0;

  position: absolute;
  right: 2rem;
  bottom: 2rem;
`;
