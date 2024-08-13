import React from "react";
import styled from "styled-components";
import Text from "./Text";

const Radio = ({ name, options, selectedValue, setSelectedValue, label }) => {
  return (
    <RadioContainer>
      {label && (
        <Label>
          <Text
            children={label}
            color="var(--label-gray-color)"
            size="20px"
            lineHeight="16px"
          />
        </Label>
      )}
      <RadioWrapper>
        {options.map((option) => (
          <RadioLabel key={option}>
            <RadioInput
              type="radio"
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            {option}
          </RadioLabel>
        ))}
      </RadioWrapper>
    </RadioContainer>
  );
};

const RadioContainer = styled.div`
  width:95%
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const RadioWrapper = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px rgba(55, 65, 81, 0.08);
  background: var(--white-color-100);
`;

const RadioLabel = styled.label`
  width: 95%;
  min-height: 5rem;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 24px;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

export default Radio;
