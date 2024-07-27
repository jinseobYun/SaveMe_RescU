import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TabBar = () => {
  return (
    <Wrapper>
      <TabItem>
        <Link to="/firstAid">긴급 대처 요령</Link>
      </TabItem>
      <TabItem>
        <Link to="/">홈</Link>
      </TabItem>
      <TabItem>
        <Link to="/login">로그인</Link>
      </TabItem>
    </Wrapper>
  );
};

export default TabBar;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 15vh;
  justify-content: center;
  align-items: flex-start;
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
