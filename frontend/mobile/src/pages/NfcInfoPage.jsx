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
    if (!userNfc) {
      getNFCToken(
        userId,
        (response) => {
          setUserNfc(response.data.nfcToken);
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
            .writeText(`saveme://open?tagId=${userNfc}`)
            .then(() => {
              toastAlert("NFC 토큰이 복사되었습니다");
            });
        }
      },
      `saveme://open?tagId=${userNfc}`
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
          상황에서 더욱 신속하고 적절한 신고를 할 수 있습니다. 아래 'NFC tools
          사용법'을 참고하여 NFC 스티커에 앱을 연동해주세요!
        </Description>
        <Title>
          NFC tools 사용법
        </Title>
        <SubContainer>
          <SubTitle>
            1. NFC Tools 설치 후 실행
          </SubTitle>
          <SubDescription>
            <StyledLink to="market://details?id=com.wakdev.wdnfc">이곳을 터치하면 설치화면으로 이동합니다.</StyledLink>
            <img src="/app/assets/img/nfc1.png" />
          </SubDescription>
        </SubContainer>
        <SubContainer>
          <SubTitle>
            2. 상단의 [쓰기] 탭으로 이동 후 기록 추가 선택
          </SubTitle>
          <SubDescription>
            <img src="/app/assets/img/nfc2.png" />
          </SubDescription>
        </SubContainer>
        <SubContainer>
          <SubTitle>
            3. [사용자 정의 URL/URI] 선택
          </SubTitle>
          <SubDescription>
            <img src="/app/assets/img/nfc3.png" />
          </SubDescription>
        </SubContainer>
        <SubContainer>
          <SubTitle>
            4. 입력창에 복사한 URI 붙여넣기 후 확인
          </SubTitle>
          <SubDescription>
            <StyledButton onClick={onClickTokenModal}>
                NFC 토큰 발급받기
            </StyledButton>
            <img src="/app/assets/img/nfc4.png" />
          </SubDescription>
        </SubContainer>
          <SubTitle>
            5. 쓰기 선택
          </SubTitle>
          <SubDescription>
            <img src="/app/assets/img/nfc5.png" />
          </SubDescription>
        <SubContainer>
          <SubTitle>
            6. NFC 스티커 태그
          </SubTitle>
          <SubDescription>
            태그 후 초록색 체크가 떴다면 성공입니다. 빨간색 X가 떴다면 다시 시도해주세요.
            <img src="/app/assets/img/nfc6.png" />
          </SubDescription>
        </SubContainer>
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
  height: 91vh;
  padding: 0 2rem 9vh;
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
  width: 100%;
  font-size: 14px;
  text-align: start;
  line-height: 1.5;
  margin-bottom: 20px;
`;


const StyledButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--main-orange-color);
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
  &:hover {
    background-color: var(--orange-color-200);
  }
`;

const SubContainer = styled.div`
  width: 100%;
`;

const SubTitle = styled.p`
  color: var(--black-color-100);
  width: 100%;
  font-size: 14px;
  text-align: start;
  line-height: 1.5;
  margin-bottom: 5px;
`;

const StyledLink = styled(Link)`
  color: #b379d9;
  font-size: 14px;
`;

const SubDescription = styled.p`
  color: var(--black-color-100);
  width: 100%;
  font-size: 13px;
  text-align: start;
  line-height: 1.5;
  margin-left: 15px;
  margin-bottom: 0.5rem;

  & img {
    margin-bottom: 7px;
  }
`;

export default NfcInfoPage;
