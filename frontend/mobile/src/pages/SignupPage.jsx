import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { Header } from "@components/common";
import { SignupUserInfoForm } from "@components/signupForm";
const SignupPage = () => {
  return (
    <FormWrapper>
      <Header navText="회원가입" />
      <Routes>
        <Route path="userInfo" element={<SignupUserInfoForm />} />
        <Route path="loinInfo" element={<SignupLoginInfoForm />} />
      </Routes>
    </FormWrapper>
  );
};

export default SignupPage;
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;
