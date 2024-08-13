import React from "react";
import { Navigate } from "react-router-dom";

const LoginRedirect = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("memberId");

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

export default LoginRedirect;
