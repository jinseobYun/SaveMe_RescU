import React from "react";
import styled from "styled-components";
import img404 from "@/assets/img/404img.jpg";
import { Text } from "@/components/elements";
const EmptyPage = () => {
  return (
    <StyledDiv>
      <img src={img404} alt="" />
      <Text>존재하지 않는 페이지입니다</Text>
    </StyledDiv>
  );
};

export default EmptyPage;
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
  align-items: center;
  margin-top: 50vw;
`;
