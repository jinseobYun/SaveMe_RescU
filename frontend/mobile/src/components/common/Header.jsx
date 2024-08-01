import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Grid, Button, Text } from "@components/elements";

const Header = ({ navText }) => {
  const navigate = useNavigate();

  const onClickGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <StyledDiv>
        <Button
          _onClick={onClickGoBack}
          $width="2rem"
          $height="2rem"
          $bg={{ default: "transparent" }}
          children={<ArrowBackIcon fontSize="large" />}
        />
      </StyledDiv>
      <Grid
        $display="flex"
        $width="100%"
        $height="10vh"
        $flex_direction="row"
        $justify_content="center"
        $align_items="center"
        $gap="35vw"
      >
        <Text $size="2rem" children={navText} $padding="1rem" $lineHeight="" />
      </Grid>
    </>
  );
};

export default Header;

const StyledDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  // width: 100%;
`;
