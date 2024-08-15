import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import { Header, TabBar } from "@components/common";
import { Text, Image } from "@components/elements";
import choking from "@/assets/img/icon/choking.png";

const FirstAidPage = () => {
  const topics = [
    {
      name: "심폐소생술",
      icon: <HealthAndSafetyIcon sx={{ fontSize: 50 }} />,
      color: "var(--main-red-color)",
    },
    {
      name: "기도폐쇄",
      icon: <Image $src={choking} $width="55px" />,
      color: "var(--main-red-color)",
    },
    {
      name: "화상",
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 50 }} />,
      color: "var(--main-red-color)",
    },
    {
      name: "쏘임",
      icon: <EmojiNatureIcon sx={{ fontSize: 50 }} />,
      color: "var(--main-red-color)",
    },
  ];

  return (
    <Container>
      <Header navText="응급 처치" goTo="/" />

      <Grid>
        {topics.map((topic, index) => (
          <Link to={`detail?topic=${index}`} key={index}>
            <GroupBox>
              <IconButton style={{ color: topic.color, p: 0 }}>
                {topic.icon}
              </IconButton>
              <Text
                children={topic.name}
                $size="var(--font-size-medium)"
                $lineHeight="150%"
              />
            </GroupBox>
          </Link>
        ))}
      </Grid>
      <TabBar />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
`;

const Grid = styled.div`
  width: 100%;
  height: 82vh;
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  flex-grow: 1;
  align-items: flex-start;
  flex-direction: row;
  column-gap: 1.7vw;
  row-gap: 4vh;
  justify-content: space-evenly;
  align-content: flex-start;
  margin-top: 3rem;
`;
const GroupBox = styled.div`
  width: 30vw;
  height: 25vh;
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 10px;
  box-shadow: 0px 1px 8px #dfdbdb;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`;

export default FirstAidPage;
