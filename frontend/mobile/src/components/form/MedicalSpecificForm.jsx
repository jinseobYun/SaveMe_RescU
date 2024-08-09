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
import { successAlert, errorAlert } from "@/util/notificationAlert";

const MedicalSpecificForm = ({ form, btnSetting }) => {
  const {
    medCdisInputs,
    drugInputs,
    addMedCdisInputs,
    addDrugInputs,
    isFormEdit,
    inputs,
    clearAllInputs,
    deleteMedCdisInput,
    deleteDrugInput,
  } = useFormInputStore();
  const { setUserMedicalInfo } = useUserStore();
  const searchResults = useSearchStore((state) => state.searchResults);
  const setSearchResults = useSearchStore((state) => state.setSearchResults);

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
      if (isFormEdit) {
        updateMedicalInfo(
          data,
          (response) => {
            if (response.status === 200) {
              clearAllInputs();
              setUserMedicalInfo(data);
              successAlert("저장되었습니다", () => {
                navigate("/medicalinfo", { replace: true });
              });
            }
          },
          (error) => {
            console.log(error.toJSON());
          }
        );
      } else {
        registerMedicalInfo(
          data,
          (response) => {
            if (response.status === 201) {
              clearAllInputs();
              setUserMedicalInfo(data);
              successAlert("등록되었습니다", () => {
                navigate("/medicalinfo", { replace: true });
              });
            }
          },
          (error) => {
            console.log(error.toJSON());
            errorAlert(error.response.data);
          }
        );
      }
    } else {
      navigate(btnSetting.url);
    }
  };

  const handleAddInput = (value) => {
    const data = {
      id: value.medicineId,
      name: value.medicineName,
    };
    addDrugInputs(data);
  };
  const onClickAddBtn = (name) => {
    let formType = "의약품";
    if (form === "disease") formType = "지병";
    if (name == "[object Object]") name = "";
    Swal.fire({
      title: `${formType} 명을 입력해주세요`,
      html: '<div id="swal-react-container"></div>',
      didOpen: () => {
        const container = document.getElementById("swal-react-container");
        const root = createRoot(container);
        root.render(
          <AutoCompleteInput
            $onChange={Swal.resetValidationMessage}
            $prev={name}
            $formType={form}
          />
        );
      },
      preConfirm: () => {
        const inputValue = document.querySelector(
          "#swal-react-container input"
        ).value;
        const searchResults = useSearchStore.getState().searchResults;
        const existsInArray = searchResults.some((item) =>
          form === "disease"
            ? item.cdName === inputValue
            : item.medicineName === inputValue
        );
        const existsInInputs =
          form === "disease"
            ? medCdisInputs.some((item) => item.name === inputValue)
            : drugInputs.some((item) => item.name === inputValue);

        if (!existsInArray) {
          Swal.showValidationMessage(
            `해당하는 단어가 ${formType}정보에 없습니다.`
          );
          return false;
        }

        if (existsInInputs) {
          Swal.showValidationMessage("이미 추가된 항목입니다.");
          return false;
        } else {
          if (name && inputValue !== name) {
            if (form === "disease") {
              const prevIndex = medCdisInputs.findIndex(
                (item) => item.name === name
              );
              if (prevIndex !== -1) {
                deleteMedCdisInput(prevIndex);
              }
            }
            const prevIndex = drugInputs.findIndex(
              (item) => item.name === name
            );
            if (prevIndex !== -1) {
              deleteDrugInput(prevIndex);
            }
          }
        }
        // 추가 처리 로직
        const newItem = searchResults.find((item) =>
          form === "disease"
            ? item.cdName === inputValue
            : item.medicineName === inputValue
        );

        return inputValue
          ? Promise.resolve(newItem)
          : Promise.reject("입력해 주세요.");
      },
      width: "30em",
      confirmButtonText: "저장하기",
      confirmButtonColor: "#FFCC70",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAddInput(result.value);
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
    $width: "",
    $height: "auto",
  };

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
