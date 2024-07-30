import React, { useState } from "react";
import Input from "../components/elements/Input";
import Button from "../components/elements/Button";
import styled from "styled-components";

const FirstInfo = () => {
  const [formData, setFormData] = useState({
    center: "12431234234",
    address1: "",
    address2: "",
    emergencyType: "",
    reportDetails: "",
    reporterName: "",
    reporterPhone: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);
    // handle form submission
  };

  return (
    <FormContainer>
      <div className="select-center">
        <div>
          <label>관할 119안전센터</label>
        </div>
        <select className="centers" autoFocus>
          <option value={formData.center}></option>
        </select>
      </div>
      <Input
        label="신고위치 - 지번"
        value={formData.address1}
        setValue={(value) => handleInputChange("address1", value)}
        showClearButton={true}
      />
      <Input
        label="신고위치 - 도로명"
        value={formData.address2}
        setValue={(value) => handleInputChange("address2", value)}
        showClearButton={true}
      />
      <Input
        label="긴급구조분류"
        value={formData.emergencyType}
        setValue={(value) => handleInputChange("emergencyType", value)}
      />
      <div className="report-detail">
        <div>
          <label>신고내용</label>
        </div>
        <textarea></textarea>
      </div>

      <Input
        label="신고자명"
        value={formData.reporterName}
        setValue={(value) => handleInputChange("reporterName", value)}
        showClearButton={true}
      />
      <Input
        label="신고자번호"
        value={formData.reporterPhone}
        setValue={(value) => handleInputChange("reporterPhone", value)}
        showClearButton={true}
      />
      <SubmitButton>
        <Button _onClick={handleSubmit}>보내기</Button>
      </SubmitButton>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  // overflow-y:scroll;
`;

const SubmitButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default FirstInfo;
