import React from "react";
import styled from "styled-components";
import { TabBar } from "@components/common";
import { Button, Input, Grid, Text } from "@components/elements";
const Home = () => {
  return (
    <>
      {/* 헤더 */}
      <Header>
        <Text>119 신고 서비스</Text>
        <Text>SAVE ME</Text>
      </Header>
      <Grid
        $is_flex={true}
        $padding="15px 0px 110px 0px"
        $flex_direction="column"
      >
        <Grid>
          {/* 신고 버튼 */}
          <Button
            $radius="50%"
            $width="40vw"
            $height="40vw"
            $bg="var(--button-red-color)"
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
      </Grid>
      <TabBar />
    </>
  );
};

export default Home;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 20vh;
  padding-bottom: 4px;
  flex-direction: column;
  align-items: flex-start;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 15px 0px 110px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
`;
