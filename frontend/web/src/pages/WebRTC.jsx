import React, { useState } from "react";
import Button from "../components/elements/Button";
import WebRTC from "../components/webRTC/WebRTC";
import styled from "styled-components";
import FirstInfo from "../components/webRTC/FirstInfo";
import SecondInfo from "../components/webRTC/SecondInfo";
import Chat from "../components/webRTC/Chat";
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
        {activeComponent === "component2" && <SecondInfo />}
        <Button
          $text="First Info"
          _onClick={() => handleComponentChange("component1")}
        />
        <Button
          $text="Second Info"
          _onClick={() => handleComponentChange("component2")}
        />
      </div>
      <div className="center">
        <WebRTC />
      </div>
      <div className="right-side">
        <Chat />
      </div>
    </div>
  );
};


export default WebRtcPage;
