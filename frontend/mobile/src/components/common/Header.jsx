import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import { Grid, Button, Text } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
import { yesorNoAlert } from "@/util/notificationAlert";

const Header = ({ navText, backAlert, goTo }) => {
  const navigate = useNavigate();
  const { clearAllInputs } = useFormInputStore();

  const onClickGoBack = () => {
    goTo
      ? navigate(goTo)
      : backAlert
        ? yesorNoAlert(
            "변경사항이 저장되지 않습니다",
            "취소",
            "뒤로가기",
            (result) => {
              if (result.isDismissed) {
                navigate(-1);
                clearAllInputs();
              }
            }
          )
        : navigate(-1);
  };
  return (
    <>
      <StyledHeader>
        <StyledDiv>
          <Button
            _onClick={onClickGoBack}
            $width="2rem"
            $height="2rem"
            $bg={{ default: "transparent" }}
            children={<ArrowBackIcon fontSize="large" />}
          />
        </StyledDiv>

        <Text $size="2rem" children={navText} $padding="1rem" $lineHeight="" />
      </StyledHeader>
    </>
  );
};

export default Header;
const StyledHeader = styled.div`
  width: 100%;
  height: 10vh;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 35vw;
  display: flex;
  position: relative;
`;
const StyledDiv = styled.div`
  position: absolute;
  left: 1.5rem;
`;
