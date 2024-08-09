import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import useUserStore from "@/store/useUserStore";
const TabBar = () => {
  const isLogined = useUserStore((state) => state.isLogined);
  const [$isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  const handleTabClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <Wrapper>
      <StyledLink to="/firstaid" onClick={handleTabClick}>
        <TabItem
          $isAnimating={$isAnimating}
          $currentPath={location.pathname}
          $targetPath="/firstaid"
        >
          <MedicalServicesOutlinedIcon />
          <span>응급 처치</span>
        </TabItem>
      </StyledLink>
      <StyledLink to="/" onClick={handleTabClick}>
        <TabItem
          $isAnimating={$isAnimating}
          $currentPath={location.pathname}
          $targetPath="/"
        >
          <HomeOutlinedIcon />
          <span>홈</span>
        </TabItem>
      </StyledLink>
      {isLogined ? (
        <StyledLink to="/menu" onClick={handleTabClick}>
          <TabItem
            $isAnimating={$isAnimating}
            $currentPath={location.pathname}
            $targetPath="/menu"
          >
            <AccountCircleOutlinedIcon />
            <span>내정보</span>
          </TabItem>
        </StyledLink>
      ) : (
        <StyledLink to="/login" onClick={handleTabClick}>
          <TabItem
            $isAnimating={$isAnimating}
            $currentPath={location.pathname}
            $targetPath="/login"
          >
            <AccountCircleOutlinedIcon />
            <span>로그인</span>
          </TabItem>
        </StyledLink>
      )}
    </Wrapper>
  );
};

export default TabBar;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 7vh;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 20vw;
`;

const TabItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  gap: 4px;
  flex-shrink: 0;

  animation: ${(props) =>
      props.$isAnimating && props.$currentPath !== props.$targetPath
        ? fadeOut
        : fadeIn}
    0.5s forwards;

  svg {
    font-size: 2rem;
  }

  span {
    font-size: 0.9rem;
  }

  &:hover {
    color: #555;
  }
`;
