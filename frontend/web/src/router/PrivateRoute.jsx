import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("memberId");

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;