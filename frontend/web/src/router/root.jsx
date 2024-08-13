import { createBrowserRouter, Navigate  } from "react-router-dom";
import LoginPage from "../pages/members/LoginPage";
import MainPage from "../pages/MainPage";
import WebRTC from "../pages/WebRTC";
import Map from "../pages/MapPage";
import AdminPage from "../pages/AdminPage";
import MyPage from "../pages/members/MyPage";
import FirstInfo from "../components/webRTC/FirstInfo";
import SecondInfo from "../components/webRTC/SecondInfo";

const root = createBrowserRouter([
  {
    path: "",
    element: <LoginPage />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
  {
    path: "/webrtc",
    element: <WebRTC />,
    children: [
      {
        path: "",
        element: <Navigate to="first-info" />,
      },
      {
        path: "first-info",
        element: <FirstInfo />,
      },
      {
        path: "second-info",
        element: <SecondInfo />,
      },
    ],
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
],
{
  basename: "/rescu",
}
);

export default root;
