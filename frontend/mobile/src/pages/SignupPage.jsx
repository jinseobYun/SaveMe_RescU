import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { Header, TabBar } from "@components/common";
import { SignupUserInfoForm, SignupLoginInfoForm } from "@components/form";
import { Button, Text, Input } from "@components/elements";

const SignupPage = () => {
  return (
    <>
      <Header navText="회원가입" />
      <Routes>
        <Route path="userinfo" element={<SignupUserInfoForm />} />
        <Route path="logininfo" element={<SignupLoginInfoForm />} />
      </Routes>
    </>
  );
};

export default SignupPage;
