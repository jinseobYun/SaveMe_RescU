import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Grid, Button, Text } from "@components/elements";

const Header = ({ navText }) => {
  const navigate = useNavigate();

  const onClickGoBack = () => {
    navigate(-1);
  };
  return (
    <Grid
      $display="flex"
      $width="100%"
      $height="10vh"
      $flex_direction="row"
      $justify_content="flex-start"
      $align_items="center"
      $gap="35vw"
    >
      <Button
        _onClick={onClickGoBack}
        $width="2rem"
        $height="2rem"
        $padding="0 15px 0 15px "
        $bg={{ default: "transparent" }}
        children={<ArrowBackIcon fontSize="large" />}
      />
      <Text $size="20px" children={navText} />
    </Grid>
  );
};

export default Header;
