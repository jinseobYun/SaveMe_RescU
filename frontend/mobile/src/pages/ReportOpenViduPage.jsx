import React, { useRef, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  initOpenVidu,
  leaveSession,
  mainStreamManager,
  subscribers,
  toggleAudio,
  toggleVideo,
  session,
} from "@/util/openvidu";

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
import useUserStore from "@/store/useUserStore";
import { getReportSessionId } from "@api/reportApi";

const ReportOpenViduPage = () => {
  //SECTION - user settings
  const userId = useUserStore((state) => state.userId);
  const currentLocation = useUserStore((state) => state.gps);
  //FIXME - useEfftct에서 값이 없음
  const [loading, setLoading] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuAll, setShowMenuAll] = useState(false);

  const [muted, setMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);
  const [isCameraFront, setIsCameraFront] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  // 상대방 스트림 상태 관리
  const navigate = useNavigate();
  const [remoteStream, setRemoteStream] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleMuteClick = () => {
    const enabled = toggleAudio();
    setMuted(enabled);
  };

  const handleCameraClick = () => {
    const enabled = toggleVideo();
    setCameraOff(enabled);
  };

  useEffect(() => {
    //FIXME - 세션id 요청
    // getReportSessionId(
    //   (response) => {
    //     console.log("getReportSessionId success: ", response);
    //     setSessionId(response.data.sessionId);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    setSessionId("ses_G4tWX7SMuX");

    //TODO - 태깅정보
    const tagId = "tagID";

    const reportData = {
      userId: userId,
      location: currentLocation,
    };
    if (tagId) reportData.tagId = tagId;
    console.log("reportData: ", reportData);

    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
    const user = { username: "myname", userno: 1 }; // 실제 사용자 정보로 대체
    if (sessionId) {
      initOpenVidu(sessionId, user).then(() => {
        console.log("OpenVidu Init 시작!");
        if (mainStreamManager) {
          localVideoRef.current.srcObject =
            mainStreamManager.stream.getMediaStream();
        }
        console.log("OpenVidu Init 성공!");
      });
    }
    const handleStreamCreated = (event) => {
      console.log("상대방 접속 시작!");
      const subscriber = event.detail.subscriber;
      console.log("subscriber이에요:", subscriber);
      if (subscriber) {
        setTimeout(() => {
          const stream = subscriber.stream.getMediaStream();
          if (stream) {
            setRemoteStream(stream);
            console.log("상대방 비디오 연결 완료");
          }
        }, 1000);
      }
      console.log("상대방 컴퓨터 연결 완료!");
    };

    window.addEventListener("streamCreated", handleStreamCreated);

    return () => {
      leaveSession();
    };
  }, [sessionId]);

  const onClickCallEnd = () => {
    leaveSession();
    navigate("/");
  };

  useEffect(() => {
    if (remoteStream) {
      console.log("remoteStream 설정됨:", remoteStream);
      if (remoteVideoRef.current) {
        console.log("상대방 컴퓨터 정보:", remoteVideoRef.current);
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [remoteStream]);

  const handleCameraChange = useCallback(async () => {
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
            await session.unpublish(mainStreamManager);
            await session.publish(newPublisher);
            setCurrentVideoDevice(newVideoDevice[0]);
            localVideoRef.current.srcObject =
              newPublisher.stream.getMediaStream();
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentVideoDevice, mainStreamManager]);

  const onClickScreen = () => {
    if (isChatting && !showMenuAll) {
      setShowMenu(true);
      setIsChatting(false);
      localVideoRef.current.style.bottom = `10px`;
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
  const [input, setInput] = useState("");

  const onChangeMessage = (e) => {
    setInput(e.target.value);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (input.trim() !== "") {
      const data = { message: input, sender: "app" };
      session
        .signal({
          data: JSON.stringify(data),
          to: [], // 비어있으면 브로드캐스트
          type: "my-chat",
        })
        .then(() => {
          setChatlog((prev) => [
            ...prev,
            { alignment: "right", message: input },
          ]);
          setInput("");
          setChatlogWrapperHeight(chatWrapperRef.current.offsetHeight); // 채팅 높이 업데이트
        })
        .catch((error) => {
          console.error("Message sending failed:", error);
        });
    }
  };
  const [chatWrapperHeight, setChatlogWrapperHeight] = useState(0); // 채팅 높이 상태 추가
  const chatWrapperRef = useRef(null);
  useEffect(() => {
    // 채팅 높이 변경에 따라 myVideo의 위치 조정
    if (chatWrapperRef.current && localVideoRef.current) {
      const chatHeight = chatWrapperRef.current.offsetHeight;
      console.log("chatHeight: ", chatHeight);
      localVideoRef.current.style.bottom = `${chatHeight}px`;
    }
  }, [chatWrapperHeight]);
  useEffect(() => {
    if (session) {
      const handleChatMessage = (event) => {
        // 수신된 메시지가 자신이 보낸 것이 아닌 경우에만 처리
        const eventJson = JSON.parse(event.data);
        console.log(eventJson);
        if (eventJson.sender !== "app") {
          console.log("상대방의 event data:", eventJson.message);
          setChatlog((prev) => [
            ...prev,
            { message: eventJson.message, alignment: "left" },
          ]);
          if (isChatting) {
            setChatlogWrapperHeight.current &&
              setChatlogWrapperHeight(chatWrapperRef.current.offsetHeight);
          } else {
            setChatBtnColor("var(--main-yellow-color)");
          }
        }
      };

      session.on("signal:my-chat", handleChatMessage);

      //TODO - 태깅정보
      const tagId = "tagID";
      const reportData = {
        userId: userId,
        location: currentLocation,
      };
      if (tagId) reportData.tagId = tagId;
      console.log("reportData: ", reportData);

      session
        .signal({
          data: JSON.stringify(reportData), // 객체를 문자열로 변환하여 전송
          to: [], // 비어있으면 브로드캐스트
          type: "report-info", // 신호의 타입을 지정하여 구분
        })
        .then(() => {
          console.log("Report info successfully sent");
        })
        .catch((error) => {
          console.error("Error sending report info:", error);
        });

      return () => {
        // session.off("signal:my-chat", handleChatMessage);
      };
    }
  }, [session]);

  return (
    <>
      <PeerVideo
        onClick={onClickScreen}
        ref={remoteVideoRef}
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
            <input type="text" onChange={onChangeMessage} value={input} />
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
  border-radius: 10px;
  max-width: 100%;
  justify-content: ${({ alignment }) =>
    alignment === "right" ? "flex-end" : "flex-start"};
  background-color: ${({ alignment }) =>
    alignment === "right"
      ? "var(--main-yellow-color)"
      : "var(--chat-pink-color)"};
  margin-left: ${({ alignment }) => (alignment === "right" ? "50%" : "0px")};
  margin-right: ${({ alignment }) => (alignment === "left" ? "50%" : "0px")};
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

export default ReportOpenViduPage;
