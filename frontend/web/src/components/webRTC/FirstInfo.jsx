import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";

const mockData = {
  gwanhals: ["대전 중구청 소방", "서울 강남구청 소방", "부산 해운대구청 소방"],
  jibunLocationInfo: "덕명동 593 싸피빌리지",
  doroLocationInfo: "한밭대로 1234 싸피빌리지",
  emergencyType: "질병",
  reporterName: "김싸피",
  reportedTime : "2024-01-01 12:35:56",
  reporterPhone: "010-1234-5678",
  reportDetail: "환자가 고열로 의식이 없습니다.",
};

const FirstInfo = () => {
  const [formData, setFormData] = useState({
    rescueTeamName: "",
    jibunLocationInfo: "",
    doroLocationInfo: "",
    emergencyType: "",
    reporterName: "",
    reportedTime:"",
    reporterPhone: "",
    reportDetail: "",
  });

  const [rescueTeamNameOptions, setrescueTeamNameOptions] = useState([]);

  useEffect(() => {
    setrescueTeamNameOptions(mockData.gwanhals);
    setFormData({
      rescueTeamName: mockData.gwanhals[0],
      jibunLocationInfo: mockData.jibunLocationInfo,
      doroLocationInfo: mockData.doroLocationInfo,
      emergencyType: mockData.emergencyType,
      reportDetail: mockData.reportDetail,
      reporterName: mockData.reporterName,
      reporterPhone: mockData.reporterPhone,
    });
  }, []);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <FormContainer>
      <Select
        label="관할 119안전센터"
        name="gwanhals"
        options={rescueTeamNameOptions}
        selectedValue={formData.rescueTeamName}
        setSelectedValue={(value) => handleInputChange({ target: { name: "rescueTeamName", value } })}
      />
      <Input
        label="신고위치 - 지번"
        name="jibunLocationInfo"
        value={formData.jibunLocationInfo}
        onChange={handleInputChange}
        showClearButton={true}
      />
      <Input
        label="신고위치 - 도로명"
        name="doroLocationInfo"
        value={formData.doroLocationInfo}
        onChange={handleInputChange}
        showClearButton={true}
      />
      <Input
        label="긴급구조분류"
        name="emergencyType"
        value={formData.emergencyType}
        onChange={handleInputChange}
      />
      <Textarea
        label="신고내용"
        name="reportDetail"
        value={formData.reportDetail}
        onChange={handleInputChange}
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
        name="reporterName"
        value={formData.reporterName}
        onChange={handleInputChange}
        showClearButton={true}
      />
      <Input
        label="신고자번호"
        name="reporterPhone"
        value={formData.reporterPhone}
        onChange={handleInputChange}
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
