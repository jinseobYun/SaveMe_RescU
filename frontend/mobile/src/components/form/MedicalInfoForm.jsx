import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { Grid, Text, NextPageButton } from "@components/elements";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";
import useForm from "@/hooks/useForm";

const MedicalInfoForm = () => {
  const { userName, userMedicalInfo } = useUserStore();

  const { updateInputs, inputs } = useFormInputStore();
  const navigate = useNavigate();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      aboType: inputs.aboType || "",
      rhType: inputs.rhType || "",
      otherSignificant: inputs.otherSignificant || "",
    },
    onSubmit: (values) => {
      console.log(values);
      updateInputs(values);
      navigate("/medicalinfo/edit?form=drug");
    },
    validate: null,
  });
  const onChangeRhRadio = (e) => {
    e.preventDefault();
    handleChange(e);
  };
  const onChangeAboRadio = (e) => {
    e.preventDefault();
    handleChange(e);
  };
  useEffect(() => {
    const stringifiedData = JSON.stringify(inputs);
    const parsedData = JSON.parse(stringifiedData);
    console.log(JSON.stringify(inputs));
    console.log(values);
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
          children={`${userName}님! 신고 시 전달될 정보를 등록해 주세요`}
          $color="var(--blakc-color-300)"
        />
        <StyledForm noValidate>
          <Grid
            // $width="40%"
            $display="flex"
            $flex_direction="column"
            $marign="0 0 2rem 0"
            $gap="0.5rem"
            $align_items="flex-start"
          >
            <Text
              children="RH 혈액형*"
              $color="var(--label-gray-color)"
              $size="12px"
              $lineHeight="16px"
            />
            <Grid
              $display="flex"
              $flex_direction="row"
              $align_items="center"
              $padding="8px"
              $border="1px solid var(--main-orange-color)"
              $radius="5px"
            >
              <Text
                children="RH+"
                $color="var(--label-gray-color)"
                $size="12px"
                $lineHeight="16px"
              />
              <StyledRadio
                value="RH+"
                type="radio"
                name="rhType"
                onChange={onChangeRhRadio}
                checked={values.rhType === "RH+"}
              />
              <Text
                children="RH-"
                $color="var(--label-gray-color)"
                $size="12px"
                $lineHeight="16px"
              />
              <StyledRadio
                value="RH-"
                type="radio"
                name="rhType"
                onChange={onChangeRhRadio}
                checked={values.rhType === "RH-"}
              />
            </Grid>
          </Grid>
          <Grid
            // $width="40%"
            $display="flex"
            $flex_direction="column"
            $marign="0 0 2rem 0"
            $gap="0.5rem"
            $align_items="flex-start"
          >
            <Text
              children="ABO 혈액형*"
              $color="var(--label-gray-color)"
              $size="12px"
              $lineHeight="16px"
            />
            <Grid
              $display="flex"
              $flex_direction="row"
              $align_items="center"
              $padding="8px"
              $height="38px"
              $border="1px solid var(--main-orange-color)"
              $radius="5px"
            >
              <Text
                children="A"
                $color="var(--label-gray-color)"
                $size="12px"
                $lineHeight="16px"
              />
              <StyledRadio
                value="A"
                type="radio"
                name="aboType"
                onChange={onChangeAboRadio}
                checked={values.aboType === "A"}
              />
              <Text
                children="B"
                $color="var(--label-gray-color)"
                $size="12px"
                $lineHeight="16px"
              />
              <StyledRadio
                value="B"
                type="radio"
                name="aboType"
                onChange={onChangeAboRadio}
                checked={values.aboType === "B"}
              />
              <Text
                children="AB"
                $color="var(--label-gray-color)"
                $size="12px"
                $lineHeight="16px"
              />
              <StyledRadio
                value="AB"
                type="radio"
                name="aboType"
                onChange={onChangeAboRadio}
                checked={values.aboType === "AB"}
              />
              <Text
                children="O"
                $color="var(--label-gray-color)"
                $size="12px"
                $lineHeight="16px"
              />
              <StyledRadio
                value="O"
                type="radio"
                name="aboType"
                onChange={onChangeAboRadio}
                checked={values.aboType === "O"}
              />
            </Grid>
          </Grid>
          <Grid
            // $width="40%"
            $display="flex"
            $flex_direction="column"
            $marign="0 0 2rem 0"
            $gap="0.5rem"
            $align_items="flex-start"
          >
            <Text
              children="기타 특이사항"
              $color="var(--label-gray-color)"
              $size="12px"
              $lineHeight="16px"
            />
            <StyledTextarea
              name="otherSignificant"
              rows="5"
              cols="33"
              maxLength={"1000"}
              value={values.otherSignificant}
              onChange={handleChange}
            />
          </Grid>
        </StyledForm>
      </Grid>
      <NextPageButton isError={false} text="다음" handleClick={handleSubmit} />
    </Container>
  );
};

export default MedicalInfoForm;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
const StyledForm = styled.form`
  display: flex;

  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
  margin-left: 2rem;
  margin-right: 2rem;
  gap: 1.5rem;
`;

const StyledRadio = styled.input`
  -webkit-appearance: none; // 웹킷 브라우저에서 기본 스타일 제거
  -moz-appearance: none; // 모질라 브라우저에서 기본 스타일 제거
  appearance: none; // 기본 브라우저에서 기본 스타일 제거
  width: 18px;
  height: 18px;
  border: 2px solid #ccc; // 체크되지 않았을 때의 테두리 색상
  border-radius: 50%;
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

const StyledTextarea = styled.textarea`
  resize: none;
  word-break: break-all;
  white-space: pre-wrap;
  border-radius: 5px;
  border: 1px solid var(--main-orange-color);
  outline: none;
  &:focus {
    border: 1px solid var(--main-orange-color);
    outline: none;
  }
`;
