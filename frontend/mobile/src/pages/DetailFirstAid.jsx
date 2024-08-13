import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useSearchParams } from "react-router-dom";

import { Header, TabBar } from "@components/common";
import { Button, Grid, Text, Image } from "@components/elements";
import { aidTopicsJson } from "@/assets/json/firstAid.js";
const DetailFirstAid = () => {
  const [searchParams] = useSearchParams();
  const idx = searchParams.get("topic");
  const [curPage, setCurPage] = useState(0);
  const [aidDesc, setAidDesc] = useState("");
  const [aidImg, setAidImg] = useState();

  useEffect(() => {
    if (aidTopicsJson[idx]) {
      setAidDesc(aidTopicsJson[idx].description[curPage]);
      setAidImg(aidTopicsJson[idx].imgUrl[curPage]);
    }
  }, [idx, curPage]);

  const handlePrev = () => {
    if (curPage > 0) {
      setCurPage(curPage - 1);
    }
  };

  const handleNext = () => {
    if (
      aidTopicsJson[idx] &&
      curPage < aidTopicsJson[idx].description.length - 1
    ) {
      setCurPage(curPage + 1);
    }
  };

  return (
    <Container>
      <Header navText={aidTopicsJson[idx].name} goTo="/firstaid" />
      <Content>
        <Title>
          {curPage + 1}. {aidTopicsJson[idx].title[curPage]}
        </Title>
        <IconWrapper>
          <Image $src={aidTopicsJson[idx].imgUrl[curPage]} $width="50vw" />
        </IconWrapper>
        <Description>{aidDesc}</Description>
        <PageBtn>
          {curPage > 0 && (
            <Button
              _onClick={handlePrev}
              $width="fit-content"
              $margin="1rem"
              children={<Text $size="5rem" children="&#8249;" />}
            />
          )}
          {aidTopicsJson[idx] && curPage < aidTopicsJson[idx].page - 1 && (
            <Button
              _onClick={handleNext}
              $width="fit-content"
              $margin="1rem"
              children={<Text $size="5rem" children="&#8250;" />}
            />
          )}
        </PageBtn>
      </Content>
      <TabBar />
    </Container>
  );
};

export default DetailFirstAid;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
const Content = styled.div`
  flex-direction: column;
  display: flex;
  height: 81vh;
  align-items: center;
  overflow: auto;
  padding: 0 2rem;
  margin: 2rem;
  position: relative;
`;
const PageBtn = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  margin: 10px 0;
  font-size: 2rem;
  width: 100%;
  position: absolute;
  bottom: 0;
  flex-grow: 1;
`;

const Title = styled.div`
  width: 100%;
  padding: 16px 0;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const Icon = styled.img`
  width: 30vw;
  height: 30vw;
`;

const Description = styled.p`
  color: var(--black-color-100);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
  cursor: pointer;
  white-space: pre-wrap;
  word-break: keep-all;
`;
