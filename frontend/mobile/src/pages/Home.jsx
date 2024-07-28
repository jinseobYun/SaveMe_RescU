import React from "react";
import styled from "styled-components";
import { TabBar } from "@components/common";
import { Button, Grid, Text, Toggle } from "@components/elements";
const Home = () => {
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
        $is_flex={true}
        $padding="15px 0px 110px 0px"
        $flex_direction="column"
      >
        <Grid $is_flex={true} justify_content="center" $flex_direction="column">
          {/* 신고 버튼 */}
          <Button
            $radius="50%"
            $width="40vw"
            $height="40vw"
            $bg={{ default: "var(--main-red-color)" }}
            $border="none"
            $boxShadow=" 4px 3px 62px 0px rgba(0, 0, 0, 0.50);"
            children={
              <Text
                color="var(--white-color-100)"
                children="119"
                size="16px"
                bold="true"
              />
            }
          />
        </Grid>

        {/* gps  */}
        <Toggle
          $toggleColor="var(--main-yellow-color)"
          $toggleOnText={<Text children="위치 정보 제공 동의" />}
          $toggleOffText={<Text children="동의해야 앱을 사용할 수 있습니다" />}
        />
      </Grid>
      <TabBar />
    </>
  );
};

export default Home;
