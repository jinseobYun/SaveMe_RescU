import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Header } from "@components/common";
import { MedicalSpecificForm, MedicalInfoForm } from "@components/form";
import useFormInputStore from "@/store/useFormInputStore";

const EditMedicalInfoPage = () => {
  const [searchParams] = useSearchParams();
  const formType = searchParams.get("form");
  const nextFormUrl = {
    basic: { url: "/medicalinfo/edit?form=drug", text: "다음" },
    drug: { url: "/medicalinfo/edit?form=disease", text: "다음" },
    disease: { url: "/medicalinfo", text: "저장하기" },
  };
  useEffect(() => {
    //TODO - userStore의 정보를 input으로 set하기
    // 만약 뒤로 가서 왓을 때도 다시 조회되면 페이지 이동 전에 조회하는거로 바꾸기
  });
  if (formType === "basic") {
    return (
      <>
        <Header backAlert={true} />
        <MedicalInfoForm btnSetting={nextFormUrl.basic} />
      </>
    );
  } else if (formType === "drug") {
    return (
      <>
        <Header />
        <MedicalSpecificForm form="drug" btnSetting={nextFormUrl.drug} />
      </>
    );
  } else if (formType === "disease") {
    return (
      <>
        <Header />
        <MedicalSpecificForm form="disease" btnSetting={nextFormUrl.disease} />
      </>
    );
  } else {
    return <div>Invalid form type</div>; // 잘못된 form 파라미터 처리
  }
};

export default EditMedicalInfoPage;
