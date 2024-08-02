import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  Grid,
  Button,
  Input,
  Text,
  NextPageButton,
} from "@components/elements";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";

//TODO - 투약 정보 폼, 지병 폼 두개 다 가능하게 하기
const MedicalSpecificForm = ({ form, btnSetting }) => {
  const { medCdisInputs, drugInputs, addMedCdisInputs, addDrugInputs } =
    useFormInputStore();
  const navigate = useNavigate();

  const onClickAddBtn = (e) => {
    e.preventDefault();
    //TODO - 입력값에 해당하는 index번호로 파싱
    const index = 0;

    if (form === "disease") {
      const data = {
        cdInfoId: index,
        cdName: input,
      };
      addMedCdisInputs(data);
    } else {
      const data = {
        medicineId: index,
        medicineName: input,
      };
      addDrugInputs(data);
    }

    setInput("");
  };

  const [input, setInput] = useState("");

  const onChange = (e) => {
    setInput(e.target.value);
  };
  useEffect(() => {
    //TODO - 첫 검색시 SearchStore에 저장하고 첫 글자가 바뀌면 다시 서치 api 호출
    //TODO - 엘라스틱 서치 도입,지병과 의약품 삼항식으로

    console.log(input);
  }, [input]);

  const onClickNextBtn = (e) => {
    if (form === "disease") {
      //TODO - 의료정보 저장 api
    }
    navigate(btnSetting.url);
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
        <StyledForm noValidate>
          <Input
            // $value={input}
            _onChange={onChange}
            $haveToCheckValid={false}
            $isValid={true}
            $height="auto"
          />
          <AddCircleOutlineIcon
            onClick={onClickAddBtn}
            sx={{ color: "var(--main-orange-color)", fontSize: 30 }}
          />
        </StyledForm>
        {form === "disease"
          ? medCdisInputs &&
            medCdisInputs.map((d, i) => {
              return (
                <Text
                  key={d.cdInfoId}
                  children={d.cdName}
                  $color="var(--black-color-300)"
                />
              );
            })
          : drugInputs &&
            drugInputs.map((m, i) => {
              return (
                <Text
                  key={m.medicineId}
                  children={m.medicineName}
                  $color="var(--black-color-300)"
                />
              );
            })}
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
const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-left: 2rem;
  margin-right: 2rem;
  gap: 1.5rem;
`;
