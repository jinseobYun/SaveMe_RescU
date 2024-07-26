import React from "react";
import styled from "styled-components";
import { TabBar } from "@components/common";
import { Button, Input, Grid } from "@components/elements";
const Home = () => {
  return (
    <>
      {/* 헤더 */}
      <Header></Header>
      {/* 신고 버튼 */}
      {/* <Button
        radius="50%"
        width="80%"
        height="50px"
        bg={{
          default: "var(--button-red-color)",
          hover: "transparent",
          active: "transparent",
        }}
        children="119 구조/구급 신고"
      /> */}
      {/* gps  */}
      <TabBar />
    </>
  );
};

export default Home;

const Header = styled.div`
  display: flex;
  width: 360px;
  padding-bottom: 4px;
  flex-direction: column;
  align-items: flex-start;
`;
