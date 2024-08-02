import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { Header, TabBar } from "@components/common";
import { Grid, Button, Text } from "@components/elements";
import useUserStore from "@/store/useUserStore";

const MedicalInfoPage = () => {
  const userMedicalInfo = useUserStore((state) => state.userMedicalInfo);
  const navigate = useNavigate();
  const btnStyles = {
    _onClick: () => navigate("/medicalinfo/edit?form=basic"),
    children: "등록하기",
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
    // $boxShadow: "0px 4px 0px 0px var(--main-orange-color);",
    $padding: "14px 32px",
    $width: "",
    $height: "10vh",
  };
  useEffect(() => {
    //TODO - 의료 정보 조회하기

    console.log(userMedicalInfo);
  });
  return (
    <Container>
      <Header navText="내 의료 정보" />
      <Content>
        {/* //TODO - 의료 정보 있으면 있는 상태 보여주기 */}
        {userMedicalInfo ? { userMedicalInfo } : <Button {...btnStyles} />}
      </Content>
      <TabBar />
    </Container>
  );
};

export default MedicalInfoPage;

const Content = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
