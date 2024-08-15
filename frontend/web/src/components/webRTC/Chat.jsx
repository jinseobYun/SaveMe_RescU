// src/components/webRTC/Chat.jsx

import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { session } from "../../util/openvidu";
import SendIcon from "@mui/icons-material/Send";
import Text from "../elements/Text";
import Button from "../elements/Button";

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const chatWrapperRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    if (session) {
      if (!userIdRef.current) {
        userIdRef.current = Date.now().toString();
      }

      const handleChatMessage = (event) => {
        const eventJson = JSON.parse(event.data);
        const alignment = eventJson.sender === "web" ? "right" : "left";

        const isSTTMessage = eventJson.sender === "stt";

        if (
          eventJson.sender !== "web" &&
          event.from.connectionId !== userIdRef.current
        ) {
          console.log("상대방의 event data:", event.data);
          setChat((prevChat) => [
            ...prevChat,
            {
              alignment: alignment,
              message: eventJson.message,
              isSTTMessage: isSTTMessage,
            },
          ]);
        } else if (eventJson.sender === "web") {
          setChat((prevChat) => [
            ...prevChat,
            {
              alignment: "right",
              message: eventJson.message,
              isSTTMessage: isSTTMessage,
            },
          ]);
        } else if (eventJson.sender === "stt") {
          setChat((prevChat) => [
            ...prevChat,
            {
              alignment: "mid",
              message: eventJson.message,
              isSTTMessage: isSTTMessage,
            },
          ]);
        }
      };

      session.on("signal:my-chat", handleChatMessage);

      return () => {
        try {
          session.off("signal:my-chat", handleChatMessage);
        } catch (error) {
          console.warn(
            "Session was already closed or could not remove the event listener:",
            error
          );
        }
      };
    }
  }, [session]);

  // 채팅이 업데이트될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
    }
  }, [chat]);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (messageInput.trim() !== "") {
      const data = { message: messageInput, sender: "web" };
      session
        .signal({
          data: JSON.stringify(data),
          to: [], // 비어있으면 브로드캐스트
          type: "my-chat",
        })
        .then(() => {
          setChat([
            ...chat,
            { alignment: "right", message: messageInput, isSTTMessage: false },
          ]);
          setMessageInput("");
        })
        .catch((error) => {
          console.error("Message sending failed:", error);
        });
    }
  };

  return (
    <ChatContainer>
      <ChatMessages ref={chatWrapperRef}>
        {chat.map((message, index) => (
          <ChatMessage
            key={index}
            $alignment={message.alignment}
            $isSTTMessage={message.isSTTMessage}
          >
            <Text children={message.message} $size="2rem" />
          </ChatMessage>
        ))}
      </ChatMessages>
      <ChatInputBox onSubmit={handleMessageSubmit}>
        <StyledInput
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button type="submit" $color="#FFF" $size="30px" $width="10rem">
          <SendIcon fontSize="30rem" />
        </Button>
      </ChatInputBox>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  scrollbar-width: none;
`;

const ChatMessage = styled.div`
  display: flex;
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 100%;
  justify-content: ${({ $alignment }) =>
    $alignment === "right" ? "flex-end" : "flex-start"}; // 수정된 부분
  background-color: ${({ $alignment, $isSTTMessage }) =>
    $isSTTMessage
      ? "var(--chat-stt-color)"
      : $alignment === "right"
      ? "var(--main-yellow-color)"
      : "var(--chat-pink-color)"}; // 수정된 부분
  margin-left: ${({ $alignment }) =>
    $alignment === "right" ? "50%" : "0px"}; // 수정된 부분
  margin-right: ${({ $alignment }) =>
    $alignment === "left" ? "50%" : "0px"}; // 수정된 부분
  ${({ $isSTTMessage }) =>
    $isSTTMessage &&
    css`
      font-weight: bold;
      width: 100%; // 전체 너비를 차지하도록 설정
      text-align: center; // 텍스트를 가운데 정렬
    `}
  & p {
    word-break: break-all;
  }
`;

const ChatInputBox = styled.form`
  display: flex;
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

const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 20px; // 원하는 크기로 조정
`;

export default Chat;
