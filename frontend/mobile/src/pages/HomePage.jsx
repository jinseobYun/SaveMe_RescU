import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { TabBar } from "@components/common";
import { Button, Grid, Text, Toggle } from "@components/elements";
const Home = () => {
  const navigate = useNavigate();

  const onClickReportBtn = () => {
    navigate("/report");
  };
  return (
    <>
      {/* 헤더 */}
      <Grid
        $display="grid"
        $height="20vh"
        $padding="0 0 0 "
        $flex_direction="column"
        $bg="var(--bg-baige-color)"
        $align_items="flex-start"
      >
        <Text>119 신고 서비스</Text>
        <Text>SAVE ME</Text>
      </Grid>
      <Grid
        $display="flex"
        $padding="15px 0px 110px 0px"
        $flex_direction="column"
      >
        <Grid
          $display="flex"
          justify_content="center"
          $flex_direction="column"
          $margin="6vh"
        >
          {/* 신고 버튼 */}
          <Button
            _onClick={onClickReportBtn}
            $radius="50%"
            $width="150px"
            $height="150px"
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
          />
        </Grid>

        {/* gps  */}
        <Toggle
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
    </>
  );
};

export default Home;
