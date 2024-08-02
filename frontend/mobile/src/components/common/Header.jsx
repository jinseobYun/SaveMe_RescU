import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import { Grid, Button, Text } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
const Header = ({ navText, backAlert }) => {
  const navigate = useNavigate();
  const { clearInputs } = useFormInputStore();
  const onClickGoBack = () => {
    backAlert
      ? Swal.fire({
          title: "변경사항이 저장되지 않습니다",
          text: "뒤로 가시겠습니까?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "취소",
          cancelButtonText: "뒤로가기",
        }).then((result) => {
          if (result.isDismissed) {
            navigate(-1);
            clearInputs();
          }
        })
      : navigate(-1);
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
