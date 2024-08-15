import { RouterProvider } from "react-router-dom";
import "./App.css";
import root from "./router/root";
import GlobalStyles from "./globalStyles";

function App() {
  return (
    <>
      <GlobalStyles/>
      <RouterProvider router={root} />
    </>
  );
}

export default App;
