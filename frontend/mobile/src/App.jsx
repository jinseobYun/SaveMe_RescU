import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import {
  SignupUserInfoForm,
  SignupLoginInfoForm,
  VerifyCodeForm,
} from "@components/form";
import PrivateRoute from "@/router/PrivateRoute";
import {
  HomePage,
  LoginPage,
  SignupPage,
  ReportCallPage,
  AgreeTermsPage,
  MenuPage,
  MedicalInfoPage,
  EditMedicalInfoPage,
  EmergencycontactsPage,
  FirstAidPage,
  FindIdPwPage,
  ChangePwPage,
  EmptyPage,
} from "@/pages";
import GlobalStyle from "@/globalStyles.js";
function App() {
  return (
    <Container>
      <GlobalStyle />
      <Router basename="/app/">
        <Routes>
          {/* 인증이 필요없는 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/verification" element={<VerifyCodeForm />} />
          <Route path="/report" element={<ReportCallPage />} />

          <Route path="/changepassword" element={<ChangePwPage />} />
          <Route path="/firstaid" element={<FirstAidPage />} />

          {/* 인증을 해야만 */}
          <Route element={<PrivateRoute authentication={true} />}>
            <Route
              path="/emergencycontacts"
              element={<EmergencycontactsPage />}
            />

            <Route path="/menu" element={<MenuPage />} />
            <Route path="/medicalinfo" element={<MedicalInfoPage />} />
            <Route
              path="/medicalinfo/edit/*"
              element={<EditMedicalInfoPage />}
            />
            {/*  <Route path="/nfc-info" element={<NfcInfoPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/privacy-agreement" element={<PrivacyAgreementPage />} />
          <Route
          path="/profile-management"
          element={<ProfileManagementPage />}
          /> */}
          </Route>

          {/* 인증을 하지않아야 */}
          <Route element={<PrivateRoute authentication={false} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup/*" element={<SignupPage />}>
              <Route path="userinfo" element={<SignupUserInfoForm />} />
              <Route path="logininfo" element={<SignupLoginInfoForm />} />
            </Route>
            <Route path="/agreeterms" element={<AgreeTermsPage />} />

            <Route path="/findid" element={<FindIdPwPage />} />
            <Route path="/findid/result" element={<HomePage />} />
            <Route path="/findpassword" element={<FindIdPwPage />} />
          </Route>
          <Route path="*" element={<EmptyPage />} />
        </Routes>
      </Router>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  min-height: 640px;
  // max-width: 360px;
  max-height: 800px;
  min-width: 360px;
  padding-bottom: 4px;
  align-items: flex-start;
`;
export default App;