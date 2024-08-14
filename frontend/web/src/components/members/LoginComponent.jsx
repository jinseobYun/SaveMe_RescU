import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import logoImage from "../../assets/RescULogo.png";
// import Button from "../../components/elements/Button";
// import Input from "../../components/elements/Input";


import "./LoginComponent.css";

const initState = {
  memberId: "",
  password: "",
  rememberMe: false,
};

export default function LoginComponent() {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const navigate = useNavigate();
  const { doLogin } = useCustomLogin();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginParam((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = await doLogin(loginParam);
      console.log(data);
      if (data.error) {
        alert("이메일 또는 패스워드를 확인하세요.");
      } else {
        sessionStorage.setItem("JWT-AccessToken", data.accessToken);
        sessionStorage.setItem("JWT-RefreshToken", data.refreshToken);
        sessionStorage.setItem("memberId", loginParam.memberId);
        if (loginParam.rememberMe) {
          localStorage.setItem("rememberMe", loginParam.memberId);
        } else {
          localStorage.removeItem("rememberMe");
        }
        alert("로그인 성공");
        navigate("/main");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="logincontainer">
      <div className="login-info">
        <img src={logoImage} alt="로고" className="login-logo-image" />
      </div>
      <div className="login-input">
        <div className="login-input-tag">아이디</div>
        <input
          type="text"
          name="memberId"
          value={loginParam.memberId}
          onChange={handleInputChange}
          placeholder="아이디"
          className="input-field"
        />

        <div className="login-input-tag">비밀번호</div>
        <input
          type="password"
          name="password"
          value={loginParam.password}
          onChange={handleInputChange}
          placeholder="비밀번호"
          className="input-field"
        />

        <div className="remember-me">
          <input
            type="checkbox"
            name="rememberMe"
            checked={loginParam.rememberMe}
            onChange={handleInputChange}
            className="remember-me-checkbox"
          />
          <label htmlFor="rememberMe" className="remember-me-label">
            아이디 기억하기
          </label>
        </div>

        <button
          className="login-button btn-12"
          onClick={handleSubmit}
          disabled={false}
        >
          <span className="login-text">로그인</span>
        </button>
      </div>
    </div>
  );
}
