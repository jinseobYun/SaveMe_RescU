import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { SignupUserInfoForm, SignupLoginInfoForm } from "@components/form";

const SignupPage = () => {
  return (
    <>
      <Routes>
        <Route path="userinfo" element={<SignupUserInfoForm />} />
        <Route path="logininfo" element={<SignupLoginInfoForm />} />
      </Routes>
    </>
  );
};

export default SignupPage;
