import React from "react";

import { Grid, Button, Text, Input } from "@components/elements";
import useForm from "@/hooks/useForm";
import { EmergencyContactValidation } from "@/util/validation";

const EmergencyContactInput = ({ $onChange, $prev }) => {
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      relation: $prev.relation || "",
      phoneNumber: $prev.phoneNumber || "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validate: EmergencyContactValidation,
  });
  const onChangeInput = (e) => {
    $onChange && $onChange();
    handleChange(e);
  };
  return (
    <>
      <Input
        $name="relation"
        $placeholder="영문, 한글 20자 이하로 작성해주세요"
        $value={values.relation}
        _onChange={onChangeInput}
        $label="관계*"
        $errorMessage={errors.relation}
        $haveToCheckValid={true}
        $isValid={errors.relation && false}
      />
      <Input
        $name="phoneNumber"
        $placeholder="전화번호"
        $label="전화번호*"
        $type="tel"
        $value={values.phoneNumber}
        _onChange={onChangeInput}
        $errorMessage={errors.phoneNumber}
        $haveToCheckValid={true}
        $isValid={errors.phoneNumber && false}
        $maxLen={12}
      />
    </>
  );
};

export default EmergencyContactInput;
