import React, { useEffect, useState } from "react";
import { Input } from "@components/elements";
const Signup = () => {
  const [input, setInput] = useState("");

  return (
    <>
      <Input
        required={true}
        placeholder="아이디"
        value={input}
        setValue={setInput}
        successMessage="성공"
        label="아이디*"
      />
      <Input
        type="password"
        required={true}
        placeholder="비밀번호"
        value={input}
        setValue={setInput}
        successMessage="성공"
        label="비밀번호*"
      />
    </>
  );
};

export default Signup;
