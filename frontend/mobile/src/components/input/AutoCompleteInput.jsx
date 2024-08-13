import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import debounce from "lodash.debounce";

import useSearchStore from "@/store/useSearchStore";
import { Text } from "@components/elements";

const AutoCompleteInput = ({ $prev, $onChange, $formType }) => {
  const searchResults = useSearchStore((state) => state.searchResults);
  const setSearchResults = useSearchStore((state) => state.setSearchResults);
  const fetchSearchResults = useSearchStore(
    (state) => state.fetchSearchResults
  );
  const clearSearchResults = useSearchStore(
    (state) => state.clearSearchResults
  );
  const [inputValue, setInputValue] = useState($prev || "");
  const [isHaveInputValue, setIsHaveInputValue] = useState(false);
  const [dropDownItemIndex, setDropDownItemIndex] = useState(-1);

  //FIXME - 입력 디바운스
  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchSearchResults(value, $formType);
    }, 500),
    []
  );

  const changeInputValue = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setIsHaveInputValue(true);
    debouncedSearch(newValue);
    $onChange && $onChange();
  };

  const clickDropDownItem = (clickedItem) => {
    setInputValue(clickedItem);
    setIsHaveInputValue(false);
  };

  useEffect(() => {
    if (inputValue === "") {
      clearSearchResults();
      setIsHaveInputValue(false);
    }
  }, [inputValue]);

  return (
    <WholeBox>
      <InputBox $isHaveInputValue={isHaveInputValue}>
        <Input type="text" value={inputValue} onChange={changeInputValue} />
        {/* <DeleteButton onClick={() => setInputValue("")}>&times;</DeleteButton> */}
      </InputBox>
      {/* {error && <p>Error: {error}</p>} */}

      {isHaveInputValue && (
        <DropDownBox>
          {inputValue.length > 0 && searchResults.length === 0 && (
            <DropDownItem>해당하는 단어가 없습니다</DropDownItem>
          )}
          {$formType !== "disease"
            ? searchResults.map(
                ({ medicineId, medicineName }, dropDownIndex) => {
                  console.log(medicineName);
                  return (
                    <DropDownItem
                      key={dropDownIndex}
                      onClick={() => clickDropDownItem(medicineName)}
                      onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                      className={
                        dropDownItemIndex === dropDownIndex ? "selected" : ""
                      }
                    >
                      <Text
                        $size="1.5rem"
                        children={medicineName}
                        $padding="2rem"
                        $lineHeight=""
                      />
                    </DropDownItem>
                  );
                }
              )
            : searchResults.map(({ cdInfoId, cdName }, dropDownIndex) => {
                return (
                  <DropDownItem
                    key={dropDownIndex}
                    onClick={() => clickDropDownItem(cdName)}
                    onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                    className={
                      dropDownItemIndex === dropDownIndex ? "selected" : ""
                    }
                  >
                    <Text
                      $size="1.5rem"
                      children={cdName}
                      $padding="2rem"
                      $lineHeight=""
                    />
                  </DropDownItem>
                );
              })}
        </DropDownBox>
      )}
    </WholeBox>
  );
};

const activeBorderRadius = "10px 10px 0 0";
const inactiveBorderRadius = "10px 10px 10px 10px";

const WholeBox = styled.div`
  padding: 10px;
`;

const InputBox = styled.div`
  height: auto;
  display: flex;
  flex-direction: row;
  padding: 16px;
  box-sizing: border-box;
  outline: none;
  border: 1px solid var(--main-orange-color);

  border-radius: ${(props) =>
    props.$isHaveInputValue ? activeBorderRadius : inactiveBorderRadius};
  z-index: 3;
  &:focus {
    border-bottom: 1px solid var(--main-orange-color);
  }
`;

const Input = styled.input`
  flex: 1 0 0;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 16px;
`;

const DeleteButton = styled.div`
  cursor: pointer;
`;

const DropDownBox = styled.ul`
  display: flex;
  margin: 0 auto;
  padding: 8px 0;
  background-color: white;
  border: 1px solid var(--main-orange-color);
  border-top: none;
  border-radius: 0 0 10px 10px;
  list-style-type: none;
  z-index: 3;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DropDownItem = styled.li`
  padding: 0 20px;
  margin: 1rem;
  &.selected {
    background-color: lightgray;
  }
`;

export default AutoCompleteInput;
