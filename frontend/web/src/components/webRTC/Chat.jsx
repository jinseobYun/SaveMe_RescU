import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { session } from "../../util/openvidu"; // OpenVidu 세션 객체 가져오기
import SendIcon from "@mui/icons-material/Send";
import Text from "../elements/Text";
import Button from "../elements/Button";

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const chatWrapperRef = useRef(null);
  const userIdRef = useRef(null); // 현재 사용자의 ID 저장

  // OpenVidu 채팅 메시지 수신
  useEffect(() => {
    if (session) {
      // 세션 연결 후 현재 사용자의 Connection ID 저장
      if (!userIdRef.current) {
        userIdRef.current = Date.now().toString();
      }

      const handleChatMessage = (event) => {
        // 수신된 메시지가 자신이 보낸 것이 아닌 경우에만 처리
        console.log("매세지관리 event:,", event)
        if (event.from.connectionId !== userIdRef.current) {
          console.log("상대방의 event data:", event.data);
          setChat((prevChat) => [
            ...prevChat,
            {
              alignment: "left", // 상대방 메시지는 항상 왼쪽에 정렬
              message: event.data,
            },
          ]);
        }
      };

      session.on("signal:my-chat", handleChatMessage);

      // Clean up the event listener on component unmount or when session changes
      return () => {
        session.off("signal:my-chat", handleChatMessage);
      };
    }

  }, [session]);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (messageInput.trim() !== "") {
      // OpenVidu를 통한 메시지 전송
      session
        .signal({
          data: messageInput,
          to: [], // 비어있으면 브로드캐스트
          type: "my-chat",
        })
        .then(() => {
          setChat([...chat, { alignment: "right", message: messageInput }]); // 내 메시지라면 오른쪽 정렬
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
          <ChatMessage key={index} alignment={message.alignment}>
            <Text children={message.message} $size="2rem" />
          </ChatMessage>
        ))}
      </ChatMessages>
      <ChatInputBox onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button type="submit">
          <SendIcon fontSize="large" />
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
`;

const ChatMessage = styled.div`
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

export default Chat;
