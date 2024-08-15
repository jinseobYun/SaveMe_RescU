import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { Grid, Text, Input, NextPageButton } from "@components/elements";
import useForm from "@/hooks/useForm";
import { updateUserPwd } from "@/api/userApi";
import useFormInputStore from "@/store/useFormInputStore";
import { ChangePwValidation } from "@/util/validation";
import { errorAlert, successAlert } from "@/util/notificationAlert";
import axios from "axios";

const ChangePwPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType = searchParams.get("form");
  const { clearInputs, inputs, updateInputs } = useFormInputStore();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      newPassword: "",
      newPasswordConfirm: "",
      currentPassword: "",
    },
    onSubmit: (values) => {
      //FIXME - 인증번호 저장 삭제 후 밑의 data로 변경
      let data = {
        newPassword: values.newPassword,
        newPasswordConfirm: values.newPasswordConfirm,
      };
      // const data = {
      //   ...inputs,
      //   newPassword: values.newPassword,
      //   newPasswordConfirm: values.newPasswordConfirm,
      // };
      if (formType === "update") {
        data.currentPassword = values.currentPassword;
      } else {
        data = {
          ...data,
          phoneNumber: inputs.phoneNumber,
          memberId: inputs.memberId,
          memberName: inputs.memberName,
          verifyCode: inputs.temporyCode,
        };
      }
      updateUserPwd(
        formType,
        data,
        (response) => {
          console.log(JSON.stringify(response));
          if (response.status === 200) {
            clearInputs();
            successAlert("변경되었습니다", () => {
              navigate("/", { replace: true });
            });
          }
        },
        (error) => {
          errorAlert(error.response.data);
        }
      );
    },
    validate: ChangePwValidation,
  });

  const [isTextOnce, setIsTextOnce] = useState(false);
  useEffect(() => {
    if (isTextOnce != (Object.keys(errors).length !== 0)) setIsTextOnce(true);
  }, [errors]);
  return (
    <>
      <Grid
        $display="flex"
        $width="100vw"
        $padding="100px 4px"
        $flex_direction="column"
        $align_items="center"
        $gap="2rem"
      >
        <TextBox>
          <Text
            children="새 비밀번호를 입력해주세요"
            $color="var(--gray-color-300)"
          />
        </TextBox>
        <StyledForm onSubmit={handleSubmit} noValidate>
          {formType === "update" && (
            <Input
              $name="currentPassword"
              $value={values.currentPassword}
              _onChange={handleChange}
              $label="기존 비밀번호*"
              $haveToCheckValid={false}
              $type="password"
            />
          )}
          <Input
            $name="newPassword"
            $placeholder="영대소문, 숫자를 포함한 8~20자"
            $value={values.newPassword}
            _onChange={handleChange}
            $label="새 비밀번호*"
            $haveToCheckValid={true}
            $type="password"
            $errorMessage={errors.newPassword}
            $isValid={errors.newPassword && false}
          />
          <Input
            $name="newPasswordConfirm"
            $placeholder="새 비밀번호를 다시 입력해주세요"
            $value={values.newPasswordConfirm}
            _onChange={handleChange}
            $label="새 비밀번호 확인*"
            $haveToCheckValid={true}
            $errorMessage={errors.newPasswordConfirm}
            $isValid={errors.newPasswordConfirm && false}
            $type="password"
          />
        </StyledForm>
      </Grid>
      <NextPageButton
        isError={isTextOnce != (Object.keys(errors).length === 0)}
        text="변경하기"
        handleClick={handleSubmit}
        $color={{ default: "var(--white-color-100)" }}
      />
    </>
  );
};

export default ChangePwPage;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 1rem;
`;
