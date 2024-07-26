import React from "react";
import BasicMenus from "../components/menus/BasicMenus";
import "./BasicLayout.css";

export default function BasicLayout({ children }) {
  return (
    <>
      <container>
        <header>
          <BasicMenus></BasicMenus>
        </header>
        <main>{children}</main>
        <footer></footer>
      </container>
    </>
  );
}
