import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Text from "./Text";

const Select = ({ label, options, selectedValue, setSelectedValue }) => {

  const handleChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const value = e.target.value;
    setSelectedValue(value, selectedIndex);
  };

  return (
    <SelectContainer>
      {label && (
        <Label>
          <Text
            children={label}
            color="var(--label-gray-color)"
            size="12px"
            lineHeight="16px"
          />
        </Label>
      )}
      <SelectWrapper>
        <StyledSelect
          value={selectedValue}
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </StyledSelect>
      </SelectWrapper>
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;

const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const SelectWrapper = styled.div`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px rgba(55, 65, 81, 0.08);
  background: var(--white-color-100);
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  color: var(--gray-color-400);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  background: var(--white-color-100);
  appearance: none; /* Remove default arrow */
  background-image: url('data:image/svg+xml;utf8,<svg fill="black" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>'); /* Custom arrow */
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 50%;
`;

export default Select;