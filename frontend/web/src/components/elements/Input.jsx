import React, { useState, useRef, forwardRef  } from "react";
import styled from "styled-components";
import Text from "./Text";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Input = forwardRef(({
  type = "text",
  placeholder = "",
  name = "",
  value = "",
  onChange = () => {},
  disabled = false,
  label = "",
  required = false,
  showClearButton = false,
  isError = false,
  onKeyDown = () => {},
}, ref) => {
  const [helperText, setHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const ref = useRef();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // 추가
  const handleChange = (e) => {
    onChange(e);
  };


  const clearValue = () => {
    onChange({ target: { name, value: "" } });
  };
  return (
    <>
      <InputContainer>
        <Label>
          {label && (
            <Text
              children={label}
              color="var(--label-gray-color)"
              size="20px"
              lineHeight="16px"
            />
          )}
        </Label>
        <InputWrapper isError={isError}>
          <BasicInput
            value={value}
            disabled={disabled}
            type={showPassword ? "text" : type}
            inputMode={type === "number" ? "numeric" : undefined}
            pattern={type === "number" ? "[0-9]*" : undefined}
            placeholder={placeholder}
            name={name}
            required={required}
            onChange={handleChange}
            ref={ref}
            onKeyDown={(e) => onKeyDown(e)}
          />
          {type === "password" ? (
            <TogglePasswordButton onClick={handleTogglePassword}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </TogglePasswordButton>
          ) : (
            showClearButton && <ClearButton onClick={clearValue}>X</ClearButton>
          )}
        </InputWrapper>

        <HelpText>
          <Text
            children={helperText}
            size="16px"
            color={
              isError
                ? "var(--red-color-100)"
                : value && "var(--green-color-100)"
            }
          />
        </HelpText>
      </InputContainer>
    </>
  );
});
const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;
const Label = styled.div`
  width:100%
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const InputWrapper = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  box-sizing: border-box;
  font-size:12px;
  position: relative;

  // 색 확인하기 -------------------------------------
  border: 1px solid;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px rgba(55, 65, 81, 0.08);
  color: var(--gray-color-400);
  background: var(--white-color-100);
`;
const BasicInput = styled.input`
  width: 100%;
  min-height: 5rem;
  font-size: 24px;
  display: flex;
  border: none;
  outline: none;
  color: var(--gray-color-400);
  font-weight: 500;
  line-height: 24px;
  /* Light / Elevation / 200 */
  background-color:white;
  &::placeholder {
    color: var(--gray-color-400);
  }
`;

// ClearButton
const ClearButton = styled.button`
  display: flex;
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  font-size:2rem;
  color: var(--gray-color-400);
  right: 0.5rem;
  top: 50%; transform: translateY(-50%)
`;

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;


const HelpText = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  align-self: stretch;
`;
export default Input;
