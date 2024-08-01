import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Grid, Button, Text, Input } from "@components/elements";
import { Header } from "@components/common";
import useForm from "@/hooks/useForm";
import { login } from "@/api/userApi";
import useUserStore from "@/store/useUserStore";

const Login = () => {
  const navigate = useNavigate();
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setReFreshToken = useUserStore((state) => state.setReFreshToken);
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: { id: "", password: "" },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      //TODO - api test
      // login(
      //   values.id,
      //   values.password,
      //   ({ data }) => {
      // //TODO - 토큰 저장하기
      //     navigate("/");
      //   },
      // (error) => {
      //   console.log(error);
      //   errorAlert(error.response.status);
      // }
      // );
    },
    validate: () => {},
  });
  return (
    <FormWrapper>
      <Header navText="로그인" />
      <Grid
        $display="flex"
        $width="360px"
        $height="580px"
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
            $name="password"
            $placeholder="비밀번호"
            $value={values.password}
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
            <Link to="/signup/userinfo">
              <Text children="회원가입" $color="var(--main-orange-color)" />
            </Link>
          </TextBox>
          <TextBox>
            <Link to="/findId">
              <Text children="아이디 찾기" $color="var(--gray-color-200)" />
            </Link>
            <Text children="|" $color="var(--gray-color-200)" />

            <Link to="/findPassword">
              <Text children="비밀번호 찾기" $color="var(--gray-color-200)" />
            </Link>
          </TextBox>
        </StyledForm>
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
