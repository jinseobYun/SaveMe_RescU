import React, { useRef, useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

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
import { LoadingScreen } from "@components/common";
import { successAlert } from "@/util/notificationAlert";
import { averageGps } from "@/util/dataProcessing";
import {
  initOpenVidu,
  leaveSession,
  setMainStreamManager,
  getMainStreamManager,
  subscribers,
  toggleAudio,
  toggleVideo,
  session,
  getPublisher,
  setPublisher,
  OV,
} from "@/util/openvidu";
const ReportOpenViduPage = () => {
  //SECTION - user settings
  const userId = useUserStore((state) => state.userId);
  const tagId = useUserStore((state) => state.tagId);
  const gpsList = useUserStore((state) => state.gps);

  const [loading, setLoading] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuAll, setShowMenuAll] = useState(false);

  const [muted, setMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  // 상대방 스트림 상태 관리
  const navigate = useNavigate();
  const [remoteStream, setRemoteStream] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleMuteClick = () => {
    const enabled = toggleAudio();
    console.log("handleMuteClick");
    setMuted(enabled);
  };
  useEffect(() => {
    console.log("Muted", muted);
  }, [muted]);
  const handleCameraClick = () => {
    const enabled = toggleVideo();
    setCameraOff(enabled);
  };

  useEffect(() => {
    const abortController = new AbortController();

    getReportSessionId(
      abortController,
      (response) => {
        console.log("getReportSessionId success: ", response);
        setSessionId(response.data.sessionId);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        successAlert(
          "현재 연결 가능한 119 대원이 없습니다.잠시후 시도해주세요",
          () => navigate("/", { replace: true })
        );
      },
      (error) => {
        setLoading(false);
        successAlert("신고를 종료하셨습니다.", () =>
          navigate("/", { replace: true })
        );
        navigate("/", { replace: true });
      }
    );
    return () => {
      abortController.abort();
      if (session) leaveSession();
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      initOpenVidu(sessionId).then(async () => {
        if (getMainStreamManager()) {
          const videoStream = new MediaStream(
            getMainStreamManager().stream.getMediaStream().getVideoTracks() // 비디오 트랙만 가져옴
          );
          localVideoRef.current.srcObject = videoStream;
          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = await getMainStreamManager()
            .stream.getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;

          const currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );
          console.log(
            "첫 연결후 비디오 디바이스 " + currentVideoDevice.deviceId
          );

          setCurrentVideoDevice(currentVideoDevice);
        }
      });
    }
    const handleStreamCreated = (event) => {
      const subscriber = event.detail.subscriber;
      if (subscriber) {
        setTimeout(() => {
          const stream = subscriber.stream.getMediaStream();
          if (stream) {
            setRemoteStream(stream);
          }
        }, 1000);
      }
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
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        setLoading(false);
      }
    }
  }, [remoteStream]);

  // const handleCameraChange = () => {
  //   const execute = async () => {
  //     try {
  //       const devices = await OV.getDevices();
  //       const videoDevices = devices.filter(
  //         (device) => device.kind === "videoinput"
  //       );
  //       // if (!videoDevices || videoDevices.length < 2) return;
  //       console.log("현재 비디오 " + currentVideoDevice.deviceId);
  //       const newVideoDevice = videoDevices.filter(
  //         (device) => device.deviceId !== currentVideoDevice.deviceId
  //       );

  //       for (let index = 0; index < newVideoDevice.length; index++) {
  //         console.log(
  //           "카메라 다른 디바이스 id : " + newVideoDevice[index].deviceId
  //         );
  //       }

  //       // console.log("새로운 디바이스 Id: " + newVideoDevice[0].deviceId);

  //       if (newVideoDevice.length > 0) {
  //         // 기존 퍼블리셔 언퍼블리시
  //         await session.unpublish(getPublisher());
  //         console.log("기존 퍼블리셔 제거 완료");

  //         // 새로운 퍼블리셔 생성
  //         let newPublisher = await OV.initPublisherAsync(undefined, {
  //           audioSource: undefined,
  //           // videoSource: isCameraFront ? newVideoDevice[0] : newVideoDevice[1],
  //           videoDevices: newVideoDevice[2],
  //           publishAudio: true,
  //           publishVideo: true,
  //           mirror: isCameraFront,
  //         });

  //         // 새로운 퍼블리셔를 상태에 설정
  //         setPublisher(newPublisher);

  //         // 새로운 퍼블리셔 퍼블리시
  //         await session.publish(newPublisher);

  //         // 상태 업데이트
  //         setIsCameraFront(!isCameraFront);
  //         setCurrentVideoDevice(newVideoDevice);
  //         // 로컬 비디오 업데이트
  //         const videoStream = new MediaStream(
  //           newPublisher.stream.getMediaStream().getVideoTracks()
  //         );
  //         localVideoRef.current.srcObject = videoStream;

  //         // 오디오 상태 유지
  //         getPublisher().publishAudio(muted);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  //   // execute 함수를 호출하여 비동기적으로 동작하도록 함
  //   execute();
  // };
  const handleCameraChange = useCallback(async () => {
    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      // if (!videoDevices || videoDevices.length < 2) return;
      console.log("바꾸기 전 아이디: " + currentVideoDevice.deviceId);
      let newPublisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: isCameraFront
          ? videoDevices[2].deviceId
          : videoDevices[0].deviceId,
        publishAudio: true, // 오디오 퍼블리싱 여부
        publishVideo: true, // 비디오 퍼블리싱 여부
        mirror: isCameraFront, // 전면 카메라일 경우 화면 반전 여부
      });
      console.log(
        "바꿀 아이디 : " + isCameraFront
          ? videoDevices[2].deviceId
          : videoDevices[0].deviceId
      );
      setIsCameraFront(!isCameraFront);

      await session.unpublish(getPublisher());
      console.log("기존 퍼블리셔 제거 완료");

      // 새로운 스트림을 퍼블리시합니다.
      // mainStreamManager = newPublisher;
      // setMainStreamManager(newPublisher);
      // console.log("새 미디어 스트림: " + getMainStreamManager());
      setPublisher(newPublisher);
      await session.publish(newPublisher);
      console.log("퍼블리쉬 재설정 완료");
      console.log("새 퍼블리쉬 " + getPublisher());
      // 비디오 요소에 스트림을 설정합니다.
      const videoStream = new MediaStream(
        newPublisher.stream.getMediaStream().getVideoTracks()
      );
      localVideoRef.current.srcObject = videoStream;

      // 오디오 상태 유지
      getPublisher().publishAudio(muted);
    } catch (e) {
      console.error(e);
    }
  }, [isCameraFront, getMainStreamManager, muted]);
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
    // localVideoRef.current.style.bottom = `70px`;
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
  const [chatlogWrapperHeight, setChatlogWrapperHeight] = useState(0); // 채팅 높이 상태 추가
  const chatWrapperRef = useRef(null);
  useEffect(() => {
    if (chatWrapperRef.current && localVideoRef.current) {
      const chatHeight = chatWrapperRef.current.offsetHeight;
      setChatlogWrapperHeight(chatHeight);

      localVideoRef.current.style.bottom = `${chatHeight}px`;
    }
  }, [chatlog, isChatting]);
  useEffect(() => {
    if (localVideoRef.current) {
      const chatHeight = chatWrapperRef.current.offsetHeight;
      localVideoRef.current.style.bottom = `${chatlogWrapperHeight + 16}px`; // 1rem = 16px
    }
  }, [chatlogWrapperHeight]);
  useEffect(() => {
    if (session) {
      const handleChatMessage = (event) => {
        const eventJson = JSON.parse(event.data);
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

      //TODO - gps
      const reportData = {
        userId: userId,
        location: averageGps(gpsList),
        tagId: null,
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
      {loading ? (
        <LoadingScreen />
      ) : (
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
                children={
                  cameraOff ? (
                    <VideocamIcon sx={{ fontSize: 24 }} />
                  ) : (
                    <VideocamOffIcon sx={{ color: " #CD3D64", fontSize: 24 }} />
                  )
                }
              />
              <Button
                _onClick={handleMuteClick}
                $width="55px"
                $height="55px"
                $radius="50%"
                $bg={{ default: "var(--white-color-200)" }}
                children={
                  muted ? (
                    <MicNoneIcon sx={{ fontSize: 24 }} />
                  ) : (
                    <MicOffIcon sx={{ color: " #CD3D64", fontSize: 24 }} />
                  )
                }
              />
              <Button
                _onClick={handleCameraChange}
                $width="55px"
                $height="55px"
                $radius="50%"
                $bg={{ default: "var(--white-color-200)" }}
                children={<CameraswitchIcon sx={{ fontSize: 24 }} />}
                $animation={keyframes`
                  0% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.2);
                  }
                  100% {
                    transform: scale(1);
                  }
                `}
              />
              <Button
                _onClick={onClickCallEnd}
                $width="55px"
                $height="55px"
                $radius="50%"
                $margin="0 0 0 6rem"
                $bg={{ default: "var(--main-red-color)" }}
                children={
                  <CallEndIcon sx={{ color: "#f4f4f4", fontSize: 24 }} />
                }
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
                children={<MoreHorizOutlinedIcon sx={{ fontSize: 24 }} />}
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
                      $align_items={
                        message.alignment === "right"
                          ? "flex-end"
                          : "flex-start"
                      }
                    >
                      <ChattingMessage alignment={message.alignment}>
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
                children={<ForumIcon sx={{ fontSize: 24 }} />}
              />
            </ChatBtn>
          )}

          <MyVideo ref={localVideoRef} autoPlay />
        </>
      )}
    </>
  );
};
export default ReportOpenViduPage;

const PeerVideo = styled.video`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  background-color: var(--black-color-200);
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
  padding: 10px;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const ChattingMessage = styled.div`
  display: flex;
  margin: 5px 0;
  padding: 10px;
  border-radius: 15px;
  max-width: 100%;
  width: fit-content;

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
