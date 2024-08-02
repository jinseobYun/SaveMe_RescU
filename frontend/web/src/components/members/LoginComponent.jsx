import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/elements/Button";
import Input from "../../components/elements/Input";
import { loginPost } from "../../api/membersApi";

import "./LoginComponent.css";

const initState = {
  memberId: "",
  password: "",
};

export default function LoginComponent() {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginParam((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = () => {
    console.log(loginParam);
    loginPost(loginParam);
    navigate("/main");
  };

  return (
    <div className="logincontainer">
      <div className="login-info">
        <div className="info-text">로그인 페이지</div>
      </div>
      <div className="login-input">
        <div className="id">
          <div className="input-tag">아이디 입력</div>
          <Input
            type="text"
            name="memberId"
            value={loginParam.memberId}
            onChange={handleInputChange}
            // setValue={(value) => handleInputChange("memberId", value)}
            placeholder="아이디를 입력하세요"
            showClearButton={true}
          />
        </div>
        <div className="password">
          <div className="input-tag">비밀번호 입력</div>
          <Input
            type="password"
            name="password"
            value={loginParam.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            showClearButton={true}
          />
        </div>
      </div>
      <Button className="login-button" _onClick={handleSubmit} disabled={false}>
        <div className="login-text">로그인</div>
      </Button>
    </div>
  );
}
