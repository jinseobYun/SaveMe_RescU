import React from "react";
import BasicMenus from "../components/menus/BasicMenus";
import AdminMenus from "../components/menus/AdminMenus";
import { useLocation } from "react-router-dom";
import "./BasicLayout.css";

export default function BasicLayout({ children }) {
  const location = useLocation();
  const admin = location.pathname.startsWith("/admin");
  return (
    <>
      <container>
        <header>
          {admin ? <AdminMenus/> : <BasicMenus/>}
        </header>
        <main>{children}</main>
        <footer></footer>
      </container>
    </>
  );
}
