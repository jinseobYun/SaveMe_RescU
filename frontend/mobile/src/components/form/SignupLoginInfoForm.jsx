import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  Grid,
  Button,
  Text,
  Input,
  NextPageButton,
} from "@components/elements";
import useForm from "@/hooks/useForm";
import { SignUpValidationLoginInfo } from "@/util/validation";
import useFormInputStore from "@/store/useFormInputStore";

const SignupLoginInfoForm = () => {
  const { updateInputs, inputs } = useFormInputStore();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      id: inputs.id,
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      console.log("success");
      console.log(values);
      //TODO - 인증번호 요청 api
      updateInputs(values);

      navigate("/signup/terms");
    },
    validate: SignUpValidationLoginInfo,
  });
  const navigate = useNavigate();

  const [isTextOnce, setIsTextOnce] = useState(false);
  const onChangeGender = (e) => {
    e.preventDefault();
    values.gender = e.target.value;
  };
  useEffect(() => {
    Object.keys(errors).length > 0 && setIsTextOnce(true);
  }, [errors]);
  return (
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
            $haveToCheckValid={true}
          />
          <Input
            $name="password"
            $placeholder="비밀번호"
            $value={values.password}
            _onChange={handleChange}
            $label="비밀번호*"
            $haveToCheckValid={true}
            $type="password"
          />
          <Input
            $name="confirmPassword"
            $placeholder="비밀번호를 다시 입력해주세요"
            $value={values.confirmPassword}
            _onChange={handleChange}
            $label="비밀번호*"
            $haveToCheckValid={true}
            $type="password"
          />
        </StyledForm>
      </Grid>
      <NextPageButton
        isError={isTextOnce != (Object.keys(errors).length === 0)}
        text="다음"
        handleClick={handleSubmit}
      />
    </FormWrapper>
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
