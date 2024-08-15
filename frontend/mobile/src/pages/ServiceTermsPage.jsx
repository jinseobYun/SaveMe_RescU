import React from "react";
import styled from "styled-components";
import { Header, TabBar } from "@components/common";
import { privacyAgreement } from "@/assets/json/terms";
const ServiceTermsPage = () => {
  return (
    <Container>
      <Header navText="서비스 이용약관" goTo="/menu" />
      <Content>
        <Description>
          {`SAVE ME (이하 "구급퓨쳐오렌지삐뽀사이렌")는 고객님의 개인정보를 소중히 여기며, 「개인정보 보호법」 및 관련 법령에 따라 고객님의 개인정보를 보호하기 위해 최선을 다하고 있습니다. 고객님의 개인정보 수집 및 이용에 관한 사항을 아래와 같이 안내드립니다.`}
        </Description>
        {privacyAgreement.map((section, index) => (
          <Section key={index}>
            <Title>{section.title}</Title>
            {section.content.map((item, itemIndex) =>
              typeof item === "string" ? (
                <Paragraph key={itemIndex}>
                  {section.content.length > 1 && `${itemIndex + 1}.`} {item}
                </Paragraph>
              ) : (
                <SubSection key={itemIndex}>
                  <Subtitle>{item.subtitle}</Subtitle>
                  <Paragraph>{item.detail}</Paragraph>
                </SubSection>
              )
            )}
          </Section>
        ))}
      </Content>
    </Container>
  );
};

export default ServiceTermsPage;

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
  align-items: flex-start;
  overflow: auto;
  padding: 0 2rem;
  margin: 2rem;
  position: relative;
`;

const Description = styled.p`
  color: var(--black-color-100);
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 20px;
  margin-bottom: 15px;
  padding: 15px;
  cursor: pointer;
  white-space: pre-wrap;
  word-break: keep-all;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 10px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const SubSection = styled.div`
  margin-left: 20px;
  margin-bottom: 10px;
`;

const Subtitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  color: var(--black-color-100);
`;
