import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

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
  AgreeTermsPage,
  MenuPage,
  MedicalInfoPage,
  EditMedicalInfoPage,
  EmergencycontactsPage,
  FirstAidPage,
  FindIdPwPage,
  ChangePwPage,
  EmptyPage,
  NfcInfoPage,
  ReportOpenViduPage,
  DetailFirstAid,
  PushNotiPage,
  ServiceTermsPage,
} from "@/pages";
import GlobalStyle from "@/globalStyles.js";
import useUserStore from "@/store/useUserStore";
function App() {
  const { clearGps } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      clearGps();
    };
  }, []);
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault(); // 페이지 이동 방지
      event.stopPropagation(); // 이벤트 전파 방지
      if (Swal.isVisible()) {
        Swal.close(); // 모든 SweetAlert2 모달 닫기
      } else {
        navigate(-1); // 뒤로 가기
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <Container>
      <GlobalStyle />

      <Routes>
        {/* 인증이 필요없는 */}
        {/* <Route path="/" element={<Navigate to="/home" />} /> */}
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/" element={<HomePage />} />

        <Route path="/report" element={<ReportOpenViduPage />} />
        <Route path="/verification" element={<VerifyCodeForm />} />
        <Route path="/changepassword" element={<ChangePwPage />} />
        <Route path="/firstaid" element={<FirstAidPage />} />
        <Route path="/firstaid/detail" element={<DetailFirstAid />} />
        <Route path="/findpassword" element={<FindIdPwPage />} />
        {/* 인증을 해야만 */}
        <Route element={<PrivateRoute authentication={true} />}>
          <Route
            path="/emergencycontacts"
            element={<EmergencycontactsPage />}
          />

          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/changeInfo" element={<MenuPage />} />
          <Route path="/medicalinfo" element={<MedicalInfoPage />} />
          <Route path="/medicalinfo/edit/*" element={<EditMedicalInfoPage />} />
          <Route path="/nfcinfo" element={<NfcInfoPage />} />
          <Route path="/pushnotis" element={<PushNotiPage />} />
          <Route path="/serviceterms" element={<ServiceTermsPage />} />
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
        </Route>
        <Route path="*" element={<EmptyPage />} />
      </Routes>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  // min-height: 640px;
  // max-width: 480px;
  // max-height: 800px;
  // min-width: 360px;
  padding-bottom: 4px;
  align-items: flex-start;
`;
export default App;
