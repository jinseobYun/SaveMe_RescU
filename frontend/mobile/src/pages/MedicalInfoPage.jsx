import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

import { Header, TabBar } from "@components/common";
import { Button, Text, Image } from "@components/elements";
import useUserStore from "@/store/useUserStore";
import { getMedicalInfo, deleteMedicalInfo } from "@api/medicalInfoApi";
import useFormInputStore from "@/store/useFormInputStore";
import { toastAlert, yesorNoAlert } from "@/util/notificationAlert";
import chart from "@/assets/img/icon/chart.gif";
import drug from "@/assets/img/icon/drug.gif";
import disease from "@/assets/img/icon/disease.gif";

const MedicalInfoPage = () => {
  const { changeFormRegister, changeFormEdit, clearAllInputs } =
    useFormInputStore();
  const { clearUserMedicalInfo } = useUserStore();

  const userMedicalInfo = useUserStore((state) => state.userMedicalInfo);
  const setUserMedicalInfo = useUserStore((state) => state.setUserMedicalInfo);
  const navigate = useNavigate();
  const btnStyles = {
    _onClick: () => {
      changeFormRegister();
      navigate("/medicalinfo/edit?form=basic");
    },
    children: "등록하기 >",
    $radius: "8px",
    $bg: {
      default: "var(--orange-op50-color)",
      hover: "var(--main-orange-color)",
    },
    $color: {
      default: "var(--white-color-200)",
    },
    $padding: "1rem 2rem",
    $size: "24px",
    $bold: true,
    $margin: "20rem 0 0 0",
    $width: "",
    $height: "10vh",
  };
  const onClickDelteBtn = () => {
    yesorNoAlert(
      `의료정보를 삭제하시겠습니까?`,
      "취소",
      "삭제하기",
      (result) => {
        if (result.isDismissed) {
          deleteMedicalInfo(
            (response) => {
              if (response.status === 200) {
                toastAlert("삭제되었습니다");
                clearUserMedicalInfo();
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    );
  };
  useEffect(() => {
    getMedicalInfo(
      (response) => {
        if (response.status === 200) {
          if (response.data) {
            const data = {
              medicalInformationId: response.data.medicalInformationId,
              bloodType1: response.data.bloodType1,
              bloodType2: response.data.bloodType2,
              otherInfo: response.data.otherInfo,
              drugInfos: response.data.drugInfos.map((item) => ({
                id: item.medicineId,
                name: item.medicineName,
              })),
              medCdis: response.data.medCdis.map((item) => ({
                id: item.cdInfoId,
                name: item.cdName,
              })),
            };
            setUserMedicalInfo(data);
          }
        }
      },
      (error) => {
        // errorAlert(error.response.data);
      }
    );
  }, []);

  const infoItemRef = useRef(null);
  const [isColumn, setIsColumn] = useState(false);

  useEffect(() => {
    if (userMedicalInfo) {
      const labelElement =
        infoItemRef.current.querySelector("span:first-child");
      const valueElement = infoItemRef.current.querySelector("span:last-child");

      const labelRect = labelElement.getBoundingClientRect();
      const valueRect = valueElement.getBoundingClientRect();

      const horizontalDistance = valueRect.left - labelRect.right;

      if (horizontalDistance < 10) {
        setIsColumn(true);
      }
    }
  }, [userMedicalInfo]);
  return (
    <Container>
      <Header navText="내 의료 정보" goTo="/menu" />
      {userMedicalInfo ? (
        <>
          <ButtonBox>
            <Button
              _onClick={() => {
                changeFormEdit();

                navigate("/medicalinfo/edit?form=basic");
              }}
              $width="80px"
              $bg={{
                default: "var(--main-orange-color)",
              }}
              $color={{ default: "var(--white-color-100)" }}
              children={
                <div style={{ gap: "1rem", display: "flex" }}>
                  <EditIcon />
                  수정
                </div>
              }
              $padding=""
              $border="1px solid  var(--orange-color-200)"
            />

            <Button
              _onClick={onClickDelteBtn}
              $padding="5px"
              $border="1px solid  var(--orange-color-200)"
              $width="80px"
              $bg={{
                default: "var(--main-orange-color)",
              }}
              $color={{ default: "var(--white-color-100)" }}
              children={
                <div style={{ gap: "1rem", display: "flex" }}>
                  <DeleteIcon />
                  삭제
                </div>
              }
            />
          </ButtonBox>

          <Content>
            <InfoContainer>
              <Section>
                <SectionHeader>
                  <SectionTitle>기본 정보</SectionTitle>
                  <Image $src={chart} $width="20px" />
                </SectionHeader>
                <InfoList>
                  <InfoItem>
                    <span>
                      <Text
                        $color="var(--label-gray-color)"
                        $size="1.4rem"
                        children="ABO 혈액형"
                        $padding="0.7rem"
                        $lineHeight=""
                      />
                    </span>
                    <Value>
                      {userMedicalInfo.bloodType1 &&
                        `${userMedicalInfo.bloodType1}형`}
                    </Value>
                  </InfoItem>
                  <InfoItem>
                    <span>
                      <Text
                        $color="var(--label-gray-color)"
                        $size="1.4rem"
                        children="RH 혈액형"
                        $padding="0.7rem"
                        $lineHeight=""
                      />
                    </span>

                    <Value>
                      {userMedicalInfo.bloodType2 &&
                        `${userMedicalInfo.bloodType2}형`}
                    </Value>
                  </InfoItem>
                  <InfoItem ref={infoItemRef} $isColumn={isColumn}>
                    <span>
                      <Text
                        $color="var(--label-gray-color)"
                        $size="1.4rem"
                        children="기타 특이사항"
                        $padding="0.7rem"
                        $lineHeight=""
                      />
                    </span>
                    <Value>{userMedicalInfo.otherInfo}</Value>
                  </InfoItem>
                </InfoList>
              </Section>

              <Section>
                <SectionHeader>
                  <SectionTitle>투약 정보</SectionTitle>
                  <Image $src={drug} $width="20px" />
                </SectionHeader>
                <InfoList>
                  {userMedicalInfo.drugInfos.map((item, index) => {
                    return (
                      <InfoItem key={index}>
                        <span>
                          <Text
                            $color="var(--black-color-200)"
                            $size="1.4rem"
                            children={item.name}
                            $padding="0.7rem"
                            $lineHeight=""
                          />
                        </span>
                      </InfoItem>
                    );
                  })}
                </InfoList>
              </Section>
              <Section>
                <SectionHeader>
                  <SectionTitle>지병 정보</SectionTitle>
                  <Image $src={disease} $width="20px" />
                </SectionHeader>
                <InfoList>
                  {userMedicalInfo.medCdis.map((item, index) => {
                    return (
                      <InfoItem key={index}>
                        <span>
                          <Text
                            $color="var(--black-color-200)"
                            $size="1.4rem"
                            children={item.name}
                            $padding="0.7rem"
                            $lineHeight=""
                          />
                        </span>
                      </InfoItem>
                    );
                  })}
                </InfoList>
              </Section>
            </InfoContainer>
          </Content>
        </>
      ) : (
        <Button {...btnStyles} />
      )}
      <TabBar />
    </Container>
  );
};

export default MedicalInfoPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  align-items: center;
`;
const Content = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  overflow: auto;
  height: 82vh;
  align-items: flex-end;
  margin: auto;
  background-color: #f5f5f5;
`;

const InfoContainer = styled.div`
  width: 95vw;
  padding: 20px;
  // min-height: 100vh;
`;

const Section = styled.div`
  // padding: 20px;
  // margin-bottom: 20px;
  // border-radius: 16px;
  // border: 1px solid var(--main-orange-color);
  // background-color: #f5f5f5;
  // // background-color: rgba(255, 255, 255, 0.6);
  // // box-shadow: 2px 2px 10px 0px rgba(255, 178, 44, 0.5),
  // //   inset -5px -5px 5px 0px rgba(255, 178, 44, 0.6),
  // //   inset 0px 11px 28px 0px rgb(255, 255, 255);
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  justify-content: flex-start;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 0;
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  ${(props) =>
    props.$isColumn &&
    `
    flex-direction: column;
    gap:5px;
    `}
`;

const Value = styled.span`
  display: block;
  color: var(--black-color-200);
  word-break: keep-all;
  font-size: 1.3rem;
`;
const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-right: 2rem;
  margin-bottom: 2rem;
  justify-content: flex-end;
`;
