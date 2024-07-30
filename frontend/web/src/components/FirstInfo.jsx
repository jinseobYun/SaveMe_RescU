import React, { useState, useEffect } from "react";
import Input from "../components/elements/Input";
import Button from "../components/elements/Button";
import styled from "styled-components";
import Select from "./elements/Select";
import Textarea from "./elements/Textarea";

const mockData = {
  centers: ["대전 중구청 소방", "서울 강남구청 소방", "부산 해운대구청 소방"],
  address1: "덕명동 593 싸피빌리지",
  address2: "한밭대로 1234 싸피빌리지",
  emergencyType: "질병",
  reportDetails: "환자가 고열로 의식이 없습니다.",
  reporterName: "김싸피",
  reporterPhone: "010-1234-5678",
};

const FirstInfo = () => {
  const [formData, setFormData] = useState({
    center: "",
    address1: "",
    address2: "",
    emergencyType: "",
    reportDetails: "",
    reporterName: "",
    reporterPhone: "",
  });

  const [centerOptions, setCenterOptions] = useState([]);

  useEffect(() => {
    setCenterOptions(mockData.centers);
    setFormData({
      center: mockData.centers[0],
      address1: mockData.address1,
      address2: mockData.address2,
      emergencyType: mockData.emergencyType,
      reportDetails: mockData.reportDetails,
      reporterName: mockData.reporterName,
      reporterPhone: mockData.reporterPhone,
    });
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <FormContainer>
      <Select
        label="관할 119안전센터"
        options={centerOptions}
        selectedValue={formData.center}
        setSelectedValue={(value) => handleInputChange("center", value)}
      />
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
      <Textarea
        label="신고내용"
        value={formData.reportDetails}
        setValue={(value) => handleInputChange("reportDetails", value)}
        placeholder="신고 내용을 입력하세요"
        cols={40}
        rows={10}
        overflow="auto"
        maxWidth="100%"
        minHeight="150px"
        maxLength={1000}
      />
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
