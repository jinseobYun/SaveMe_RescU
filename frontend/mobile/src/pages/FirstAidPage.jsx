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
// import CoronavirusIcon from "@mui/icons-material/Coronavirus";
// import BugReportIcon from "@mui/icons-material/BugReport";
// import AllergyIcon from "@mui/icons-material/Sick"; // No direct allergic reaction icon, used Sick icon as placeholder
// import AirIcon from "@mui/icons-material/Air";
// import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
// import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import SportsHandballIcon from "@mui/icons-material/SportsHandball";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
// import BoltIcon from "@mui/icons-material/Bolt";
// import AccessibilityIcon from "@mui/icons-material/Accessibility";
// import HealingIcon from "@mui/icons-material/Healing";
// import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
// import PersonSearchIcon from "@mui/icons-material/PersonSearch";
// import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

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
    // { name: "독극물", icon: <CoronavirusIcon />, color: "#e74c3c" },
    // { name: "물림", icon: <BugReportIcon />, color: "#e74c3c" },
    // { name: "알레르기 반응", icon: <AllergyIcon />, color: "#2c3e50" },
    // { name: "천식", icon: <AirIcon />, color: "#2c3e50" },
    // { name: "당뇨병", icon: <MedicalServicesIcon />, color: "#2c3e50" },
    // { name: "약물 과다복용", icon: <LocalPharmacyIcon />, color: "#2c3e50" },
    // { name: "눈 부상", icon: <VisibilityOffIcon />, color: "#2c3e50" },
    // { name: "골절", icon: <SportsHandballIcon />, color: "#2c3e50" },
    // { name: "두부 손상", icon: <SportsHandballIcon />, color: "#2c3e50" },
    // { name: "심장 질환", icon: <FavoriteIcon />, color: "#2c3e50" },
    // { name: "발작", icon: <BatteryAlertIcon />, color: "#2c3e50" },
    // { name: "쇼크", icon: <BoltIcon />, color: "#2c3e50" },
    // { name: "척추 손상", icon: <AccessibilityIcon />, color: "#2c3e50" },
    // { name: "염좌 및 긴장", icon: <HealingIcon />, color: "#2c3e50" },
    // { name: "뇌졸중", icon: <OfflineBoltIcon />, color: "#2c3e50" },
    // { name: "상처 관리", icon: <HealingIcon />, color: "#3498db" },
    // { name: "부상자 평가", icon: <PersonSearchIcon />, color: "#3498db" },
    // { name: "회복 자세", icon: <SelfImprovementIcon />, color: "#3498db" },
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
              <Text align="center" variant="body2">
                {topic.name}
              </Text>
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
  height: 83vh;
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  flex-grow: 1;
  align-items: flex-start;
  align-content: center;
  flex-direction: row;
  column-gap: 3vw;
  row-gap: 4vh;
  justify-content: space-evenly;
`;
const GroupBox = styled.div`
  width: 30vw;
  height: 30vh;
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
