import React from "react";
import styled, { css } from "styled-components";

const Text = ({
  children = null,
  bold = false,
  color = "var(--black-color-300)",
  size = "14px",
  margin = false,
  title = false,
  lineHeight = "16px",
  _onClick = () => {},
}) => {
  return (
    <P color={color} onClick={_onClick}>
      {children}
    </P>
  );
};

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) =>
    props.margin
      ? css`
          margin: ${props.margin};
        `
      : "margin:0px"};
  ${(props) =>
    props.title
      ? css`
          font-family: "GmarketSansBold";
        `
      : ""};
  line-height: ${(props) => props.lineHeight};
`;
export default Text;
