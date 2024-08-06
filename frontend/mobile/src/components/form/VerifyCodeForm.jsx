import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { Grid, Text, NextPageButton } from "@components/elements";
import useFormInputStore from "@/store/useFormInputStore";
import { reqVerifyCode, checkVerifyCode } from "@/api/userApi";
import { Header } from "@components/common";

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
    setValue((prevValues) => ({
      ...prevValues,
      [`n${fieldIndex}`]: value,
    }));

    // 다음 필드로 포커스 이동
    if (value.length >= maxLength && parseInt(fieldIndex, 10) < numOfFields) {
      const nextSibling = document.querySelector(
        `input[name=ssn-${parseInt(fieldIndex, 10) + 1}]`
      );
      if (nextSibling !== null) {
        nextSibling.focus();
      }
    }

    // 모든 필드가 채워지면 검증 코드를 호출
    const allValues = { ...ssnValues, [`n${fieldIndex}`]: value };
    const code = Object.values(allValues).join("");
    if (code.length === numOfFields) {
      setIsVerify(true);
    }
  };

  return {
    handleChange,
    ssnValues,
  };
};

const VerifyCodeForm = () => {
  const { inputs, clearInputs } = useFormInputStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {};

  const [isVerify, setIsVerify] = useState(false);
  const initialTime = 180;
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const { handleChange, ssnValues } = useSSNFields(setIsVerify);

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
      { phoneNumber: inputs.phoneNumber },
      ({ data }) => {},
      (error) => {}
    );
    setRemainingTime(initialTime);
  };

  const onClickBtn = () => {
    // clearInputs();
    const data = {
      phoneNumber: inputs.phoneNumber,
      verifyCode: ssnValues,
    };
    switch (type) {
      case "findid":
        data.memberName = inputs.name;
        break;
      case "findpassword":
        data.memberId = inputs.id;
        break;
    }
    //TODO - api 연결
    checkVerifyCode(
      data,
      ({ data }) => {
        if (data.status === "200") {
          switch (type) {
            case "signup":
              navigate("/signup/logininfo");
              break;
            case "findid":
              clearInputs();
              Swal.fire({
                title: "인증되었습니다. 회원님의 아이디는 ",
                text: `${data.memberName}입니다`,
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
              navigate("/changepassword");
              break;
          }
        } else if (data.status === "400") {
          Swal.fire({
            title: "인증번호가 일치하지 않습니다.",
            text: "다시 입력해주세요.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
        // else if (data.status === "404") {
        //   Swal.fire({
        //     title: "인증번호가 일치하지 않습니다.",
        //     text: "다시 입력해주세요.",
        //     icon: "error",
        //     confirmButtonText: "확인",
        //   });
        // }
      },
      (error) => {
        console.log(error);
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
                maxLength={1}
                onChange={handleChange}
                // type="number"
                name={`ssn-${index + 1}`}
                inputMode="numeric"
                autoComplete={false}
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
          text="다음"
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