import { Navigate, Outlet } from "react-router-dom";

import useUserStore from "@/store/useUserStore";

const PrivateRoute = ({ authentication }) => {
  const isLogined = useUserStore((state) => state.isLogined);

  if (authentication) {
    return isLogined === null || isLogined === false ? (
      <Navigate to="/login" />
    ) : (
      <Outlet />
    );
  } else {
    // 인증이 반드시 필요 없는 페이지
    // 인증을 안햇을 경우 해당 페이지로 인증을 한 상태일 경우 main페이지로
    return isLogined === null || isLogined === false ? (
      <Outlet />
    ) : (
      <Navigate to="/" />
    );
  }
};

export default PrivateRoute;
