import React from "react";
import styled from "styled-components";

const Grid = ({
  right = false,
  left = false,
  max_width = "100%",
  max_height = "100%",
  radius = "0",
  is_flex = false,
  width = "100%",
  margin = "0",
  padding = "0",
  bg = "transparent",
  children = null,
  center = false,
  _onClick = () => {},
  border_top = "none",
  border_left = "none",
  border_right = "none",
  border_bottom = "none",
  height = "auto",
  wrap = false,
  border = "none",
  flex_direction = "row",
}) => {
  const styles = {
    is_flex,
    width,
    wrap,
    height,
    margin,
    padding,
    bg,
    center,
    right,
    left,
    radius,
    max_width,
    max_height,
    border_top,
    border_left,
    border_right,
    border_bottom,
    border,
    flex_direction,
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
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-sizing: border-box;
  ${(props) => (props.max_width ? `max-width: ${props.max_width};` : "")}
  ${(props) => (props.max_height ? `max-height: ${props.max_height};` : "")}
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
  ${(props) => (props.radius ? `border-radius: ${props.radius};` : "")}
  ${(props) =>
    props.is_flex
      ? `display: flex; align-items: center; justify-content: space-between; `
      : ""}
  ${(props) =>
    props.center
      ? `text-align: center;`
      : props.right
        ? `text-align: right;`
        : ""};
  ${(props) => (props.wrap ? `flex-wrap: wrap;` : "")}
  ${(props) => (props.border ? `border: ${props.border};` : "")}
  ${(props) => (props.border_top ? `border-top: ${props.border_top};` : "")}
  ${(props) => (props.border_left ? `border-left: ${props.border_left};` : "")}
  ${(props) =>
    props.border_right ? `border-right: ${props.border_right};` : ""}
  ${(props) =>
    props.border_bottom ? `border-bottom: ${props.border_bottom};` : ""}
  flex-direction: ${(props) => props.flex_direction};
`;

export default Grid;
