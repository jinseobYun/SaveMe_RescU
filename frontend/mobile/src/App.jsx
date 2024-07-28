import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { Home, Login, Signup } from "@/pages";
import GlobalStyle from "@/globalStyles.js";
function App() {
  return (
    <>
      <Container>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </Container>
    </>
  );
}
const Container = styled.div`
  display: flex;
  width: 360px;
  height: 100vh;
  padding-bottom: 4px;
  flex-direction: column;
  align-items: flex-start;
`;
export default App;
