import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid, Button, Text, Input } from "@components/elements";
import { Header } from "@components/common";
import useForm from "@/hooks/useForm";
import { SignUpValidation } from "@/util/validation";
import useFormInputStore from "@/store/useFormInputStore";

const Login = () => {
  const { inputs, updateInputs } = useFormInputStore;
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: { id: "", password: "" },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      updateInputs(values);
    },
  });
  return (
    <FormWrapper>
      <Header />
      <Grid
        $display="flex"
        $width="360px"
        $height="580px"
        $padding="100px 4px"
        $flex_direction="column"
        $align_items="center"
      >
        <form onSubmit={handleSubmit} noValidate>
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
        </form>
        <Button />
      </Grid>
    </FormWrapper>
  );
};

export default Login;
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;
