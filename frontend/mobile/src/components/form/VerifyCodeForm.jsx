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
import { Header } from "@components/common";
const VerifyCodeForm = () => {
  const navigate = useNavigate();
  const [isVerify, setIsVerify] = useState(false);
  const [time, setTime] = useState();
  const handleSubmit = () => {};
  return (
    <>
      <FormWrapper>
        <Header navText="" />
        <Grid
          $display="flex"
          $width="360px"
          $height="580px"
          $padding="100px 4px"
          $flex_direction="column"
          $align_items="center"
          $gap="14px"
        >
          <Text
            $color="var(--gray-color-300)"
            children="인증 번호 6자리 숫자를 입력해 주세요."
          />
          <Grid
            $display="flex"
            $flex_direction="row"
            $align_items="center"
            $gap="5px"
          >
            <StyledInput />
            <StyledInput />
            <StyledInput />
            <StyledInput />
            <StyledInput />
            <StyledInput />
          </Grid>
        </Grid>
        <NextPageButton
          isError={!isVerify}
          text="아이디 찾기"
          handleClick={handleSubmit}
        />
      </FormWrapper>
    </>
  );
};

export default VerifyCodeForm;
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  width: 39.884px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid var(--main-orange-color, #ffb22c);
  opacity: 50%;
  background: var(--main-basic-color, #fffce3);
`;
