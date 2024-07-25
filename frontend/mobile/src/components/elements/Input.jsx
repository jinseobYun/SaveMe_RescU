import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Text } from "@components/elements";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Input = (props) => {
  const {
    type,
    placeholder,
    name,
    value,
    disabled,
    invalid,
    _onChange,
    _onBlur,
    label,
    required,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div>
        {label && <Text children={label} />}
        <div>
          <BasicInput
            value={value}
            disabled={disabled}
            type={showPassword ? "text" : type}
            placeholder={placeholder}
            name={name}
            onChange={_onChange}
            required={required}
            onBlur={_onBlur}
          />
          {type === "password" && (
            <div className="input_icon" onClick={handleTogglePassword}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
Input.defaultProps = {
  type: "text",
  placeholder: "",
  name: "",
  value: "",
  disabled: false,
  invalid: false,
  defaultValue: "",
  _onChange: () => {},
  _onBlur: () => {},
  label: "",
  required: false,
};

const BasicInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
`;
export default Input;
