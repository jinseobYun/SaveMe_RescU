import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BasicMenus.css";

export default function BasicMenus() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage 초기화
    localStorage.clear();
    sessionStorage.clear();

    // member 쿠키 삭제
    document.cookie = "member=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 로그아웃 후 메인 페이지로 이동
    navigate("/");
  };

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
        <Link to={"/main"}>
          <div className="logo"></div>
        </Link>
      </div>
      <div className="menu-right">
        <div className="open-edit-password">
          <Link to={"/mypage"}>비밀번호 수정</Link>
        </div>
        <div className="logout">
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
    </nav>
  );
}