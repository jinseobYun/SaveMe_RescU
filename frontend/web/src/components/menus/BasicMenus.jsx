import React from "react";
import { Link } from "react-router-dom";
import "./BasicMenus.css";

export default function BasicMenus() {
  return (
    <nav id="navbar">
      <div className="menu-left">
        <div className="open-map">
          <Link to={"/map"}>지도창열기</Link>
        </div>
        <div className="open-rtc">
          <Link to={"/webrtc"}>화상대기</Link>
        </div>
      </div>
      <div className="logo-box">
        <div className="logo"></div>
      </div>
      <div className="menu-right">
        <div className="open-edit-password">
          <Link to={"/map"}>비밀번호 수정</Link>
        </div>
        <div className="logout">
          <Link to={"/"}>로그아웃</Link>
        </div>
      </div>
    </nav>
  );
}
