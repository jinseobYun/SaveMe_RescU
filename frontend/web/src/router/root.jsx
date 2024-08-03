import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/members/LoginPage";
import MainPage from "../pages/MainPage";
import WebRTC from "../pages/WebRTC";
import Map from "../pages/MapPage";
import AdminPage from "../pages/AdminPage";
import MyPage from "../pages/members/MyPage";

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
  basename: "/web/",
}
);

export default root;
