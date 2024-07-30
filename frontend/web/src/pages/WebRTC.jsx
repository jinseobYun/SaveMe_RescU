import React, { useState } from "react";
import Button from "../components/elements/Button";
import Input from "../components/elements/Input";
import WebRTC from "../components/WebRTC";
import styled from "styled-components";
import FirstInfo from "../components/FirstInfo";
import "./WebRTC.css";

const WebRtcPage = () => {
  const [activeComponent, setActiveComponent] = useState("component1");

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="webrtc">
      <div className="left-side">
        {activeComponent === "component1" && <FirstInfo />}
        {activeComponent === "component2" && (
          <Component2>
            <Input label="Another Input" placeholder="Enter more..." />
          </Component2>
        )}
        {/* <Button
          $text="First Info"
          _onClick={() => handleComponentChange("component1")}
        />
        <Button
          $text="Second Info"
          _onClick={() => handleComponentChange("component2")}
        /> */}
      </div>
      <div className="center">
        {/* RTC component */}
        <WebRTC />
      </div>
      <div className="right-side">
        {/* Chatting component */}
        <SocketChat>
          {/* 채팅 심기. */}
          <p>채팅 심기</p>
        </SocketChat>
      </div>
    </div>
  );
};

const Component1 = styled.div`
  /* Component 1 styles */
`;

const Component2 = styled.div`
  /* Component 2 styles */
`;

const SocketChat = styled.div`
  /* Socket chat styles */
`;

export default WebRtcPage;
