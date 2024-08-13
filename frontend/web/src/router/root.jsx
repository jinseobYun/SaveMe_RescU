import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/members/LoginPage";
import MainPage from "../pages/MainPage";
import WebRTC from "../pages/WebRTC";
import Map from "../pages/MapPage";
import AdminPage from "../pages/AdminPage";
import MyPage from "../pages/members/MyPage";
import FirstInfo from "../components/webRTC/FirstInfo";
import SecondInfo from "../components/webRTC/SecondInfo";
import PrivateRoute from "./PrivateRoute";

const root = createBrowserRouter([
  {
    path: "",
    element: <LoginPage />,
  },
  {
    path: "/main",
    element: (
      <PrivateRoute>
        <MainPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/webrtc",
    element: (
      <PrivateRoute>
        <WebRTC />
      </PrivateRoute>
    ),
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
    element: (
      <PrivateRoute>
        <Map />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/mypage",
    element: (
      <PrivateRoute>
        <MyPage />
      </PrivateRoute>
    ),
  },
],
{
  basename: "/rescu/",
}
);

export default root;
