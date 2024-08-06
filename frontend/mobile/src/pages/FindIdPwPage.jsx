import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import { Grid, Input, Text, NextPageButton } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
import useForm from "@/hooks/useForm";
import { Header, TabBar } from "@components/common";
import { reqVerifyCode } from "@api/userApi";
const FindIdPwPage = () => {
  const location = useLocation();
  const isFindPassword = location.pathname === "/findpassword";
  const { inputs, updateInputs } = useFormInputStore();

  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: inputs.name || "",
      phoneNumber: inputs.phoneNumber || "",
    },
    onSubmit: (values) => {
      console.log(values);

      //TODO - api 연결
      updateInputs(values);
      reqVerifyCode(
        values.phoneNumber,
        ({ data }) => {
          if (data.status === "200") {
            isFindPassword
              ? navigate("/verification", { state: { type: "findpassword" } })
              : navigate("/verification", { state: { type: "findid" } });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    validate: null,
  });

  return (
    <>
      <Container>
        <Header navText="" backAlert={true} />
        <Text>회원 가입 시 등록한 정보를 입력해 주세요.</Text>
        <StyledForm>
          <Input
            $name="name"
            $placeholder="이름"
            $value={values.name}
            _onChange={handleChange}
            $haveToCheckValid={false}
            $label="이름*"
          />
          <Input
            $name="phoneNumber"
            $placeholder="휴대폰 번호"
            $label="휴대폰 번호*"
            $type="number"
            $value={values.phoneNumber}
            _onChange={handleChange}
            $haveToCheckValid={false}
            $maxLen={12}
          />
          {isFindPassword && (
            <>
              <Input
                $name="birth"
                $value={values.birth}
                _onChange={handleChange}
                $label="생년월일*"
                $type="date"
                $haveToCheckValid={false}
              />
            </>
          )}
        </StyledForm>
        <NextPageButton
          isError={!(values.name.length > 0 && values.phoneNumber.length > 0)}
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
`;
const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
  margin-left: 2rem;
  margin-right: 2rem;
  gap: 1.5rem;
  padding: 10vh 15px;
`;