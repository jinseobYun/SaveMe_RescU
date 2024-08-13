import React from "react";
import styled, { css } from "styled-components";

const Button = ({
  $text = false,
  _onClick = () => {},
  children = null,
  $margin = false,
  $width = "100%",
  $height = "",
  $padding = "10px 24px",
  $bg = { default: "#2D4059", hover: "var(bg-baige-color)" },
  $color = "var(--black-color-100)",
  $disabled = false,
  $border="none",
  // $border = "1px solid var(--black-color-300)",
  $size = "30px",
  $bold = false,
  $radius = "10px",
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
  };
  return (
    <BasicButton {...styles} onClick={_onClick} disabled={$disabled}>
      {$text ? $text : children}
    </BasicButton>
  );
};

const BasicButton = styled.button`
  box-sizing: border-box;
  line-height: 120%;
  min-height: 9rem;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
  background-color: ${(props) => props.$bg.default};
  color: ${(props) => props.$color};
  padding: ${(props) => props.$padding};
  border: ${(props) => props.$border};
  border-radius: ${(props) => props.$radius};
  box-sizing: border-box;
  font-size: ${(props) => props.$size};
  display:flex;
  align-items: center;
  justify-content:center;
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
    background-color: #ddd;
    border: 1px solid #ddd;
  }
  &:hover {
    background-color: ${(props) => props.$bg.hover};
    color:var(--white-color-100)
    cursor: pointer;
  }

  &.active {
    background-color: ${(props) => props.$bg.active};
    color:var(--white-color-100)
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
