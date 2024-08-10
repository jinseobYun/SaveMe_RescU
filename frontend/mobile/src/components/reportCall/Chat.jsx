import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ chatlog, onNewMessage }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (input.trim() !== "") {
      onNewMessage(input, "right");
      setInput("");
    }
  };

  const onChangeMessage = (e) => {
    setInput(e.target.value);
  };

  return (
    <ChattingWrapper>
      <ChattingContents>
        {chatlog.map((message, index) => (
          <MessageContainer key={index} alignment={message.alignment}>
            <ChattingMessage>{message.message}</ChattingMessage>
          </MessageContainer>
        ))}
      </ChattingContents>
      <ChatInputBox>
        <input type="text" ref={inputRef} onChange={onChangeMessage} />
        <button onClick={handleMessageSubmit}>
          <SendIcon fontSize="large" />
        </button>
      </ChatInputBox>
    </ChattingWrapper>
  );
};

const ChattingWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 44vh;
  border-top: 1px solid #ddd;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChattingContents = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${({ alignment }) =>
    alignment === "right" ? "flex-end" : "flex-start"};
  padding: 10px;
`;

const ChattingMessage = styled.div`
  background-color: ${({ alignment }) =>
    alignment === "right"
      ? "var(--main-yellow-color)"
      : "var(--chat-grey-color)"};
  color: black;
  padding: 8px 12px;
  border-radius: 12px;
  margin-bottom: 5px;
`;

const ChatInputBox = styled.div`
  display: flex;
  border-top: 1px solid #ddd;
  input {
    flex: 1;
    padding: 10px;
    border: none;
  }
  button {
    background: none;
    border: none;
    padding: 10px;
  }
`;

export default Chat;
