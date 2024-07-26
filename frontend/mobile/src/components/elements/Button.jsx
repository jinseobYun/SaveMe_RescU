import React from "react";
import styled, { css } from "styled-components";

const Button = ({
  text = false,
  _onClick = () => {},
  children = null,
  margin = false,
  width = "100%",
  padding = "15px 15px",
  bg = { default: "transparent", hover: "transparent", active: "transparent" },
  color = "white",
  disabled = false,
  borderColor = "1px solid var(--black-color-300)",
  size = "16px",
  bold = false,
  radius = "3px",
}) => {
  console.log(bg);
  return (
    <BasicButton onClick={_onClick} disabled={disabled}>
      {text ? text : children}
    </BasicButton>
  );
};

const BasicButton = styled.button`
  box-sizing: border-box;
  width: ${(props) => props.width};
  cursor: pointer;
  background-color: ${(props) => props.bg.default};
  color: ${(props) => props.color};
  padding: ${(props) => props.padding};
  border: ${(props) => props.borderColor};
  border-radius: ${(props) => props.radius};
  box-sizing: border-box;
  font-size: ${(props) => props.size};
  ${(props) =>
    props.margin
      ? css`
          margin: ${props.margin};
        `
      : ""}
  ${(props) => (props.bold ? "font-weight:600;" : "")}
  outline: none;
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #ddd;
    border: 1px solid #ddd;
  }
  &:hover {
    background-color: ${(props) => props.bg.hover};
    color: ${(props) => props.theme.white};
    cursor: pointer;
  }

  &.active {
    background-color: ${(props) => props.bg.active};
    color: ${(props) => props.theme.white};
  }
`;

export default Button;
