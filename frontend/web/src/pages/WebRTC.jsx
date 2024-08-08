import React, { useState } from "react";
import Button from "../components/elements/Button";
// import WebRTC from "../components/webRTC/WebRTC";
import styled from "styled-components";
import FirstInfo from "../components/webRTC/FirstInfo";
import SecondInfo from "../components/webRTC/SecondInfo";
import { Outlet,} from "react-router-dom";

// import Chat from "../components/webRTC/Chat";
import "./WebRTC.css";

const WebRtcPage = () => {
  const [dispatchOrderId, setDispatchOrderId] = useState(null);

  return (
    <div className="webrtc">
      <div className="left-side">
        <Outlet context={{ setDispatchOrderId, dispatchOrderId }} />
      </div>
      <div className="center">{/* <WebRTC /> */}</div>
      <div className="right-side">{/* <Chat /> */}</div>
    </div>
  );
};

export default WebRtcPage;
