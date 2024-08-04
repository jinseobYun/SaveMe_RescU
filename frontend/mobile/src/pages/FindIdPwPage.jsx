import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import { Grid, Button, Text, NextPageButton } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
import useForm from "@/hooks/useForm";
import { Header, TabBar } from "@components/common";

const FindIdPwPage = () => {
  const location = useLocation();
  const isFindPassword = location.pathname === "/findpassword";
  return (
    <>
      <Container>
        <Header navText="" />
        <Title>회원 가입 시 등록한 정보를 입력해 주세요.</Title>
        <StyledForm>
          {/* <Input
            $name="name"
            $placeholder="이름"
            $value={values.name}
            _onChange={handleChange}
            $errorMessage={errors.name}
            $haveToCheckValid={true}
            $isValid={errors.name && false}
            $label="이름*"
          />
          <Input
            $name="phoneNumber"
            $placeholder="전화번호"
            $label="전화번호*"
            $type="tel"
            $value={values.phoneNumber}
            _onChange={handleChange}
            $errorMessage={errors.phoneNumber}
            $haveToCheckValid={true}
            $isValid={errors.phoneNumber && false}
            $maxLen={12}
          /> */}
          {isFindPassword && (
            <>
              {/* <Input
              $name="birth"
              $value={values.birth}
              _onChange={handleChange}
              $label="생년월일*"
              $type="date"
              $errorMessage={errors.birth}
              $haveToCheckValid={true}
              $isValid={errors.birth && false}
            /> */}
            </>
          )}
        </StyledForm>
        <NextPageButton
          isError={isTextOnce != (Object.keys(errors).length === 0)}
          text="인증 번호 받기"
          handleClick={handleSubmit}
          $color={{ default: "var(--white-color-100)" }}
        />
      </Container>
    </>
  );
};

export default FindIdPwPage;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #fefefe;
`;
const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
`;
