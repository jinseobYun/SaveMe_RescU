import { useState } from "react";
import styled from "styled-components";
import { Grid } from "@components/elements/";
const Toggle = ({
  $toggleOnText = null,
  $toggleOffText = null,
  $toggleWidth = "28",
  $toggleHeight = "18",
  $toggleRadius = "10%",
  $toggleColor = "var(--main-yellow-color)",
  $gridStyle = null,
}) => {
  const [isActive, setIsActive] = useState(false);
  const styles = {
    $toggleOnText,
    $toggleOffText,
    $toggleWidth,
    $toggleHeight,
    $toggleRadius,
    $toggleColor,
  };

  return (
    <>
      <Grid {...$gridStyle}>
        <ToggleContainer
        // 클릭하면 토글이 켜진 상태(isOn)를 boolean 타입으로 변경하는 메소드가 실행
        >
          <ToggleSwitch>
            <CheckBox
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </ToggleContainer>
        <Desc>{isActive ? $toggleOnText : $toggleOffText}</Desc>
      </Grid>
    </>
  );
};
export default Toggle;
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 47.7px;
  height: 23.33px;
`;
const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-color-100);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 4px;
    bottom: 4px;
    background-color: var(--white-color-100);
    border: 1px solid var(--gray-color-100);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${ToggleSlider} {
    background-color: var(--main-yellow-color);
  }

  &:focus + ${ToggleSlider} {
    box-shadow: 0 0 1px var(--black-color-200);
  }

  &:checked + ${ToggleSlider}:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;
const ToggleContainer = styled.div`
  position: relative;
  margin-top: 8rem;
  left: 47%;
  cursor: pointer;
`;

const Desc = styled.div`
  //설명 부분의 CSS를 구현
  text-align: center;
  margin: 20px;
`;
