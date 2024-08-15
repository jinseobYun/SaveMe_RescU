import React, { useState } from "react";
import Input from "../elements/Input";
import Button from "../elements/Button";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updatePasswordAsync } from "../../slices/loginSlice";

import "./PasswordUpdate.css";

const PasswordUpdate = () => {
  const dispacth = useDispatch();
  const navigate = useNavigate();

  const [memberId, setMemberId] = useState(""); // 아이디 상태 추가
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMatching, setIsMatching] = useState(null);

  const handleMemberIdChange = (e) => {
    setMemberId(e.target.value); // 아이디 입력 핸들러 추가
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    validatePasswords(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    validatePasswords(newPassword, value);
  };

  const validatePasswords = (newPassword, confirmPassword) => {
    if (newPassword && confirmPassword) {
      setIsMatching(newPassword === confirmPassword);
    } else {
      setIsMatching(null);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid =
    memberId && currentPassword && newPassword && confirmPassword && isMatching; // 아이디 조건 추가

  // 비밀번호 변경 클릭
  const handleSubmit = async () => {
    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      newPasswordConfirm: confirmPassword,
    };
    try {
      await dispacth(updatePasswordAsync(payload));
      alert("비밀번호 변경 성공");
      dispatch(logout());
      navigate("/");
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMessage("잘못된 요청입니다.");
            break;
          case 401:
            setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
            dispatch(logout());
            navigate("/");
            break;
          case 403:
            setErrorMessage("현재 비밀번호가 일치하지 않습니다.");
            break;
          case 422:
            setErrorMessage("새 비밀번호와 새 비밀번호 확인 입력이 다릅니다.");
            break;
          case 500:
            setErrorMessage("서버에서 오류가 발생했습니다. 다시 시도해주세요.");
            break;
          default:
            setErrorMessage("알 수 없는 오류가 발생했습니다.");
        }
      }
    }
  };

  return (
    <div className="password-update-container">
      <div className="password-update-info">
        <div className="info-text">계정정보수정</div>
      </div>
      <div className="password-update-input">
        <div className="password-update-item">
          <div className="input-tag">아이디 입력</div>{" "}
          <Input
            type="text"
            name="memberId"
            value={memberId}
            onChange={handleMemberIdChange}
            maxLen={20}
            required
          />
        </div>
        <div className="password-update-item">
          <div className="input-tag">기존 비밀번호 입력</div>
          <Input
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            maxLen={20}
            required
          />
        </div>
        <div className="password-update-item">
          <div className="input-tag">신규 비밀번호 입력</div>
          <Input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            maxLen={20}
            required
          />
        </div>
        <div className="password-update-item">
          <div className="input-tag">신규 비밀번호 확인</div>
          <Input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            maxLen={20}
            required
            isError={isMatching === false}
            successMessage={isMatching ? "비밀번호가 일치합니다" : ""}
            errorMessage={
              isMatching === false ? "비밀번호가 일치하지 않습니다" : ""
            }
          />
        </div>
      </div>
      <div className="password-update-button">
        <Button
          className="password-update-button"
          _onClick={handleSubmit}
          disabled={!isFormValid}
        >
          <div className="button-text">비밀번호 변경</div>
        </Button>
      </div>
    </div>
  );
};

export default PasswordUpdate;
