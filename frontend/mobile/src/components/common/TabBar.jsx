import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import useUserStore from "@/store/useUserStore";
const TabBar = () => {
  //TODO -  유저 연결
  const isLogined = useUserStore((state) => state.isLogined);

  return (
    <Wrapper>
      <TabItem>
        <Link to="/firstaid">긴급 대처 요령</Link>
      </TabItem>
      <TabItem>
        <Link to="/">홈</Link>
      </TabItem>
      <TabItem>
        {/* {isLogined ? (
          <Link to="/login">로그인</Link>
        ) : (
          <Link to="/mySetting">내정보</Link>
        )} */}
        <Link to="/login">로그인</Link>
      </TabItem>

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
  justify-content: center;
  position: fixed;
  bottom: 0px;
  background-color: var(--bg-baige-color);
`;

const TabItem = styled.div`
  display: flex;
  width: 120px;
  height: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
