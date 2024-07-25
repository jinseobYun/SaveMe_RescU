import React from "react";
import styled from "styled-components";

const Text = (props) => {
  const { title, bold, color, size, children, margin, lineHeight, _onClick } =
    props;

  return <P onClick={_onClick}>{children}</P>;
};

Text.defalutProps = {
  children: null,
  bold: false,
  color: "var(--black-color-300)",
  size: "14px",
  margin: false,
  title: false,
  lineHeight: "16px",
  _onClick: () => {},
};

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) => (props.margin ? `margin:${props.margin};` : "margin:0px")};
  ${(props) => (props.title ? `font-family: "GmarketSansBold";` : "")};
  line-height: ${(props) => props.lineHeight};
`;
export default Text;
