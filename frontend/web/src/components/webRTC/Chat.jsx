import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { sendMessage, receiveMessage } from "../../util/socket";
import SendIcon from "@mui/icons-material/Send";
import Text from "../elements/Text";
import Button from "../elements/Button";

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const chatWrapperRef = useRef(null);

  useEffect(() => {
    receiveMessage((data) => {
      setChat((prevChat) => [
        ...prevChat,
        { alignment: "left", message: data.message },
      ]);
    });
  }, []);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (messageInput.trim() !== "") {
      sendMessage(roomId, messageInput, "userID");
      setChat([...chat, { alignment: "right", message: messageInput }]);
      setMessageInput("");
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
  background-color: ${({ alignment }) =>
    alignment === "right"
      ? "var(--main-yellow-color)"
      : "var(--chat-pink-color)"};
  border-radius: 10px;
  max-width: 50%;
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
