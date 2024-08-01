import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { Header, TabBar } from "@components/common";
import {
  Grid,
  Button,
  Text,
  MainContainer,
  NextPageButton,
} from "@components/elements";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";
import useForm from "@/hooks/useForm";

const MedicalInfoForm = () => {
  const { userName, userMedicalInfo } = useUserStore();

  const { updateInputs, inputs } = useFormInputStore();
  const navigate = useNavigate();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: inputs.name || "",
      birth: inputs.birth || "",
      phoneNumber: inputs.phoneNumber || "",
      gender: inputs.gender || "남성",
    },
    onSubmit: (values) => {
      console.log(values);
      navigate("/medical", { state: { type: "signup" } });
      updateInputs(values);
    },
    validate: null,
  });
  return (
    <MainContainer>
      <Header />
      <Text children={`${userName}님! 신고 시 전달될 정보를 등록해 주세요`} />
      <Form>
        <label>ABO 혈액형</label>
        <select variant="outlined" fullWidth>
          <option>A</option>
          <option>B</option>
          <option>AB</option>
          <option>O</option>
        </select>
        <label>RH 혈액형</label>
        <radio row defaultValue="RH+">
          <label value="RH-" label="RH-" />
          <label value="RH+" label="RH+" />
        </radio>
        <text
          label="기타 특이 사항"
          multiline
          rows={4}
          placeholder="최대 1000자까지 작성 가능합니다"
          variant="outlined"
          fullWidth
        />
      </Form>
      <NextPageButton isError={false} text="다음" handleClick={handleSubmit} />
    </MainContainer>
  );
};

export default MedicalInfoForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
