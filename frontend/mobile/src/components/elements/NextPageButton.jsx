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
        $height="48px"
        $padding="8px 12px"
        $justify-content="center"
        $align-items="center"
        $bg={{
          disabled: "var(--orange-op50-color)",
          default: "var(--main-orange-color)",
        }}
        $color="var(--white-color-100)"
        children={text}
        $disabled={isError}
      />
    </ButtonBox>
  );
};

export default NextPageButton;

const ButtonBox = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
`;
