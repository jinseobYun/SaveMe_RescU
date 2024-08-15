import React from "react";
import { Link } from "react-router-dom";
import "./AdminMenus.css";

export default function     () {
  return (
    <nav id="navbar">
      <div className="menu-left">
        <div>
        </div>
        <div>
        </div>
      </div>
      <div className="admin-logo-box">
        <div className="logo"></div>
      </div>
      <div className="admin-menu-right">
        <div className="open-search">
          <Link to={"/admin"}>계정조회</Link>
        </div>
        <div className="logout">
          <Link to={"/"}>로그아웃</Link>
        </div>
      </div>
    </nav>
  );
}
