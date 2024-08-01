import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import {
  SignupUserInfoForm,
  SignupLoginInfoForm,
  VerifyCodeForm,
} from "@components/form";
import {
  HomePage,
  LoginPage,
  SignupPage,
  ReportCallPage,
  AgreeTermsPage,
} from "@/pages";
import GlobalStyle from "@/globalStyles.js";
function App() {
  return (
    <Container>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup/*" element={<SignupPage />}>
            <Route path="userinfo" element={<SignupUserInfoForm />} />
            <Route path="logininfo" element={<SignupLoginInfoForm />} />
          </Route>

          <Route path="/verification" element={<VerifyCodeForm />} />
          <Route path="/agreeterms" element={<AgreeTermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportCallPage />} />
          <Route path="/findId" element={<HomePage />} />
          <Route path="/findPassword" element={<HomePage />} />
        </Routes>
      </Router>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 640px;
  // max-width: 360px;
  max-height: 800px;
  min-width: 360px;
  padding-bottom: 4px;
  flex-direction: column;
  align-items: flex-start;
`;
export default App;
