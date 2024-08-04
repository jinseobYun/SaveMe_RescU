import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Button, Text, NextPageButton } from "@components/elements";
import AutoCompleteInput from "@components//input/AutoCompleteInput";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";
import useSearchStore from "@/store/useSearchStore";
import { registerMedicalInfo, updateMedicalInfo } from "@api/medicalInfoApi";

const MedicalSpecificForm = ({ form, btnSetting }) => {
  const {
    medCdisInputs,
    drugInputs,
    addMedCdisInputs,
    addDrugInputs,
    isFormEdit,
    inputs,
    clearAllInput,
    deleteMedCdisInput,
    deleteDrugInput,
  } = useFormInputStore();
  const { setUserMedicalInfo } = useUserStore();
  const { searchResults, setSearchResults } = useSearchStore();
  const navigate = useNavigate();

  const onClickNextBtn = (e) => {
    if (form === "disease") {
      const { bloodType1, bloodType2, otherInfo } = inputs;
      const medCdis = medCdisInputs.map((item) => item.id);
      const drugInfos = drugInputs.map((item) => item.id);
      const data = {
        bloodType1,
        bloodType2,
        otherInfo,
        medCdis,
        drugInfos,
      };
      //TODO - 의료정보 저장 api
      if (isFormEdit) {
        updateMedicalInfo(
          data,
          (response) => {
            if (response.status === 200) {
              Swal.fire("저장되었습니다");
              clearAllInput();

              setUserMedicalInfo(data);
              navigate("/medicalinfo", { replace: true });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        registerMedicalInfo(
          data,
          (response) => {
            if (response.status === 200) {
              Swal.fire("등록되었습니다");

              setUserMedicalInfo(data);
              clearAllInput();

              navigate("/medicalinfo", { replace: true });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    } else {
      navigate(btnSetting.url);
    }
  };

  const handleSaveInput = (value) => {
    const data = {
      id: value.id,
      name: value.name,
    };

    if (form === "disease") {
      addMedCdisInputs(data);
    } else {
      addDrugInputs(data);
    }
  };
  const onClickAddBtn = (name) => {
    if (name == "[object Object]") name = "";
    Swal.fire({
      // title: `<h5>의약품 명을 적어주세요</h5>`,
      html: '<div id="swal-react-container"></div>',
      didOpen: () => {
        const container = document.getElementById("swal-react-container");
        const root = createRoot(container);
        root.render(
          <AutoCompleteInput
            $onChange={Swal.resetValidationMessage}
            $prev={name}
          />
        );
      },
      preConfirm: () => {
        const inputValue = document.querySelector(
          "#swal-react-container input"
        ).value;
        const existsInArray = searchResults.some(
          (item) => item.name === inputValue
        );
        const existsInInputs = (
          form === "disease" ? medCdisInputs : drugInputs
        ).some((item) => item.name === inputValue);

        if (!existsInArray) {
          Swal.showValidationMessage("해당하는 단어가 DB에 없습니다.");
          return false;
        }

        if (existsInInputs) {
          Swal.showValidationMessage("이미 추가된 항목입니다.");
          return false;
        } else {
          if (name && inputValue !== name) {
            const prevIndex = (
              form === "disease" ? medCdisInputs : drugInputs
            ).findIndex((item) => item.name === name);
            if (prevIndex !== -1) {
              if (form === "disease") {
                deleteMedCdisInput(prevIndex);
              } else {
                deleteDrugInput(prevIndex);
              }
            }
          }
        }
        // 추가 처리 로직
        const newItem = searchResults.find((item) => item.name === inputValue);

        return inputValue
          ? Promise.resolve(newItem)
          : Promise.reject("입력해 주세요.");
      },
      width: "30em",
      confirmButtonText: "저장하기",
      confirmButtonColor: "var(--main-orange-color)",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveInput(result.value);
      }
    });
  };

  const btnStyles = {
    _onClick: onClickAddBtn,
    children: "추가하기",
    $radius: "10px",
    $bg: {
      default: "var(--main-orange-color)",
    },
    $color: {
      default: "var(--white-color-200)",
    },
    $padding: "1rem 2rem",
    $size: "2rem",
    $bold: true,
    // $boxShadow: "0px 4px 0px 0px var(--main-orange-color);",
    $padding: "1rem",
    $width: "",
    $height: "auto",
  };
  useEffect(() => {
    //STUB - 테스트 후 지우기
    const data = medCdisInputs;
    const stringifiedData = JSON.stringify(data);
    const parsedData = JSON.parse(stringifiedData); // 정상 작동
    if (form === "disease") {
      setSearchResults([
        {
          id: 1,
          name: "고혈압",
        },
        {
          id: 2,
          name: "당뇨병",
        },
        {
          id: 3,
          name: "천식",
        },
      ]);
    } else
      setSearchResults([
        {
          id: 24,
          name: "러츠날캡슐(탐스로신염산염)",
        },
        {
          id: 25,
          name: "세린드연고",
        },
        {
          id: 74,
          name: "하트만용액",
        },
      ]);
  }, []);
  return (
    <Container>
      <Grid
        $display="flex"
        $width="100%"
        $height="100%"
        $padding="5vh 4px"
        $flex_direction="column"
        $justify_content="flex-start"
        $gap="2rem"
      >
        <Text
          children={
            form === "disease"
              ? "지병 명을 최대한 정확히 적어주세요"
              : "의약품 명을 최대한 정확히 적어주세요"
          }
          $color="var(--blakc-color-300)"
        />
        <Button {...btnStyles} />
        <StyledList>
          {form === "disease"
            ? medCdisInputs &&
              medCdisInputs.map((item, i) => (
                <InputBox
                  key={i}
                  id={item.id}
                  name={item.name}
                  onClick={() => {
                    onClickAddBtn(item.name);
                  }}
                  value={item.name}
                >
                  <Text $size="1.4rem" children={item.name} $padding="1rem" />

                  <EditIcon />
                </InputBox>
              ))
            : drugInputs &&
              drugInputs.map((item, i) => (
                <InputBox
                  key={i}
                  id={item.id}
                  name={item.name}
                  onClick={() => {
                    onClickAddBtn(item.name);
                  }}
                  value={item.name}
                >
                  <Text
                    $size="1.5rem"
                    children={item.name}
                    $padding="2rem"
                    $lineHeight=""
                  />
                  <EditIcon />
                </InputBox>
              ))}
        </StyledList>
      </Grid>
      <NextPageButton
        isError={false}
        text={btnSetting.text}
        handleClick={onClickNextBtn}
      />
    </Container>
  );
};

export default MedicalSpecificForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
const StyledList = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-left: 2rem;
  margin-right: 2rem;
  gap: 1.5rem;
`;
const InputBox = styled.div`
  height: auto;
  display: flex;
  flex-direction: row;
  // width: 50vw;
  gap: 2rem;
  justify-content: space-between;
  padding: 0 0.1rem 10px 5px;
  padding: 16px;
  box-sizing: border-box;
  outline: none;
  border-bottom: 1px solid var(--dark-blue-color);

  z-index: 3;
`;
