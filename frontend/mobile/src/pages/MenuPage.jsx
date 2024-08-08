import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PaperclipOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

import { Header, TabBar } from "@components/common";
import useFormInputStore from "@/store/useFormInputStore";
const MenuPage = () => {
  const navigate = useNavigate();
  const items = [
    {
      icon: <PaperclipOutlinedIcon />,
      label: "NFC 정보 등록",
      path: "/nfcinfo",
    },
    {
      icon: <MedicalServicesOutlinedIcon />,
      label: "내 의료 정보 관리",
      path: "/medicalinfo",
    },
    {
      icon: <PhoneOutlinedIcon />,
      label: "비상 연락망 등록",
      path: "/emergencycontacts",
    },
    {
      icon: <NotificationsOutlinedIcon />,
      label: "알림 관리",
      path: "/notifications",
    },
    {
      icon: <InfoOutlinedIcon />,
      label: "개인 정보 수집 활용 동의서",
      path: "/privacyagreement",
    },
    {
      icon: <PersonOutlinedIcon />,
      label: "내 정보 관리",
      path: "/profilemanagement",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };
  const { clearAllInputs } = useFormInputStore();
  useEffect(() => {
    clearAllInputs();
  }, []);
  return (
    <Container>
      <Header navText={"내 정보"} goTo="/" />

      <MenuList>
        {items.map((item, index) => (
          <MenuItem key={index} onClick={() => handleNavigation(item.path)}>
            <IconWrapper>{item.icon}</IconWrapper>
            <Label>{item.label}</Label>
            <ChevronRightOutlinedIcon />
          </MenuItem>
        ))}
      </MenuList>
      <TabBar />
    </Container>
  );
};

export default MenuPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #fefefe;
`;

const MenuList = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
`;

const MenuItem = styled.div`
  display: flex;
  width: 65vw;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: var(--white-color-100);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    border: 1px solid var(--main-orange-color);
    color: var(--black-color-200);
    box-shadow: 0 1px 3px var(--main-orange-color);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const Label = styled.div`
  flex: 1;
  font-size: 1rem;
`;
