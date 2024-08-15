import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Header } from "@components/common";
import useFormInputStore from "@/store/useFormInputStore";

import { NextPageButton } from "@components/elements";
import useForm from "@/hooks/useForm";
import { errorAlert, successAlert } from "@/util/notificationAlert";

import { registerUser } from "@/api/userApi";
import { termsContent } from "@/assets/json/terms";

const AgreeTermsPage = () => {
  const navigate = useNavigate();

  const [isVerify, setIsVerify] = useState(false);
  const { updateInputs, inputs, clearInputs } = useFormInputStore();
  const onClickBtn = () => {
    const data = {
      memberId: inputs.id,
      password: inputs.password,
      passwordConfirm: inputs.passwordConfirm,
      memberName: inputs.name,
      gender: inputs.gender - 0,
      birth: inputs.birth,
      phoneNumber: inputs.phoneNumber,
    };
    //FIXME - 인증번호 빼면 data를 inputs로
    registerUser(
      data,
      (response) => {
        if (response.status === 200) {
          successAlert("가입이 완료되었습니다!", (result) => {
            clearInputs();
            navigate("/", { replace: true });
          });
        }
      },
      (error) => {
        console.log(error.toJSON());
        errorAlert(error.response.data);
      }
    );
  };

  const [allCheck, setAllCheck] = useState(false);
  const [gpsCheck, setGpsCheck] = useState(false);
  const [useCheck, setUseCheck] = useState(false);

  const allBtnEvent = () => {
    if (allCheck === false) {
      setAllCheck(true);
      setGpsCheck(true);
      setUseCheck(true);
    } else {
      setAllCheck(false);
      setGpsCheck(false);
      setUseCheck(false);
    }
  };

  const onClickGpsBtn = (event) => {
    event.stopPropagation();
    if (gpsCheck === false) {
      setGpsCheck(true);
    } else {
      setGpsCheck(false);
    }
  };

  const onClicInfoUseBtn = (event) => {
    event.stopPropagation();
    if (useCheck === false) {
      setUseCheck(true);
    } else {
      setUseCheck(false);
    }
  };

  useEffect(() => {
    if (gpsCheck === true && useCheck === true) {
      setAllCheck(true);
      setIsVerify(true);
    } else {
      setAllCheck(false);
      setIsVerify(false);
    }
  }, [gpsCheck, useCheck]);

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Container>
      <Header navText="이용 약관 동의" />
      <NotiBox>
        <AllTermsCard>
          <TermTitle>
            <TitleBox>
              <StyledRadio
                type="checkbox"
                id="all-check"
                checked={allCheck}
                onChange={allBtnEvent}
              />
              약관 전체동의
            </TitleBox>
          </TermTitle>
        </AllTermsCard>

        <TermsCard onClick={() => toggleExpand("gps")}>
          <TermTitle>
            <TitleBox>
              <StyledRadio
                type="checkbox"
                id="check1"
                checked={gpsCheck}
                onChange={onClickGpsBtn}
                onClick={(e) => e.stopPropagation()}
              />
              {termsContent[1].title}
            </TitleBox>
            <ToggleIcon>{expandedId === "gps" ? "▲" : "▼"}</ToggleIcon>
          </TermTitle>
          {expandedId === "gps" && (
            <BodyText>
              {termsContent[1].contents.map((section, index) => (
                <Section key={index}>
                  <Title>{section.title}</Title>
                  {Array.isArray(section.content) ? (
                    section.content.map((item, itemIndex) =>
                      typeof item === "string" ? (
                        <Paragraph key={itemIndex}>
                          {section.content.length > 1 && `${itemIndex + 1}.`}{" "}
                          {item}
                        </Paragraph>
                      ) : (
                        <SubSection key={itemIndex}>
                          <Subtitle>{item.subtitle}</Subtitle>
                          <Paragraph>{item.detail}</Paragraph>
                        </SubSection>
                      )
                    )
                  ) : (
                    <Paragraph>{section.content}</Paragraph>
                  )}
                </Section>
              ))}
            </BodyText>
          )}
        </TermsCard>

        <TermsCard onClick={() => toggleExpand("info")}>
          <TermTitle>
            <TitleBox>
              <StyledRadio
                type="checkbox"
                id="check2"
                checked={useCheck}
                onChange={onClicInfoUseBtn}
                onClick={(e) => e.stopPropagation()}
              />
              {termsContent[0].title}
            </TitleBox>
            <ToggleIcon>{expandedId === "info" ? "▲" : "▼"}</ToggleIcon>
          </TermTitle>
          {expandedId === "info" && (
            <BodyText>
              {termsContent[0].contents.map((section, index) => (
                <Section key={index}>
                  <Title>{section.title}</Title>
                  {Array.isArray(section.content) ? (
                    section.content.map((item, itemIndex) =>
                      typeof item === "string" ? (
                        <Paragraph key={itemIndex}>
                          {section.content.length > 1 && `${itemIndex + 1}.`}{" "}
                          {item}
                        </Paragraph>
                      ) : (
                        <SubSection key={itemIndex}>
                          <Subtitle>{item.subtitle}</Subtitle>
                          <Paragraph>{item.detail}</Paragraph>
                        </SubSection>
                      )
                    )
                  ) : (
                    <Paragraph>{section.content}</Paragraph>
                  )}
                </Section>
              ))}
            </BodyText>
          )}
        </TermsCard>
      </NotiBox>
      <NextPageButton
        text="다음"
        disabled={!isVerify}
        onClick={onClickBtn}
        type="button"
      />
    </Container>
  );
};

export default AgreeTermsPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
`;
const NotiBox = styled.div`
  width: 100%;
  padding: 20px;
  overflow: auto;
  height: 82vh;
`;
const AllTermsCard = styled.div`
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
`;
const TermsCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
  cursor: pointer;
`;
const TermTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: var(--orange-color-200);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  // gap: 1.5rem;
  justify-content: space-between;
`;
const TitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const BodyText = styled.div`
  font-size: 14px;
  color: #333;
  margin-top: 10px;
  line-height: 1.4;
`;

const ToggleIcon = styled.span`
  margin-left: 10px;
  font-size: 20px;
`;
const StyledRadio = styled.input`
  -webkit-appearance: none; // 웹킷 브라우저에서 기본 스타일 제거
  -moz-appearance: none; // 모질라 브라우저에서 기본 스타일 제거
  appearance: none; // 기본 브라우저에서 기본 스타일 제거
  width: 18px;
  height: 18px;
  border: 2px solid #ccc; // 체크되지 않았을 때의 테두리 색상
  border-radius: 20%;
  outline: none; // focus 시에 나타나는 기본 스타일 제거
  cursor: pointer;
  &:checked {
    background-color: var(
      --main-orange-color
    ); // 체크 시 내부 원으로 표시될 색상
    border: 3px solid white; // 테두리가 아닌, 테두리와 원 사이의 색상
    box-shadow: 0 0 0 1.6px var(--main-orange-color); // 얘가 테두리가 됨
  }
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
