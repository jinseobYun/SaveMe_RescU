import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Header, TabBar } from "@components/common";
import { Grid, Button, Text, Input } from "@components/elements";
import nfcimg from "@/assets/img/nfcimg.png";
const NfcInfoPage = () => {
  const [userNfc, setUserNfc] = useState(null);
  const onClickShowModal = () => {};
  const btnStyles = {
    _onClick: onClickShowModal,
    children: "등록하기 >",
    $radius: "8px",
    $bg: {
      default: "var(--orange-op50-color)",
      hover: "var(--main-orange-color)",
    },
    $color: {
      default: "var(--white-color-200)",
    },
    $padding: "1rem 2rem",
    $size: "24px",
    $bold: true,
    // $padding: "14px 32px",
    $width: "",
    $height: "10vh",
  };
  return (
    <Container>
      <Header navText="NFC " goTo="/menu" />

      <Content>
        <div>NFC 스티커와 연동된 SaveMe 앱 사용 안내</div>
        <IconWrapper>
          <Icon src={nfcimg} alt="NFC Icon" />
        </IconWrapper>
        <Description>
          NFC 스티커에 SaveMe 앱을 연동해두면, 위급 상황에서 다른 사람이
          사용자의 NFC 스티커에 태깅할 경우 자동으로 SaveMe 앱이 실행됩니다.
          이때 사용자가 설정한 의료 정보가 즉시 119 구급대원에게 전달되며,
          사용자가 미리 등록해 둔 비상 연락망의 사람들에게도 앱 푸시 알람이
          전송됩니다. 이 기능을 통해 사용자의 건강 상태와 중요 정보를 빠르게
          공유하여, 응급 상황에서 더욱 신속하고 적절한 도움을 받을 수 있습니다.
          아래 'NFC 툴즈 사용법'을 참고하여 NFC 스티커에 앱을 연동해주세요!
        </Description>
        <StyledButton>NFC 사용법</StyledButton>
        <Link to="https://pioapp.tistory.com/51" />
      </Content>
      <TabBar />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
const Content = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  overflow: auto;
  height: 83vh;
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const Icon = styled.img`
  width: 60px;
  height: 60px;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #005bb5;
  }
`;
export default NfcInfoPage;
