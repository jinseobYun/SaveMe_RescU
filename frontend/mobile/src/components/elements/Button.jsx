import React from "react";
import styled, { css } from "styled-components";

const Button = ({
  $text = false,
  _onClick = () => {},
  children = null,
  $margin = false,
  $width = "100%",
  $height = "100%",
  $padding = "15px 15px",
  $bg = { default: "var(--button-red-color)" },
  $color = {
    default: "var(--black-color-100)",
  },
  $disabled = false,
  $border = "none",
  $size = "16px",
  $bold = false,
  $radius = "3px",
  $boxShadow = false,
  $transition = "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
  $zIndex = 1,
}) => {
  const styles = {
    $margin,
    $width,
    $height,
    $padding,
    $bg,
    $color,
    $border,
    $size,
    $bold,
    $radius,
    $boxShadow,
    $transition,
    $zIndex,
    $disabled,
  };
  return (
    <BasicButton {...styles} onClick={_onClick} disabled={$disabled}>
      {$text ? $text : children}
    </BasicButton>
  );
};

const BasicButton = styled.button`
  box-sizing: border-box;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
  background-color: ${(props) => props.$bg.default};
  padding: ${(props) => props.$padding};
  border: ${(props) => props.$border};
  border-radius: ${(props) => props.$radius};
  box-sizing: border-box;
  font-size: ${(props) => props.$size};
  color: ${(props) => props.$color.default};
  ${(props) =>
    props.$margin
      ? css`
          margin: ${props.$margin};
        `
      : ""}
  ${(props) => (props.$bold ? "font-weight: 600;" : "")}
    outline: none;
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: ${(props) => props.$bg.disabled || props.$bg.default};
    border: 1px solid #ddd;
    color: ${(props) => props.$color.disabled || props.$color.default};
  }
  &:hover {
    background-color: ${(props) => props.$bg.hover || props.$bg.default};
    color: ${(props) => props.$color.hover || props.$color.default};
    cursor: pointer;
  }
  &:active {
    ${(props) =>
      props.$disabled
        ? css`
            background-color: ${(props) =>
              props.$bg.disabled || props.$bg.default};
            border: 1px solid #ddd;
            color: ${(props) => props.$color.disabled || props.$color.default};
          `
        : css`
            background-color: ${props.$bg.active || props.$bg.default};
            color: ${props.$color.active || props.$color.default};
          `}
}
    ${(props) =>
      props.$boxShadow &&
      css`
        box-shadow: ${props.$boxShadow};
      `}
    ${(props) =>
      props.$transition &&
      css`
        transition: ${props.$transition};
      `}
    z-index: ${(props) => props.$zIndex};
  }
`;

export default Button;
