import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import useUserStore from "@/store/useUserStore";
const TabBar = () => {
  const isLogined = useUserStore((state) => state.isLogined);

  return (
    <Wrapper>
      <Link to="/firstaid">
        <TabItem>긴급 대처 요령</TabItem>
      </Link>
      <Link to="/">
        <TabItem>홈</TabItem>
      </Link>

      {isLogined ? (
        <Link to="/menu">
          <TabItem>내정보</TabItem>
        </Link>
      ) : (
        <Link to="/login">
          <TabItem>로그인</TabItem>
        </Link>
      )}

      {/* <BottomNav>
        <NavItem>긴급 대처 요청</NavItem>
        <NavItem>홈</NavItem>
        <NavItem>내 정보</NavItem>
      </BottomNav> */}
    </Wrapper>
  );
};

export default TabBar;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 7vh;
  position: fixed;
  bottom: 0px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  // background-color: var(--bg-baige-color);
`;

const TabItem = styled.div`
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  gap: 8px;
  flex-shrink: 0;
  &:hover {
    border: 1px solid var(--main-orange-color);
    color: var(--black-color-200);
  }
`;
const BottomNav = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

const NavItem = styled.div`
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
`;
