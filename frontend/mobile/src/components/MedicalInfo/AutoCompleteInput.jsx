import React, { useEffect, useState } from "react";
import styled from "styled-components";
import debounce from "lodash.debounce";

import useSearchStore from "@/store/useSearchStore";

const wholeTextArray = [
  {
    id: 1,
    name: "고혈압",
  },
  {
    id: 2,
    name: "당뇨병",
  },
  {
    id: 3,
    name: "천식",
  },
];

const AutoCompleteInput = ({ $prev, $onChange }) => {
  const { searchResults, fetchSearchResults, isLoading, error } =
    useSearchStore();

  const [inputValue, setInputValue] = useState($prev || "");
  const [isHaveInputValue, setIsHaveInputValue] = useState(false);
  const [dropDownList, setDropDownList] = useState(wholeTextArray);
  const [dropDownItemIndex, setDropDownItemIndex] = useState(-1);
  const [prevFirstChar, setPrevFirstChar] = useState("");

  const showDropDownList = () => {
    if (inputValue === "") {
      setIsHaveInputValue(false);
      setDropDownList([]);
    } else {
      const choosenTextList = searchResults.filter((textItem) =>
        // textItem.name.includes(inputValue)
        textItem.name.startsWith(inputValue)
      );
      setDropDownList(choosenTextList);
    }
  };
  const debouncedSearch = debounce(() => {
    showDropDownList();
  }, 300); // 300ms 디바운싱

  const changeInputValue = (event) => {
    const newValue = event.target.value;

    setInputValue(newValue);
    setIsHaveInputValue(true);
    $onChange && $onChange();

    //NOTE - 첫 글자가 변경된 경우에만 API 호출
    if (newValue[0] !== prevFirstChar) {
      setPrevFirstChar(newValue[0]);
    }
  };

  const clickDropDownItem = (clickedItem) => {
    setInputValue(clickedItem);
    setIsHaveInputValue(false);
  };

  useEffect(debouncedSearch, [inputValue]);

  useEffect(() => {
    if (prevFirstChar) {
      //TODO - api 연결
      // fetchSearchResults(inputValue);
    }
  }, [prevFirstChar]);

  return (
    <WholeBox>
      <InputBox $isHaveInputValue={isHaveInputValue}>
        <Input type="text" value={inputValue} onChange={changeInputValue} />
        {/* <DeleteButton onClick={() => setInputValue("")}>&times;</DeleteButton> */}
      </InputBox>
      {isHaveInputValue && (
        <DropDownBox>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {dropDownList.length === 0 && (
            <DropDownItem>해당하는 단어가 없습니다</DropDownItem>
          )}
          {dropDownList.map(({ id, name }, dropDownIndex) => {
            return (
              <DropDownItem
                key={dropDownIndex}
                onClick={() => clickDropDownItem(name)}
                onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                className={
                  dropDownItemIndex === dropDownIndex ? "selected" : ""
                }
              >
                {name}
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
  display: block;
  margin: 0 auto;
  padding: 8px 0;
  background-color: white;
  border: 1px solid var(--main-orange-color);
  border-top: none;
  border-radius: 0 0 10px 10px;
  list-style-type: none;
  z-index: 3;
`;

const DropDownItem = styled.li`
  padding: 0 15px;
  margin: 0.5rem;
  &.selected {
    background-color: lightgray;
  }
`;

export default AutoCompleteInput;
