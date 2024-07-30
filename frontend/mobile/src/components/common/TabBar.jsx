import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import useUserStore from "@/store/useUserStore";
const TabBar = () => {
  //TODO -  유저 연결
  const user = useUserStore((state) => state.user);

  return (
    <Wrapper>
      <TabItem>
        <Link to="/firstAid">긴급 대처 요령</Link>
      </TabItem>
      <TabItem>
        <Link to="/">홈</Link>
      </TabItem>
      <TabItem>
        {user ? (
          <Link to="/login">로그인</Link>
        ) : (
          <Link to="/mySetting">내정보</Link>
        )}
      </TabItem>
    </Wrapper>
  );
};

export default TabBar;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 10vh;
  justify-content: center;
  position: fixed;
  bottom: 0px;
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
`;
