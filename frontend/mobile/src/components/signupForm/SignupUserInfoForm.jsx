import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Grid, Button, Text, Input } from "@components/elements";
import { Header } from "@components/common";
import useForm from "@/hooks/useForm";
import { SignUpValidation } from "@/util/validation";
import useFormInputStore from "@/store/useFormInputStore";

const SignupUserInfoForm = () => {
  const { inputs, updateInputs } = useFormInputStore;
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: { id: "", password: "" },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      updateInputs(values);
    },
    validate: SignUpValidation,
  });
  return (
    <Grid
      $display="flex"
      $width="100%"
      $height="100%"
      $padding="100px 4px"
      $flex_direction="column"
      $align_items="center"
    >
      <StyledForm onSubmit={handleSubmit} noValidate>
        <Input
          $name="id"
          $placeholder="아이디"
          $value={values.id}
          _onChange={handleChange}
          $label="아이디*"
          $haveToCheckValid={false}
        />
        <Input
          $name="pw"
          $placeholder="비밀번호"
          $value={values.pw}
          _onChange={handleChange}
          $label="비밀번호*"
          $haveToCheckValid={false}
          $type="password"
        />
        <Button
          $display="flex"
          $width="200px"
          $height="48px"
          $padding="8px 12px"
          $margin="2rem 0"
          $justify-content="center"
          $align-items="center"
          $bg={{ default: "var(--main-orange-color)" }}
          $color="var(--white-color-100)"
          children="로그인"
        />
        <TextBox>
          <Text children="계정이 없으신가요? " />
          <Link to="/signup">
            <Text children="회원가입" $color="var(--main-orange-color)" />
          </Link>
        </TextBox>
        <TextBox>
          <Link to="/findId">
            <Text children="아이디 찾기" $color="var(--gray-color-200)" />
          </Link>
          <Link to="/findPassword">
            <Text children="비밀번호 찾기" $color="var(--gray-color-200)" />
          </Link>
        </TextBox>
      </StyledForm>
    </Grid>
  );
};

export default SignupUserInfoForm;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 1rem;
`;
