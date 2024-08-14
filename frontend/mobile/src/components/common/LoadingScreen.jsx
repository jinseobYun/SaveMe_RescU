import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes 정의
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 스타일 컴포넌트 정의
const LoadingScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 5px solid transparent;
  border-top-color: #ffcc70;
  margin-bottom: 10px;
  animation: ${spin} 1s linear infinite;
`;

// 컴포넌트 정의
const LoadingScreen = () => {
  return (
    <LoadingScreenContainer>
      <Spinner />
      <p>연결 중...</p>
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;
