import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

import { Header, TabBar } from "@components/common";
import { Button, Text } from "@components/elements";
import useUserStore from "@/store/useUserStore";
import { getMedicalInfo, deleteMedicalInfo } from "@api/medicalInfoApi";
import { errorAlert } from "@/util/notificationAlert";
import useFormInputStore from "@/store/useFormInputStore";

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
    // $boxShadow: "0px 4px 0px 0px var(--main-orange-color);",
    // $padding: "14px 32px",
    $width: "",
    $height: "10vh",
  };
  const onClickDelteBtn = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "나의 의료 정보를 삭제하시겠습니까?",
      text: "신고 시 나의 정보가 전송되지 않습니다.",
      showCancelButton: true,
      confirmButtonColor: "#96C9F4#",
      cancelButtonColor: "#FF4C4C",
      confirmButtonText: "취소",
      cancelButtonText: "삭제하기",
    }).then((result) => {
      if (result.isDismissed) {
        //FIXME - 403 forbidden
        deleteMedicalInfo(
          (response) => {
            console.log(response);
            if (response.status === 200) {
              Swal.fire({
                title: "삭제되었습니다",
                didClose: () => {
                  clearAllInputs();
                  clearUserMedicalInfo();
                },
              });
            } else {
              console.log(response);
            }
          },
          (error) => {
            console.log(error.toJSON());
            errorAlert(error.response.data);
          }
        );
      }
    });
  };
  useEffect(() => {
    getMedicalInfo(
      (response) => {
        if (response.status === 200) {
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
      },
      (error) => {
        console.log(error.toJSON());

        //TODO - 등록된 정보가 없을때
        if (error.response.status === 404) {
          setUserMedicalInfo(null);
        } else {
          errorAlert(error.response.data);
        }
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
      <Header navText="내 의료 정보" />
      <Content>
        {/* //TODO - 의료 정보 있으면 있는 상태 보여주기 */}
        {userMedicalInfo ? (
          <>
            <StyledBtn
              onClick={() => {
                changeFormEdit();

                navigate("/medicalinfo/edit?form=basic");
              }}
            >
              <EditIcon />
              수정
            </StyledBtn>
            <StyledBtn onClick={onClickDelteBtn}>
              <DeleteIcon />
              삭제
            </StyledBtn>
            <InfoContainer>
              <Section>
                <SectionHeader>
                  <SectionTitle>기본 정보</SectionTitle>
                </SectionHeader>
                <InfoList>
                  <InfoItem>
                    <span>
                      <Text
                        $color="var(--label-gray-color)"
                        $size="1.2rem"
                        children="ABO 혈액형"
                        $padding="0.7rem"
                        $lineHeight=""
                      />
                    </span>
                    <Value>{userMedicalInfo.bloodType1}형</Value>
                  </InfoItem>
                  <InfoItem>
                    <span>
                      <Text
                        $color="var(--label-gray-color)"
                        $size="1.2rem"
                        children="RH 혈액형"
                        $padding="0.7rem"
                        $lineHeight=""
                      />
                    </span>

                    <Value>{userMedicalInfo.bloodType2}형</Value>
                  </InfoItem>
                  <InfoItem ref={infoItemRef} $isColumn={isColumn}>
                    <span>
                      <Text
                        $color="var(--label-gray-color)"
                        $size="1.2rem"
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
                  {/* <EditButton
                    onClick={() => navigate("/medicalinfo/edit?form=drug")}
                  >
                    <EditIcon />
                    수정
                  </EditButton> */}
                </SectionHeader>
                <InfoList>
                  {userMedicalInfo.drugInfos.map((item, index) => {
                    return (
                      <InfoItem key={index}>
                        <span>
                          <Text
                            $color="var(--black-color-200)"
                            $size="1.3rem"
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
                  {/* <EditButton
                    onClick={() => navigate("/medicalinfo/edit?form=disease")}
                  >
                    <EditIcon />
                    수정
                  </EditButton> */}
                </SectionHeader>
                <InfoList>
                  {userMedicalInfo.medCdis.map((item, index) => {
                    return (
                      <InfoItem key={index}>
                        <span>
                          <Text
                            $color="var(--black-color-200)"
                            $size="1.3rem"
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
          </>
        ) : (
          <Button {...btnStyles} />
        )}
      </Content>
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
`;
const Content = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  overflow: auto;
  height: 83vh;
  align-items: flex-end;
  margin: auto;
`;

const InfoContainer = styled.div`
  width: 95vw;
  background-color: var(--white-color-200);
  padding: 20px;
  // min-height: 100vh;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 16px;
  border: 1px solid var(--main-orange-color);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const StyledBtn = styled.button`
  font-size: 14px;
  color: var(--dark-blue-color);
  background: none;
  border: none;
  cursor: pointer;
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
