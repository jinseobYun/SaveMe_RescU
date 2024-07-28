import React, { useEffect, useState } from "react";
import { Input } from "@components/elements";
const Login = () => {
  const [input, setInput] = useState("");

  return (
    <div>
      <Input
        required={true}
        placeholder="아이디"
        value={input}
        setValue={setInput}
        label="아이디*"
      />
    </div>
  );
};

export default Login;
