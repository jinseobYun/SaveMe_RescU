import React from "react";
import styled from "styled-components";

const Image = ({
  $src = "",
  $width = "100%",
  $margin = "0",
  $radius = "0%",
  $height = "100%",
}) => {
  const styles = {
    $width: $width,
    $height: $height,
    $margin: $margin,
    $radius: $radius,
    $height: $height,
  };
  return <ImageDefault {...styles} src={$src}></ImageDefault>;
};

const ImageDefault = styled.img`
  top: 0;
  width: ${(props) => props.$width};
  ${(props) => (props.$height ? `height:${props.$height}` : "")};
  box-sizing: border-box;
  margin: ${(props) => props.$margin};
  border-radius: ${(props) => props.$radius};
`;

export default Image;
