import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid, Button, Text, Input } from "@components/elements";
import { Header } from "@components/common";
import useForm from "@/hooks/useForm";
import { SignUpValidation } from "@/util/validation";

const Login = () => {
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: { id: "", password: "" },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validate: SignUpValidation,
  });
  return (
    <>
      <Header />
      <Grid
        $display="flex"
        $width="360px"
        $height="580px"
        $padding="100px 4px"
        $flex-direction="column"
        $align-items="center"
      ></Grid>
      <FormWrapper>
        <form onSubmit={handleSubmit} noValidate>
          <Input
            $placeholder="아이디"
            $value={values.id}
            _onChange={handleChange}
            $label="아이디*"
            $errorMessage={errors.id}
            $isValid={errors.id && true}
          />
          <Input
            $placeholder="비밀번호"
            $value={values.pw}
            _onChange={handleChange}
            $label="비밀번호*"
            $errorMessage={errors.pw}
            $isValid={errors.pw && true}
            $
          />
        </form>
      </FormWrapper>
    </>
  );
};

export default Login;
const FormWrapper = styled.div`
  display: flex;
  width: 360px;
  height: 580px;
  flex-direction: column;
  align-items: center;
  // padding: 100px 4px;
  // gap: var(--sds-size-space-400);
  flex-shrink: 0;
`;
