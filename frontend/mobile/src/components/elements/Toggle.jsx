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
      <ToggleWrapper>
        <ToggleContainer>
          <Desc>{isActive ? $toggleOnText : $toggleOffText}</Desc>

          <ToggleSwitch>
            <CheckBox
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </ToggleContainer>
      </ToggleWrapper>
    </>
  );
};
export default Toggle;
const ToggleWrapper = styled.div`
  display: flex;
  width: 84%;
  padding: 8px 19px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 16px;
  border: 1px solid var(--black-color-200);
  background: var(--white-color-200);

  /* Drop Shadow / Normal */
  box-shadow: 0px 4px 0px 0px #000;
`;
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
`;
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 36px;
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
    flex-shrink: 0;
    content: "";
    height: 28px;
    width: 28px;
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
    -webkit-transform: translateX(23px);
    -ms-transform: translateX(23px);
    transform: translateX(23px);
  }
`;
