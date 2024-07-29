import React from "react";
import styled from "styled-components";

const Grid = ({
  $right = false,
  $left = false,
  $max_width = "100%",
  $max_height = "100%",
  $radius = false,
  $height = "auto",
  $width = "100%",
  $margin = false,
  $padding = false,
  $bg = "transparent",
  $center = false,
  children = null,
  _onClick = () => {},
  $border_top = "none",
  $border_left = "none",
  $border_right = "none",
  $border_bottom = "none",
  $wrap = false,
  $border = "none",
  $display = false,
  $flex_direction = "row",
  $justify_content = "space-between",
  $align_items = "center",
}) => {
  const styles = {
    $display: $display,
    $width: $width,
    $wrap: $wrap,
    $height: $height,
    $margin: $margin,
    $padding: $padding,
    $bg: $bg,
    $center: $center,
    $right: $right,
    $left: $left,
    $radius: $radius,
    $max_width: $max_width,
    $max_height: $max_height,
    $border_top: $border_top,
    $border_left: $border_left,
    $border_right: $border_right,
    $border_bottom: $border_bottom,
    $border: $border,
    $flex_direction: $flex_direction,
    $justify_content: $justify_content,
    $align_items: $align_items,
  };

  return (
    <React.Fragment>
      <GridBox {...styles} onClick={_onClick}>
        {children}
      </GridBox>
    </React.Fragment>
  );
};

const GridBox = styled.div`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  box-sizing: border-box;
  ${(props) => (props.$max_width ? `max-width: ${props.$max_width};` : "")}
  ${(props) => (props.$max_height ? `max-height: ${props.$max_height};` : "")}
  ${(props) => (props.$padding ? `padding: ${props.$padding};` : "")}
  ${(props) => (props.$margin ? `margin: ${props.$margin};` : "")}
  ${(props) => (props.$bg ? `background-color: ${props.$bg};` : "")}
  ${(props) => (props.$radius ? `border-radius: ${props.$radius};` : "")}
  ${(props) => (props.$display ? `display: ${props.$display};` : "")}

  ${(props) =>
    props.$align_items ? ` align-items:${props.$align_items};` : ""}
  ${(props) =>
    props.$justify_content ? ` justify-content:${props.$justify_content};` : ""}
  ${(props) =>
    props.$center
      ? `text-align: center;`
      : props.$right
      ? `text-align: right;`
      : ""};
  ${(props) => (props.$wrap ? `flex-wrap: wrap;` : "")}
  ${(props) => (props.$border ? `border: ${props.$border};` : "")}
  ${(props) => (props.$border_top ? `border-top: ${props.$border_top};` : "")}
  ${(props) =>
    props.$border_left ? `border-left: ${props.$border_left};` : ""}
  ${(props) =>
    props.$border_right ? `border-right: ${props.$border_right};` : ""}
  ${(props) =>
    props.$border_bottom ? `border-bottom: ${props.$border_bottom};` : ""}
  flex-direction: ${(props) => props.$flex_direction};
`;

export default Grid;
