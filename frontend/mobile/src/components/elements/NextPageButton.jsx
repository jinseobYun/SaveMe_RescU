import React from "react";
import styled from "styled-components";

import { Button } from "@components/elements";
const NextPageButton = ({
  isError = true,
  text = "다음",
  handleClick = null,
}) => {
  return (
    <ButtonBox>
      <Button
        _onClick={handleClick}
        $display="flex"
        $width="100vw"
        $height="8vh"
        $padding="8px 12px"
        $justify-content="center"
        $align-items="center"
        $bg={{
          disabled: "var(--orange-op50-color)",
          default: "var(--main-orange-color)",
        }}
        $color={{ default: "var(--white-color-100)" }}
        children={text}
        $disabled={isError}
        $size="var(--font-size-medium)"
      />
    </ButtonBox>
  );
};

export default NextPageButton;

const ButtonBox = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  display: block;
`;
