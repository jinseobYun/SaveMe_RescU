import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

if (import.meta.env.MODE === "production") {
  // production에서만 사용할 수 없도록
  console = window.console || {};
  console.log = function no_console() {}; // console log 막기
  console.warn = function no_console() {}; // console warning 막기
  console.error = function () {}; // console error 막기
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
