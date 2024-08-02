import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Grid, Input, NextPageButton } from "@components/elements";
import useForm from "@/hooks/useForm";
import { SignUpValidationLoginInfo } from "@/util/validation";
import useFormInputStore from "@/store/useFormInputStore";
import { Header } from "@/components/common";

const SignupLoginInfoForm = () => {
  const { updateInputs, inputs } = useFormInputStore();
  const navigate = useNavigate();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      id: inputs.id || "",
      password: inputs.password || "",
      confirmPassword: inputs.confirmPassword || "",
    },
    onSubmit: (values) => {
      console.log(values);
      updateInputs(values);
      navigate("/agreeterms");
    },
    validate: SignUpValidationLoginInfo,
  });

  const [isTextOnce, setIsTextOnce] = useState(false);
  useEffect(() => {}, []);
  useEffect(() => {
    console.log(errors, values);
    if (isTextOnce != (Object.keys(errors).length !== 0)) setIsTextOnce(true);

    // Object.keys(errors).length > 0 && setIsTextOnce(true);
  }, [errors]);
  return (
    <>
      <Header navText="회원가입" />

      <FormWrapper>
        <Grid
          $display="flex"
          $width="100%"
          $height="100%"
          $padding="10vh 4px"
          $flex_direction="column"
        >
          <StyledForm noValidate>
            <Input
              $name="id"
              $placeholder="아이디"
              $value={values.id}
              _onChange={handleChange}
              $label="아이디*"
              $errorMessage={errors.id}
              $haveToCheckValid={true}
              $isValid={errors.id && false}
            />
            <Input
              $name="password"
              $placeholder="비밀번호"
              $value={values.password}
              _onChange={handleChange}
              $label="비밀번호*"
              $haveToCheckValid={true}
              $type="password"
              $errorMessage={errors.password}
              $isValid={errors.password && false}
            />
            <Input
              $name="confirmPassword"
              $placeholder="비밀번호를 다시 입력해주세요"
              $value={values.confirmPassword}
              _onChange={handleChange}
              $label="비밀번호*"
              $haveToCheckValid={true}
              $errorMessage={errors.confirmPassword}
              $isValid={errors.confirmPassword && false}
              $type="password"
            />
          </StyledForm>
        </Grid>
      </FormWrapper>
      <NextPageButton
        isError={isTextOnce != (Object.keys(errors).length === 0)}
        text="다음"
        handleClick={handleSubmit}
      />
    </>
  );
};

export default SignupLoginInfoForm;

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

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
`;
