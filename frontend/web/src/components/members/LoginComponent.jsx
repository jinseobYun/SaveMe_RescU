import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import logoImage from "../../assets/RescULogo.png"
import Button from "../../components/elements/Button";
import Input from "../../components/elements/Input";

// import { loginPost } from "../../api/membersApi";
import "./LoginComponent.css";

const initState = {
  memberId: "",
  password: "",
};

export default function LoginComponent() {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const navigate = useNavigate();
  const { doLogin } = useCustomLogin();

  const handleInputChange = (e) => {
    setLoginParam((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
  try {
    const data = await doLogin(loginParam);
    console.log(data);
    if (data.error) {
      alert("이메일 또는 패스워드를 확인하세요.");
    } else {
      // 로그인 성공 시 JWT 토큰을 로컬 스토리지에 저장
      sessionStorage.setItem("JWT-AccessToken", data.accessToken);
      sessionStorage.setItem("JWT-RefreshToken", data.refreshToken);
      sessionStorage.setItem("memberId", loginParam.memberId);
      alert("로그인 성공");
      navigate("/main");
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    alert("로그인 중 오류가 발생했습니다.");
  }
}

return (
  <div className="logincontainer">
    <div className="login-info">
      <img src={logoImage} alt="로고" className="login-logo-image" />
    </div>
    <div className="login-input">
      <div className="id">
        <div className="input-tag">아이디</div>
        <Input
          type="text"
          name="memberId"
          value={loginParam.memberId}
          onChange={handleInputChange}
          placeholder="아이디"
          showClearButton={true}
        />
      </div>
      <div className="password">
        <div className="input-tag">비밀번호</div>
        <Input
          type="password"
          name="password"
          value={loginParam.password}
          onChange={handleInputChange}
          placeholder="비밀번호"
          showClearButton={true}
        />
      </div>
      <Button 
       className="login-button btn-12" 
      _onClick={handleSubmit} 
       disabled={false}
      $bg={{ default: "#fff5b3", hover: "#ffde4d" }} >
          <span className="login-text">로그인</span>
        </Button>
    </div>
  </div>
);
}
