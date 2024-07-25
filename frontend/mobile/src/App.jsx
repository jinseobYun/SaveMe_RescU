import React, { useState } from "react";
import GlobalStyle from "@/globalStyles.js";
import { Button, Input } from "@components/elements";
function App() {
  const [input, setInput] = useState("");

  return (
    <>
      <GlobalStyle />
      <Input
        placeholder="아이디"
        value={input}
        setValue={setInput}
        successMessage="성공"
        label="아이디*"
      />
    </>
  );
}

export default App;
