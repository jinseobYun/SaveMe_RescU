import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PaperclipOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";

import { Header, TabBar } from "@components/common";
import useFormInputStore from "@/store/useFormInputStore";
import { yesorNoAlert } from "@/util/notificationAlert";
import useUserStore from "@/store/useUserStore";
const MenuPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useUserStore();
  const menuItems = [
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
      icon: <ContactsOutlinedIcon />,
      label: "비상 연락망 등록",
      path: "/emergencycontacts",
    },
    {
      icon: <NotificationsOutlinedIcon />,
      label: "알림 관리",
      path: "/pushnotis",
    },
    {
      icon: <InfoOutlinedIcon />,
      label: "개인 정보 수집 활용 동의서",
      path: "/privacyagreement",
    },
    {
      icon: <PersonOutlinedIcon />,
      label: "내 정보 관리",
      path: "/menu/changeInfo",
    },
  ];
  const myInfoMenuItems = [
    {
      icon: <LockIcon />,
      label: "비밀번호 변경",
      path: "/changepassword",
    },
    {
      icon: <PhoneAndroidOutlinedIcon />,
      label: "휴대폰 번호 변경",
      path: "/medicalinfo",
    },
    {
      icon: <LogoutIcon />,
      label: "로그아웃",
      path: "/logout",
    },
  ];
  const handleNavigation = (path) => {
    if (path === "/logout") {
      console.log("logout");
      yesorNoAlert("정말 로그아웃 하시겠습니까?", "네", "아니오", () => {
        logout();
        navigate("/");
      });
    } else navigate(path);
  };
  const { clearAllInputs } = useFormInputStore();

  useEffect(() => {
    clearAllInputs();
  }, []);
  return (
    <Container>
      <Header navText={"내 정보"} goTo="/" />

      <MenuList>
        {pathname === "/menu/changeInfo"
          ? myInfoMenuItems.map((item, index) => (
              <MenuItem key={index} onClick={() => handleNavigation(item.path)}>
                <IconWrapper>{item.icon}</IconWrapper>
                <Label>{item.label}</Label>
                <ChevronRightOutlinedIcon />
              </MenuItem>
            ))
          : menuItems.map((item, index) => (
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
`;

const MenuList = styled.div`
  padding: 3rem 1rem;
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
  border-radius: 16px;
  border: 1px solid var(--orange-color-100);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    border: 1px solid var(--main-orange-color);
    color: var(--black-color-200);
    box-shadow: 0 1px 3px var(--main-orange-color);
  }
`;

const IconWrapper = styled.div`
  margin-right: 1rem;
`;

const Label = styled.div`
  flex: 1;
  font-size: 1.5rem;
`;
