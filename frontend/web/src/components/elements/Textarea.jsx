import React from "react";
import styled from "styled-components";
import Text from "./Text";

const Textarea = ({
  label,
  value,
  setValue,
  placeholder = "",
  required = false,
  cols = 30,
  rows = 5,
  overflow = "scroll",
  maxWidth = "100%",
  minHeight = "150px",
  maxHeight = "300px",
  maxLength = 500,
}) => {
  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setValue(e.target.value);
    }
  };
  return (
    <TextAreaContainer>
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
      <StyledTextArea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        cols={cols}
        rows={rows}
        style={{
          overflow,
          maxWidth,
          maxHeight,
          minHeight
        }}
      />
      <CharacterCount>
        {value.length}/{maxLength}
      </CharacterCount>
    </TextAreaContainer>
  );
};
const TextAreaContainer = styled.div`
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

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid;
  box-shadow: 0px 1px 2px 0px rgba(55, 65, 81, 0.08);
  color: var(--gray-color-400);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  background: var(--white-color-100);
  resize: none;
  outline: none;

  &::placeholder {
    color: var(--gray-color-400);
  }
`;

const CharacterCount = styled.div`
  align-self: flex-end;
  font-size: 12px;
  color: var(--gray-color-400);
`;

export default Textarea;