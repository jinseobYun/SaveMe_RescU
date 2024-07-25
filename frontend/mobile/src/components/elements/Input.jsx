import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Text } from "@components/elements";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Input = ({
  type = "text",
  placeholder = "",
  name = "",
  value = "",
  setValue,
  maxValue,
  disabled = false,
  regexCheck,
  _onBlur = () => {},
  label = "",
  required = false,
  successMessage,
  errorMessage,
  defaultMessage,
}) => {
  const [isError, setIsError] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOnChange = (e) => {
    //최대값이 지정되어있으면 value를 저장하지 않는다.
    if (maxValue && maxValue < e.target.value.length) return;

    setValue(e.target.value);

    //공백인 경우 defaultText로 바꾼다.
    if (e.target.value === "") {
      setIsError(true);
      return setHelperText(defaultText);
    }

    if (regexCheck) {
      // 정규표현식체크가 통과되면 successText를 송출하고 아니면 errorText를 송출한다
      if (regexCheck.test(e.target.value)) {
        setIsError(false);
        console.log(helperText);
        return setHelperText(successText);
      }
      if (!regexCheck.test(e.target.value)) {
        setIsError(true);
        setHelperText(errorText);
      }
    }
  };

  return (
    <>
      <InputContainer>
        <Label>
          {label && (
            <Text
              children={label}
              color="var(--label-gray-color"
              size="12px"
              lineHeight="16px"
            />
          )}
        </Label>
        <InputWrapper>
          <BasicInput
            value={value}
            disabled={disabled}
            type={showPassword ? "text" : type}
            placeholder={placeholder}
            name={name}
            onChange={handleOnChange}
            required={required}
            onBlur={_onBlur}
          />
          {type === "password" && (
            <div className="input_icon" onClick={handleTogglePassword}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          )}
        </InputWrapper>
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
Input.defaultProps = {
  type: "text",
  placeholder: "",
  name: "",
  value: "",
  disabled: false,
  _onChange: () => {},
  _onBlur: () => {},
  label: "",
  required: false,
};
const InputContainer = styled.div`
  display: flex;
  width: 200px;
  height: 80px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;
const Label = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;
const InputWrapper = styled.div`
  // display: flex;
  // height: 40px;
  // padding: 8px;
  // flex-direction: column;
  // justify-content: center;
  // align-items: flex-start;
  // gap: 10px;
  // align-self: stretch;
`;
const BasicInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  color: var(--gray-color-400);
  font-size: 10px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 4px;
  border: 1px solid var(--main-orange-color);
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
  gap: 4px;
  align-self: stretch;
`;
export default Input;
