import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Header, TabBar } from "@components/common";
import nfcimg from "@/assets/img/nfcimg.png";
import { getNFCToken } from "@/api/userApi";
import { toastAlert, confirmAlert } from "@/util/notificationAlert";
import useUserStore from "@/store/useUserStore";

const NfcInfoPage = () => {
  const { userId } = useUserStore();
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

  const onClickTokenModal = () => {
    let token = userNfc;
    if (!userNfc) {
      getNFCToken(
        userId,
        (response) => {
          setUserNfc(response.data.nfcToken);
          token = response.data.nfcToken;
        },
        (error) => {
          console.log(error);
        }
      );
    }

    confirmAlert(
      "NFC 토큰",
      "복사",
      (result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          navigator.clipboard
            .writeText(`saveme://open?tagId=${token}`)
            .then(() => {
              toastAlert(true, "NFC 토큰이 복사되었습니다");
            });
        }
      },
      `saveme://open?tagId=${token}`
    );
  };
  return (
    <Container>
      <Header navText="NFC 정보 등록" goTo="/menu" />

      <Content>
        <IconWrapper>
          <Icon src={nfcimg} alt="NFC Icon" />
        </IconWrapper>
        <Title>NFC 스티커와 SaveMe 앱 연동 안내</Title>
        <Description>
          NFC 스티커에 SaveMe 앱을 연동해두면, 위급 상황에서 다른 사람이
          사용자의 NFC 스티커에 태깅할 경우 사용자가 설정한 의료 정보가 즉시 119
          구급대원에게 전달되며, 사용자가 미리 등록해 둔 비상 연락망의
          사람들에게도 앱 푸시 알람이 전송됩니다.
        </Description>
        <Description>
          SAVE ME를 통해 사용자의 건강 상태와 중요 정보를 빠르게 공유하여, 응급
          상황에서 더욱 신속하고 적절한 신고를 할 수 있습니다. 아래 'NFC 툴즈
          사용법'을 참고하여 NFC 스티커에 앱을 연동해주세요!
        </Description>
        <StyledButton onClick={onClickTokenModal}>
          NFC 토큰 발급받기
        </StyledButton>
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
  padding: 0 2rem;
`;
const Title = styled.div`
  width: 100%;
  padding: 16px 0;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const Icon = styled.img`
  width: 30vw;
  height: 30vw;
`;

const Description = styled.p`
  color: var(--black-color-100);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: var(--main-orange-color);
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: var(--orange-color-200);
  }
`;
export default NfcInfoPage;
