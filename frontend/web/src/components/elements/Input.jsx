import React, { useState, useRef } from "react";
import styled from "styled-components";
import Text from "./Text";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Input = ({
  type = "text",
  placeholder = "",
  name = "",
  value = "",
  onChange = () => {},
  // setValue = () => {},
  maxLen = 20,
  disabled = false,
  regexCheck = "",
  _onBlur = () => {},
  // _onChange = () => {},
  label = "",
  required = false,
  successMessage = "유효한 값입니다",
  errorMessage = "유효한 값을 입력해주세요",
  defaultMessage = "",
  showClearButton = false,
  isError = false,
  onKeyDown = () => {},
}) => {
  const [helperText, setHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // 추가
  const handleChange = (e) => {
    onChange(e);
  };

  const onBlur = (e) => {
    _onBlur(e);
    //최대값이 지정되어있으면 value를 저장하지 않는다.
    if (maxLen && maxLen < e.target.value.length) {
      e.target.value = e.target.value.slice(0, maxLen);
    }

    //공백인 경우 defaultMessage로 바꾼다.
    if (required && e.target.value === "") {
      ref.current.focus();
      setHelperText("필수 값입니다");
    } else {
      setHelperText(defaultMessage);
    }

    if (regexCheck) {
      // 정규표현식체크가 통과되면 successText를 송출하고 아니면 errorText를 송출한다
      if (regexCheck.test(e.target.value)) {
        setHelperText(successMessage);
      }
      if (!regexCheck.test(e.target.value)) {
        ref.current.focus();
        setHelperText(errorMessage);
      }
    }
  };

  // 추가
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
            onBlur={onBlur}
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
};
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

  // 색 확인하기 -------------------------------------
  border: 1px solid;
  // var(--gray-color-400);
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
  background: var(--white-color-100);
  /* Light / Elevation / 200 */

  &::placeholder {
    color: var(--gray-color-400);
  }
`;

// ClearButton
const ClearButton = styled.button`
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
  // color: #ff0000;
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
