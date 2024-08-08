import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Grid, Text, Input, NextPageButton } from "@components/elements";
import useForm from "@/hooks/useForm";
import { SignUpValidationUserInfo } from "@/util/validation";
import useFormInputStore from "@/store/useFormInputStore";
import { reqVerifyCode } from "@/api/userApi";
import { Header } from "@/components/common";
const SignupUserInfoForm = () => {
  const { updateInputs, inputs } = useFormInputStore();
  const navigate = useNavigate();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: inputs.name || "",
      birth: inputs.birth || "",
      phoneNumber: inputs.phoneNumber || "",
      gender: inputs.gender || "",
    },
    onSubmit: (values) => {
      updateInputs(values);

      reqVerifyCode(
        values.phoneNumber,
        (response) => {
          if (response.status === 200) {
            navigate("/verification", { state: { type: "signup" } });
            //FIXME - 인증코드 저장 없애기
            updateInputs({ temporyCode: response.data.toString() });
          } else {
            console.log(response);
          }
          4867;
        },
        (error) => {
          console.log(error.toJSON());
        }
      );
    },
    validate: SignUpValidationUserInfo,
  });

  const [isTextOnce, setIsTextOnce] = useState(false);

  const onChangeGender = (e) => {
    e.preventDefault();
    handleChange(e);
  };
  useEffect(() => {
    if (isTextOnce != (Object.keys(errors).length !== 0)) setIsTextOnce(true);
    if (inputs.name) setIsTextOnce(true);
  }, [errors]);
  return (
    <>
      <Header navText="회원가입" backAlert={true} />

      <Grid
        $display="flex"
        $width="100%"
        $height="100%"
        $padding="10vh 4px"
        $flex_direction="column"
      >
        <StyledForm noValidate>
          <Input
            $name="name"
            $placeholder="이름"
            $value={values.name}
            _onChange={handleChange}
            $errorMessage={errors.name}
            $haveToCheckValid={true}
            $isValid={errors.name && false}
            $label="이름*"
          />
          <Grid
            $width="90%"
            $display="flex"
            $flex_direction="row"
            $align_items="flex-start"
            $gap="2rem"
          >
            <Input
              $name="birth"
              $value={values.birth}
              _onChange={handleChange}
              $label="생년월일*"
              $type="date"
              $errorMessage={errors.birth}
              $haveToCheckValid={true}
              $isValid={errors.birth && false}
            />
            <Grid
              // $width="40%"
              $display="flex"
              $flex_direction="column"
              $marign="0 0 2rem 0"
              $gap="0.5rem"
              $align_items="flex-start"
            >
              <Text
                children="성별*"
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
                  children="남성"
                  $color="var(--label-gray-color)"
                  $size="12px"
                  $lineHeight="16px"
                />
                <label></label>
                <StyledRadio
                  value="0"
                  type="radio"
                  name="gender"
                  onChange={onChangeGender}
                  defaultChecked={inputs.gender === "0"}
                />
                <Text
                  children="여성"
                  $color="var(--label-gray-color)"
                  $size="12px"
                  $lineHeight="16px"
                />
                <StyledRadio
                  value="1"
                  type="radio"
                  name="gender"
                  onChange={onChangeGender}
                  defaultChecked={inputs.gender === "1"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Input
            $name="phoneNumber"
            $placeholder="휴대폰 번호"
            $label="휴대폰 번호*"
            $type="tel"
            $value={values.phoneNumber}
            _onChange={handleChange}
            $errorMessage={errors.phoneNumber}
            $haveToCheckValid={true}
            $isValid={errors.phoneNumber && false}
            $maxLen={12}
          />
        </StyledForm>
      </Grid>

      <NextPageButton
        isError={isTextOnce != (Object.keys(errors).length === 0)}
        text="인증 번호 받기"
        handleClick={handleSubmit}
        $color={{ default: "var(--white-color-100)" }}
      />
    </>
  );
};

export default SignupUserInfoForm;

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
    // 그림자로 테두리를 직접 만들어야 함 (퍼지는 정도를 0으로 주면 테두리처럼 보입니다.)
    // 그림자가 없으면 그냥 설정한 색상이 꽉 찬 원으로만 나옵니다.
  }
`;
