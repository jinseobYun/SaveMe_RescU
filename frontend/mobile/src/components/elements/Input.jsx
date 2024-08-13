import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Text } from "@components/elements";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Input = ({
  $type = "text",
  $placeholder = "",
  $name = "",
  $value = "",
  $disabled = false,
  _onBlur = () => {},
  _onChange = () => {},
  $label = "",
  $required = false,
  $successMessage = "유효한 값입니다",
  $errorMessage = "",
  $defaultMessage = "",
  $haveToCheckValid = false,
  $isValid = true,
  $maxLen = 20,
  $icon = null,
  $width = "55vw",
  $height = "80px",
}) => {
  const [helperText, setHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputState, setInputState] = useState("default");
  const [value, setValue] = useState($value);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onChangeInput = (e) => {
    setValue(e.target.value);
    _onChange(e);
  };
  useEffect(() => {
    setInputState("default");
    if (!$haveToCheckValid) setInputState("default");
    if (value == "") setInputState("default");
    else if ($isValid) {
      setHelperText($successMessage);
      setInputState("valid");
    } else {
      setInputState("invalid");
      setHelperText($errorMessage);
    }
  }, [$isValid, value]);

  return (
    <>
      <InputContainer $width={$width} $height={$height}>
        <Label>
          {$label && (
            <Text
              children={$label}
              $color="var(--label-gray-color)"
              $size="12px"
              $lineHeight="16px"
            />
          )}
        </Label>
        <InputWrapper
          $haveToCheckValid={$haveToCheckValid}
          $inputState={inputState}
        >
          <BasicInput
            defaultValue={$value}
            disabled={$disabled}
            required={$required}
            type={showPassword ? "text" : $type}
            inputMode={$type === "tel" ? "numeric" : undefined}
            pattern={$type === "tel" ? "[0-9]{3}-[0-9]{3}-[0-9]{4}" : undefined}
            placeholder={$placeholder}
            name={$name}
            onBlur={_onBlur}
            onChange={onChangeInput}
            maxLength={$maxLen}
            // autoComplete="off"
          />
          {$type === "password" && (
            <div className="input_icon" onClick={handleTogglePassword}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          )}
          {$icon && <div>{$icon}</div>}
        </InputWrapper>
        {inputState === "invalid" && (
          <HelpText>
            <Text
              children={helperText}
              $size="12px"
              $color={"var(--red-color-100)"}
            />
          </HelpText>
        )}
      </InputContainer>
    </>
  );
};
const InputContainer = styled.div`
  display: flex;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;
const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;
const InputWrapper = styled.div`
  display: flex;
  padding: 8px;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid var(--main-orange-color);
  outline: none;
  ${(props) =>
    props.$inputState === "valid" &&
    props.$haveToCheckValid &&
    `
          border: 1px solid var(--green-color-100);
          box-shadow:
            0px 0px 0px 2px #cbf4c9,
            0px 0px 0px 1px var(--green-color-100) inset;
        `}
  ${(props) =>
    props.$inputState === "invalid" &&
    props.$haveToCheckValid &&
    `
          border: 1px solid var(--red-color-100);
          box-shadow:
            0px 0px 0px 2px #fde2dd,
            0px 0px 0px 1px var(--red-color-100) inset;
        `};
  ${(props) =>
    props.$inputState === "default" &&
    `  border: 1px solid var(--main-orange-color);
        `};
`;
const BasicInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  color: var(--black-color-200);
  font-size: 1.5rem;
  font-weight: 500;
  &::placeholder {
    color: var(--label-gray-color);
    font-size: 1rem;
  }
`;
const HelpText = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`;
export default Input;
