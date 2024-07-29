import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { HomePage, LoginPage, SignupPage, ReportCallPage } from "@/pages";
import GlobalStyle from "@/globalStyles.js";
function App() {
  return (
    <>
      <Container>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/report" element={<ReportCallPage />} />
          </Routes>
        </Router>
      </Container>
    </>
  );
}
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%
  max-height: 800px;
  max-width:360px;
  padding-bottom: 4px;
  flex-direction: column;
  align-items: flex-start;
`;
export default App;
