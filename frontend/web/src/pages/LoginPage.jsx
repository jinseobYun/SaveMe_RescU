import React from "react";
import { useState } from "react";
import "./LoginPage.css";
import BasicLayout from "../layouts/BasicLayout";
import Button from "../components/elements/Button";
import Input from "../components/elements/Input";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);
    navigate("/main");
  };

  return (
    <BasicLayout>
      <div className="logincontainer">
        <div className="login-info">
          <div className="info-text">로그인 페이지</div>
        </div>
        <div className="login-input">
          <div className="id">
            <div className="input-tag">아이디 입력</div>
            <Input
              type="text"
              name="username"
              value={formData.username}
              setValue={(value) => handleInputChange("username", value)}
              placeholder="아이디를 입력하세요"
              showClearButton={true}
            />
            {/* <input className="input"></input> */}
          </div>
          <div className="password">
            <div className="input-tag">비밀번호 입력</div>
            <Input
              type="password"
              name="password"
              value={formData.password}
              setValue={(value) => handleInputChange("password", value)}
              placeholder="비밀번호를 입력하세요"
              showClearButton={true}
            />
          </div>
        </div>
        <Button
          className="login-button"
          _onClick={handleSubmit}
          disabled={false}
        >
          <div className="login-text">로그인</div>
        </Button>
      </div>
    </BasicLayout>
  );
}
