import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { Grid, Text, NextPageButton } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
import { reqVerifyCode, checkVerifyCode } from "@/api/userApi";
import { Header } from "@components/common";
import { errorAlert } from "@/util/notificationAlert";
const numOfFields = 6;

const useSSNFields = (setIsVerify) => {
  const [ssnValues, setValue] = useState({
    n1: "",
    n2: "",
    n3: "",
    n4: "",
    n5: "",
    n6: "",
  });

  const handleChange = (e) => {
    const { maxLength, value, name } = e.target;
    const fieldIndex = name.split("-")[1];
    if (!/^\d$/.test(value)) {
      // 숫자가 아니면 입력을 무효화하거나 처리
      e.target.value = ""; // 입력 초기화
      return;
    }
    // 해당 필드의 값을 업데이트
    setValue((prev) => {
      return { ...prev, [`n${fieldIndex}`]: value };
    });

    // 다음 필드로 포커스 이동
    if (value.length >= maxLength && parseInt(fieldIndex, 10) < numOfFields) {
      const nextSibling = document.querySelector(
        `input[name=ssn-${parseInt(fieldIndex, 10) + 1}]`
      );
      if (nextSibling !== null) {
        nextSibling.focus();
      }
    }
  };
  useEffect(() => {
    const code = Object.values(ssnValues).join("");

    if (code.length === numOfFields) {
      setIsVerify(true);
    } else setIsVerify(false);
  }, [ssnValues]);
  const handleKeyDown = (e) => {
    const { name } = e.target;
    const fieldIndex = parseInt(name.split("-")[1], 10);

    if (e.key === "Backspace") {
      setValue((prevValues) => {
        const newValues = { ...prevValues };

        if (newValues[`n${fieldIndex}`] === "") {
          // 현재 필드가 이미 비어있을 때 이전 필드로 이동
          if (fieldIndex > 1) {
            const previousSibling = document.querySelector(
              `input[name=ssn-${fieldIndex - 1}]`
            );
            if (previousSibling !== null) {
              previousSibling.focus();
            }
          }
        } else {
          // 현재 필드의 값을 지움
          newValues[`n${fieldIndex}`] = "";
        }

        return newValues;
      });
    }
  };
  return {
    handleChange,
    ssnValues,
    handleKeyDown,
  };
};

const VerifyCodeForm = () => {
  const { inputs, clearInputs, updateInputs } = useFormInputStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {};

  const [isVerify, setIsVerify] = useState(false);
  const initialTime = 180;
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const { handleChange, ssnValues, handleKeyDown } = useSSNFields(setIsVerify);

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onClickResend = () => {
    reqVerifyCode(
      inputs.phoneNumber,
      (response) => {
        console.log(response);
        if (response.status === 200) {
          setRemainingTime(initialTime);
          //FIXME - 인증코드 저장 없애기
          updateInputs({ temporyCode: response.data.toString() });
        } else {
          console.log(response);
        }
      },
      (error) => {
        console.log(error.toJSON());
      }
    );
  };

  const onClickBtn = (e) => {
    e.preventDefault();
    const code = Object.values(ssnValues).join("");
    const data = {
      phoneNumber: inputs.phoneNumber,
      //FIXME - 인증코드 임시 저장 없애기
      // verifyCode: code,
      verifyCode: inputs.temporyCode + "",
    };
    switch (type) {
      case "findid":
        data.memberName = inputs.memberName;
        break;
      case "findpassword":
        data.memberName = inputs.memberName;
        data.memberId = inputs.memberId;
        break;
    }
    checkVerifyCode(
      type,
      data,
      (response) => {
        if (response.status === 200) {
          switch (type) {
            case "signup":
              navigate("/signup/logininfo");
              updateInputs({ id: "", password: "", passwordConfirm: "" });
              break;
            case "findid":
              clearInputs();
              Swal.fire({
                title: "인증되었습니다. 회원님의 아이디는 ",
                text: `${response.data}입니다`,
                confirmButtonColor: "#FFCC70",
                cancelButtonColor: "#FFFCE3",
                confirmButtonText: "로그인하러 가기",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/login");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  navigate("/");
                }
              });
              break;
            case "findpassword":
              navigate("/changepassword?form=find");
              break;
          }
        }
      },
      (error) => {
        errorAlert(error.response.data);
      }
    );
  };

  return (
    <>
      <FormWrapper>
        <Header navText="" />
        <Grid
          $display="flex"
          $width="360px"
          $height="400px"
          $padding="100px 4px"
          $flex_direction="column"
          $align_items="center"
          $justify_conents="flex-start"
          $gap="14px"
        >
          <Text
            $color="var(--gray-color-300)"
            children="인증 번호 6자리 숫자를 입력해 주세요."
          />
          <Grid
            $display="flex"
            $flex_direction="row"
            $align_items="center"
            $justify_content="center"
            $gap="1.3rem"
          >
            {Array.from({ length: numOfFields }, (_, index) => (
              <StyledInput
                key={index}
                autoFocus={index === 0}
                maxLength="1"
                onChange={handleChange}
                // type="number"
                name={`ssn-${index + 1}`}
                inputMode="numeric"
                autoComplete="off"
                onKeyDown={handleKeyDown}
                disabled={index > 1 && !ssnValues[`n${index - 1}`]}
              />
            ))}
          </Grid>
          <Text
            $color="var(--gray-color-300)"
            children={formatTime(remainingTime)}
            $lineHeight="150%"
          />
          <Grid
            $display="flex"
            $flex_direction="row"
            $align_items="center"
            $justify_content="center"
            $gap="5px"
          >
            <Text
              $color="var(--gray-color-300)"
              children="문자가 오지 않았나요?."
              $lineHeight="150%"
            />
            <div onClick={onClickResend}>
              <Text
                $color="var(--gray-color-400)"
                children="재전송하기"
                $size="1.1rem"
                $lineHeight="150%"
              />
            </div>
          </Grid>
        </Grid>
        <NextPageButton
          isError={!isVerify}
          text="인증하기"
          handleClick={onClickBtn}
        />
      </FormWrapper>
    </>
  );
};

export default VerifyCodeForm;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  width: 30px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 12px;
  outline: none;
  color: var(--black-color-200);
  font-size: 2rem;
  font-weight: 500;
  border: 1px solid var(--main-yellow-color);
  &:focus {
    border: 2px solid var(--main-orange-color);
  }
  opacity: 50%;
  background: var(--main-basic-color, #fffce3);
  text-align: center;
`;
