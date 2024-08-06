import React, { useRef, useEffect, useState, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";

import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicOffIcon from "@mui/icons-material/MicOff";
import ForumIcon from "@mui/icons-material/Forum";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import SendIcon from "@mui/icons-material/Send";

import { Button, Text, Grid } from "@components/elements";
const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
  transports: ["websocket"],
  autoConnect: false,
  pingTimeout: 300000,
});

const configuration = {
  iceServers: [
    {
      urls: import.meta.env.VITE_ICE_SERVERS,
    },
  ],
};
let localStream;
let roomName;
let myPeerConnection;
let myDataChannel;
let localVideoRef;
let remoteVideoRef;
function makeConnection() {
  console.log("makeConnection");
  myPeerConnection = new RTCPeerConnection(configuration);
  myPeerConnection.addEventListener("icecandidate", (data) =>
    socket.emit("ice", data.candidate, roomName)
  );
  myPeerConnection.addEventListener("addstream", (data) => {
    console.log("pc.addStream", data);
    remoteVideoRef.current.srcObject = data.stream;
  });
}

const ReportCallPage = () => {
  //SECTION - user settings

  const [isChatting, setIsChatting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuAll, setShowMenuAll] = useState(false);

  const [muted, setMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);
  const [isCameraFront, setIsCameraFront] = useState(false);
  const [cameras, setCameras] = useState([]);

  const navigate = useNavigate();
  localVideoRef = useRef(null);
  remoteVideoRef = useRef(null);

  const handleMuteClick = () => {
    const enabled = !muted;
    localStream.getAudioTracks()[0].enabled = enabled;
    setMuted(enabled);
  };

  const handleCameraClick = () => {
    const enabled = !cameraOff;
    localStream.getVideoTracks()[0].enabled = enabled;
    setCameraOff(enabled);
  };

  const handleCameraChange = async () => {
    let index;
    //전면 1 후면 0
    if (isCameraFront) index = 0;
    else index = 1;
    setIsCameraFront(!isCameraFront);
    9;
    if (myPeerConnection) {
      const videoTrack = localStream.getVideoTracks()[0];
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    }
  };
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
    setChatBtnColor("var(--white-color-200)");
    localVideoRef.current.style.bottom = `70px`;
  };

  //SECTION - chatting
  const [chatBtnColor, setChatBtnColor] = useState();
  const [chatlog, setChatlog] = useState([]);
  const inputRef = useRef(null);
  const [input, setInput] = useState("");

  const onChangeMessage = (e) => {
    setInput(e.target.value);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (input.trim() !== "") {
      try {
        console.log(input);
        myDataChannel.send(input);
        setChatlog([...chatlog, { alignment: "right", message: input }]);
        setChatWrapperHeight(chatWrapperRef.current.offsetHeight); // 채팅 높이 업데이트
      } catch (e) {
        console.log(e);
      }
      inputRef.current.value = "";
    }
  };
  const [chatWrapperHeight, setChatWrapperHeight] = useState(0); // 채팅 높이 상태 추가
  const chatWrapperRef = useRef(null);

  useEffect(() => {
    // 채팅 높이 변경에 따라 myVideo의 위치 조정
    if (chatWrapperRef.current && localVideoRef.current) {
      const chatHeight = chatWrapperRef.current.offsetHeight;
      localVideoRef.current.style.bottom = `${chatHeight}px`;
    }
  }, [chatWrapperHeight]);

  //SECTION - 신고방 접속

  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");

      setCameras(cameras);
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
      audio: mikes.includes(deviceId)
        ? { deviceId: { exact: deviceId } }
        : true,
      video: cameras.includes(deviceId)
        ? { deviceId: { exact: deviceId } }
        : { facingMode: "user" },
    };
    try {
      localStream = await navigator.mediaDevices.getUserMedia(
        deviceId ? userConstrains : initialConstrains
      );

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // localStream.getAudioTracks()[0].enabled = !muted;
      // localStream.getVideoTracks()[0].enabled = !cameraOff;
      await myPeerConnection.addStream(localStream);
      if (!deviceId) {
        await getCameras();
      }
    } catch (e) {
      console.log(e);
    }
  }
  const [loading, setLoading] = useState(true);
  async function initCall() {
    makeConnection();
    await getMedia();
  }
  useEffect(() => {
    socket.connect();
    socket.on("already_in_room", () =>
      alert(`You are already in the other room.\nYou can enter only one room.`)
    );

    socket.on("is_full", (roomName) => {
      //TODO - 방 번호 재요청 api
      alert(`${roomName} is full.`);
    });

    socket.on("is_available", async (roomName) => {
      console.log(`${roomName} is available`);
      await initCall();
      socket.emit("join_room", roomName);
    });

    socket.on("start_chat", () => {
      myDataChannel = myPeerConnection.createDataChannel("chat");
      myDataChannel.addEventListener("message", (event) => {
        console.log(event.data);
        if (isChatting) {
          setChatWrapperHeight.current &&
            setChatWrapperHeight(chatWrapperRef.current.offsetHeight);
          console.log(chatWrapperRef.current.offsetHeight);
        } else {
          setChatBtnColor("var(--main-yellow-color)");
        }
      });

      socket.emit("join_chat", roomName);
    });

    socket.on("join_chat", () => {
      myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message", (event) => {
          setChatlog([...chatlog, { message: event.data, alignment: "left" }]);
          if (isChatting) {
            setChatWrapperHeight.current &&
              setChatWrapperHeight(chatWrapperRef.current.offsetHeight);
            console.log(chatWrapperRef.current.offsetHeight);
          } else {
            setChatBtnColor("var(--main-yellow-color)");
          }
        });
      });
    });

    socket.on("send_offer", async () => {
      const offer = await myPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      console.log("sendging offer", offer);
      myPeerConnection.setLocalDescription(offer);
      console.log(roomName, offer);
      socket.emit("offer", offer, roomName);
    });
    socket.on("message", async (message) => {
      console.log("message", message);
    });

    socket.on("offer", async (offer) => {
      console.log("offer받음", offer);
      myPeerConnection.setRemoteDescription(offer);
      const answer = await myPeerConnection.createAnswer();
      myPeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer, roomName);
    });

    socket.on("answer", (answer) =>
      myPeerConnection.setRemoteDescription(answer)
    );

    socket.on("ice", (ice) => {
      myPeerConnection.addIceCandidate(ice);
      console.log("ice 받음", ice);
    });

    //SECTION - 신고 요청 api
    //만약 로그인 되잇다면 로그인id도 같이
    //res로 받은 roodId넣어서 방에 들어갈 수 있는지 요청
    // socket.emit('check_room',roomId);
    roomName = "1";
    socket.emit("check_room", roomName);
    //TODO - 신고 전달 내용 채우기
    const userId = "userID";
    const data = {
      userId: userId,
      roomId: "1",
      type: "report",
      content: "신고할 내용",
      reportReason: "신고 이유",
      reportTarget: "신고 대상",
    };
    // socket.emit("message", { type: "send_report_info", data }, "1");

    // window.addEventListener("chatMessage", (event) => {
    //   setChatMessages((prevMessages) => [
    //     ...prevMessages,
    //     { message: event.detail.message, alignment: event.detail.alignment },
    //   ]);
    // });
    return () => {
      if (socket.readyState === 1) {
        socket.disconnect();
        socket.close();
      }
    };
  }, []);

  const onClickCallEnd = () => {
    if (myPeerConnection) {
      myPeerConnection.close();
      myPeerConnection = null;
    }
    remoteVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
      remoteVideoRef.current.srcObject.removeTrack(track);
    });
    socket.disconnect();

    navigate("/");
  };
  return (
    <>
      <PeerVideo
        onClick={onClickScreen}
        ref={remoteVideoRef}
        muted
        autoPlay
        playsInline
      />
      {showMenuAll && (
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
          <Button
            onClick={handleCameraChange}
            $width="55px"
            $height="55px"
            $radius="50%"
            $bg={{ default: "var(--white-color-200)" }}
            children={<CameraswitchIcon />}
          />
          <Button
            _onClick={onClickCallEnd}
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
        <ChattingWrapper ref={chatWrapperRef}>
          {chatlog && (
            <ChattingContents>
              {chatlog.map((message, index) => (
                <Grid
                  key={index}
                  $display="flex"
                  $justify_content={
                    message.alignment === "right" ? "flex-end" : "flex-start"
                  }
                  $align_items=""
                >
                  <ChattingMessage
                    alignment={message.alignment}
                    message={message.message}
                  >
                    <Text children={message.message} $size="2rem" />
                  </ChattingMessage>
                </Grid>
              ))}
            </ChattingContents>
          )}
          <ChatInputBox>
            <input type="text" ref={inputRef} onChange={onChangeMessage} />
            <button onClick={handleMessageSubmit}>
              <SendIcon fontSize="large" />
            </button>
            {/* <Button
              _onClick={handleMessageSubmit}
              $width="39px"
              $height="48px"
              $bg={{ default: "transparent" }}
              children={}
            /> */}
          </ChatInputBox>
        </ChattingWrapper>
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

      <MyVideo ref={localVideoRef} autoPlay />
    </>
  );
};

const PeerVideo = styled.video`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  background-color: pink;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
`;
const MyVideo = styled.video`
  left: 1rem;
  bottom: 1rem;
  width: 40vw;
  height: 30vh;
  flex-shrink: 0;
  border-radius: 20px;
  position: absolute;
  background-color: black;
  z-index: 1;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
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

// const ChatInputBox = styled.div`
//   display: flex;
//   height: 48px;
//   justify-content: center;
//   align-items: center;
//   align-self: stretch;
//   position: relative;
//   bottom: 0;
// `;

const ChatBtn = styled.div`
  width: 55px;
  height: 55px;
  flex-shrink: 0;

  position: absolute;
  right: 2rem;
  bottom: 2rem;
`;

const ChattingWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 44vh; /* 최대 높이 설정 */
  border-top: 1px solid #ddd;
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 추가 */
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease; /* 높이 변경에 애니메이션 추가 */

  /* 내용이 없을 때는 입력 박스 크기만큼만 높이 유지 */
  &.empty {
    height: 48px; /* 입력 박스 크기 */
  }

  /* 채팅이 생길 때마다 자동으로 높이 조절 */
  &.filled {
    height: auto;
  }
`;

const ChattingContents = styled.div`
  flex: 1;
  overflow-y: auto;
  // padding: 10px;&:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const ChattingMessage = styled.div`
  display: flex;
  margin: 5px 0;
  padding: 10px;
  align-items: ${({ alignment }) =>
    alignment === "right" ? "flex-end" : "flex-start"};
  background-color: ${({ alignment }) =>
    alignment === "right"
      ? "var(--main-yellow-color)"
      : "var(--chat-pink-color)"};
  border-radius: 10px;
  max-width: 50%;
`;

const ChatInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #ccc;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }
`;

export default ReportCallPage;
