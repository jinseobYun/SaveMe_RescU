import { useDispatch, useSelector } from "react-redux";
import { Navigate, createSearchParams, useNavigate } from "react-router-dom";
import { loginPostAsync, logout } from "../slices/loginSlice";

const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const exceptionHandle = (ex) => {
    console.log("예외 발생");
    console.log(ex);

    const errorMsg = ex.response.data.error;
    const errorStr = createSearchParams({ error: errorMsg }).toString();

    console.log(errorStr);
  };

  // 로그인 상태
  const loginState = useSelector((state) => state.loginSlice);

  // 로그인 여부 확인
  const isLogin = !!loginState.memberId;

  // 로그인 실행 hooks
  const doLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsync(loginParam));
    return action.payload;
  };

  // 로그아웃 실행 hooks
  const doLogout = () => {
    dispatch(logout());
  };

  // 로그인 시, redirect로 main 이동
  const moveToPath = (path) => {
    navigate({ pathname: path }, { replace: true });
  };

  // 로그아웃, 로그인 만료 시 로그인 페이지로 이동
  const moveToLogin = () => {
    navigate({ pathname: "/" }, { replace: true });
  };

  const moveToLoginReturn = () => {
    return <Navigate replace to="/" />;
  };

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
  };
};

export default useCustomLogin;
