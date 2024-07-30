import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Grid, Button, Text } from "@components/elements";

const Header = () => {
  const navigate = useNavigate();

  const [navText, setNavText] = useState("");
  const onClickGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {}, []);
  return (
    <Grid
      $display="flex"
      $width="100%"
      $height="10vh"
      flex_direction="column"
      justify_content="center"
    >
      <Button
        _onClick={onClickGoBack}
        $width="3rem"
        $height="3rem"
        $bg={{ default: "transparent" }}
        children={<ArrowBackIcon fontSize="large" />}
      />
      <Text $size="20px" />
      {navText}
    </Grid>
  );
};

export default Header;
