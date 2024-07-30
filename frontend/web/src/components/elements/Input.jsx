import React, { useState, useRef, Component } from "react";
import styled from "styled-components";
import Text from "./Text";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Input = ({
  type = "text",
  placeholder = "",
  name = "",
  value = "",
  setValue = () => {},
  maxLen = 20,
  disabled = false,
  regexCheck = "",
  _onBlur = () => {},
  _onChange = () => {},
  label = "",
  required = false,
  successMessage = "유효한 값입니다",
  errorMessage = "유효한 값을 입력해주세요",
  defaultMessage = "",
  showClearButton = false,
}) => {
  const [isError, setIsError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onChange = (e) => {
    setValue(e.target.value);
    _onChange(e);
  };
  const onBlur = (e) => {
    _onBlur(e);
    //최대값이 지정되어있으면 value를 저장하지 않는다.
    if (maxLen && maxLen < e.target.value.length) {
      e.target.value = e.target.value.slice(0, maxLen);
    }
    setValue(e.target.value);

    //공백인 경우 defaultMessage로 바꾼다.
    if (required && e.target.value === "") {
      setIsError(true);
      ref.current.focus();
      return setHelperText("필수 값입니다");
    } else {
      setIsError(false);
      setHelperText(defaultMessage);
    }

    if (regexCheck) {
      // 정규표현식체크가 통과되면 successText를 송출하고 아니면 errorText를 송출한다
      if (regexCheck.test(e.target.value)) {
        setIsError(false);
        // e.target.classList.remove("invalid");
        // e.target.classList.add("valid");
        return setHelperText(successMessage);
      }
      if (!regexCheck.test(e.target.value)) {
        setIsError(true);
        ref.current.focus();
        // e.target.classList.add("invalid");
        setHelperText(errorMessage);
      }
    }
  };

  // 추가
  const clearValue = () => {
    setValue("");
  };
  console.log(value.length, isError);
  return (
    <>
      <InputContainer>
        <Label>
          {label && (
            <Text
              children={label}
              color="var(--label-gray-color)"
              size="12px"
              lineHeight="16px"
            />
          )}
        </Label>
        {/* 수정 InputWrapper*/}
        <InputWrapper>
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
            onChange={onChange}
            ref={ref}
          />
          {/* 추가 */}
          {showClearButton && (
            <ClearButton onClick={clearValue}>X</ClearButton>
          )}
        </InputWrapper>
        {type === "password" && (
          <div className="input_icon" onClick={handleTogglePassword}>
            {zz}
            {/* {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />} */}
          </div>
        )}

        <HelpText>
          <Text
            children={helperText}
            size="12px"
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
  display:flex;
  border: none;
  outline: none;
  color: var(--gray-color-400);
  font-size: 16px;
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

// 임시
const CheckInput = styled.div`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid var(--main-orange-color);
  outline: none;
  color: var(--gray-color-400);
  font-size: 10px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 4px;
  background: var(--white-color-100);
  /* Light / Elevation / 200 */
  box-shadow: 0px 1px 2px 0px rgba(55, 65, 81, 0.08);
  &::placeholder {
    color: var(--gray-color-400);
  }
  &:user-invalid {
    border: 1px solid var(--red-color-100);
    box-shadow: 0px 0px 0px 2px #fde2dd,
      0px 0px 0px 1px var(--red-color-100) inset;
  }
  &:user-valid {
    border: 1px solid var(--green-color-100);
    box-shadow: 0px 0px 0px 2px #cbf4c9,
      0px 0px 0px 1px var(--green-color-100) inset;
  }
`;

const HelpText = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  align-self: stretch;
`;
export default Input;
