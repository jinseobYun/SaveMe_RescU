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
  $bg = "var(bg-baige-color)",
  $color = "var(--black-color-100)",
  $disabled = false,
  $border = "1px solid var(--black-color-300)",
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
  };
  console.log($bg);
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
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  padding: ${(props) => props.$padding};
  border: ${(props) => props.$border};
  border-radius: ${(props) => props.$radius};
  box-sizing: border-box;
  font-size: ${(props) => props.$size};
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
