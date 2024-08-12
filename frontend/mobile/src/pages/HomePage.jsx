import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { TabBar } from "@components/common";
import { Button, Grid, Text, Toggle, Image } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
import useUserStore from "@/store/useUserStore";
import { yesorNoAlert, errorAlert } from "@/util/notificationAlert";
import logo from "@/assets/img/logo.png";
import useWatchLocation from "@/hooks/useWatchLocation";

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};
const Home = () => {
  const navigate = useNavigate();
  const { gps, addGps, setTagId, setGpsTermAgree, gpsTermAgree } =
    useUserStore();
  const { location, error, cancelLocationWatch } =
    useWatchLocation(geolocationOptions);
  const [searchParams] = useSearchParams();
  const tagId = searchParams.get("tagId");
  const onClickReportBtn = () => {
    if (!gpsTermAgree) errorAlert("위치 정보 제공에 동의해주세요");
    else {
      navigate("/report");
      cancelLocationWatch();
    }
  };
  const { clearAllInputs } = useFormInputStore();
  useEffect(() => {
    if (location) {
      addGps({ time: new Date(), location: location });
    }
  }, [location]);
  useEffect(() => {
    clearAllInputs();
    if (tagId) {
      yesorNoAlert("태깅이 감지되었습니다.", "취소", "신고하기", (result) => {
        if (result.isDismissed) {
          setTagId(tagId);
          //TODO - 태깅 신고 로직
          navigate("/report");
        } else navigate("/");
      });
    }
  }, []);
  const onToggleOff = () => {
    setGpsTermAgree(false);
    errorAlert("위치 정보 제공에 동의해주세요");
  };
  const onToggleOn = () => {
    setGpsTermAgree(true);
  };
  return (
    <Container>
      {/* 헤더 */}
      <StyledHeader>
        {/* //TODO - 헤더 만들기 */}
        <Image $src={logo} $width="20vw" $height="20vw" />
        <Text $size="4rem" children="SAVE ME" $bold={true} />
        <Text children="119 신고 서비스" />
      </StyledHeader>
      <Grid $display="flex" $padding="" $flex_direction="column">
        <Grid
          $display="flex"
          justify_content="center"
          $flex_direction="column"
          $margin="6vh"
        >
          {/* 신고 버튼 */}
          {/* <Button
            _onClick={onClickReportBtn}
            $radius="50%"
            $width="40vw"
            $height="40vw"
            $bg={{ default: "var(--main-red-color)" }}
            $border="none"
            $boxShadow=" 4px 3px 62px 0px rgba(0, 0, 0, 0.50);"
            children={
              <Text
                $color="var(--white-color-100)"
                children="119"
                $size="40px"
                $bold="true"
              />
            }
          /> */}
          <NeumorphismButton onClick={onClickReportBtn}>
            <ReportBtnText>
              <Text
                $color="var(--white-color-100)"
                children="119"
                $size="40px"
                $bold="true"
              />
            </ReportBtnText>
            <ReportBtnText>
              <Text
                $color="var(--white-color-100)"
                children="신고하기"
                $size="20px"
                $bold="true"
              />
            </ReportBtnText>
          </NeumorphismButton>
        </Grid>
        {/* gps  */}
        <Toggle
          $default={gpsTermAgree}
          _onToggleOff={onToggleOff}
          _onToggleOn={onToggleOn}
          $toggleColor="var(--main-yellow-color)"
          $toggleOnText={
            <Text
              children="위치 정보 제공 동의"
              $size="1.7rem"
              $bold={true}
              $lineHeight="32px"
            />
          }
          $toggleOffText={
            <>
              <Text
                children="위치 정보 제공 동의"
                $size="1.7rem"
                $bold={true}
                $lineHeight="32px"
              />
              <Text
                children="동의해야 앱을 사용할 수 있습니다"
                $size="1.1rem"
                $lineHeight="20px"
                $color="var(--gray-color-300)"
              />
            </>
          }
        />
      </Grid>
      <TabBar />
      {/* <StyledImg src={embulance} /> */}
    </Container>
  );
};

export default Home;
const Container = styled.div`
  width: 100%;
  height: 100%;
  // background-color: rgba(251, 200, 30, 0.6);
  background-color: var(--white-color-200);
`;
const StyledHeader = styled.div`
  display: flex;
  height: 30vh;
  padding: 0 0 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  // background: rgb(255, 110, 76);
  // background: linear-gradient(
  //   180deg,
  //   rgba(255, 110, 76, 0.86214987704066) 0%,
  //   rgba(255, 194, 44, 0.5624299890854779) 50%,
  //   rgba(255, 242, 77, 0) 100%
  // );
`;
const StyledImg = styled.img``;

const NeumorphismButton = styled.button`
  width: 30vw;
  height: 30vw;
  border-radius: 50px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1.4rem;
  backdrop-filter: blur(10px);
  background-color: rgb(255, 76, 76, 1);
  box-shadow:
    5px 5px 10px rgba(255, 255, 255, 0.6),
    /* 오른쪽 아래 그림자 */ -5px -5px 10px rgba(255, 255, 255, 0.6),
    /* 왼쪽 위 하이라이트 */ inset 5px 5px 10px rgba(255, 255, 255, 0.6),
    /* 오목하게 만드는 내부 그림자 */ inset -5px -5px 10px
      rgba(255, 255, 255, 0.6); /* 오목하게 만드는 내부 하이라이트 */
`;

const ReportBtnText = styled.div`
  width: fit-content;
  height: fit-content;
`;
