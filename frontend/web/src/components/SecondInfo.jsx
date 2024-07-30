import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "./elements/Input";
import Button from "./elements/Button";
import Radio from "./elements/Radio";
import Select from "./elements/Select";


const mockTagData = {
  hospitals: ["가장 가까운 응급실 기본값 설정", "응급실 1", "응급실 2"],
  patientName: "김싸피",
  gender: "남",
  birthDate: "2000.01.01",
  bloodType: "A",
  rhType: "Rh+",
  diseases: ["당뇨", "천식"],
  medications: ["아세트아미노펜 20mg", "약품2 40mg", "약품2 40mg"],
  specialNotes: ["아세트아미노펜 20mg"],
};

const mockReporterData = {
  reporterName: "신고자",
  reporterPhone: "010-1234-5678",
};

const SecondInfo = () => {
  const [formData, setFormData] = useState({
    hospital:"",
    patientName: "",
    gender: "",
    birthDate: "",
    bloodType: "",
    rhType: "",
    diseases: [""],
    medications: [""],
    specialNotes: [""],
    reporterName: "",
    reporterPhone: "",
  });

  const [hospitalOptions, setHospitalOptions] = useState([]);

  useEffect(() => {
    setHospitalOptions(mockTagData.hospitals);
    setFormData((prevFormData) => ({
      ...prevFormData,
      hospital: mockTagData.hospitals[0],
    }));
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClearAll = () => {
    setFormData({
      hospital: "",
      patientName: "",
      gender: "",
      birthDate: "",
      bloodType: "",
      rhType: "",
      diseases: [""],
      medications: [""],
      specialNotes: [""],
      reporterName: "",
      reporterPhone: "",
    });
  };

  const handleLoadTagData = () => {
    setFormData({
      ...formData,
      ...mockTagData,
    });
  };

  const handleLoadReporterData = () => {
    setFormData({
      ...formData,
      ...mockReporterData,
    });
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
  };

  return (
    <FormContainer>
      <Section>
        <Select
          label="응급실"
          options={hospitalOptions}
          selectedValue={formData.hospital}
          setSelectedValue={(value) => handleInputChange("hospital", value)}
        />
        <div>
          <Button _onClick={handleClearAll}>환자정보 일괄삭제</Button>
        </div>
        <ButtonRow>
          <Button _onClick={handleLoadTagData}>태그 정보 불러오기</Button>
          <Button _onClick={handleLoadReporterData}>신고자정보 불러오기</Button>
        </ButtonRow>
      </Section>
      <Section>
        <InputRow>
          <Input
            label="환자명"
            value={formData.patientName}
            setValue={(value) => handleInputChange("patientName", value)}
            placeholder="이름"
          />
          <Input
            label="성별"
            value={formData.gender}
            setValue={(value) => handleInputChange("gender", value)}
            placeholder="남/여"
          />
          <Input
            label="생년월일"
            value={formData.birthDate}
            setValue={(value) => handleInputChange("birthDate", value)}
            placeholder="yyyy.mm.dd"
          />
        </InputRow>
        <InputRow>
          <Radio
            name="bloodType"
            label="혈액형"
            options={["A", "B", "AB", "O"]}
            selectedValue={formData.bloodType}
            setSelectedValue={(value) => handleInputChange("bloodType", value)}
          />
          <Radio
            name="rhType"
            label="Rh"
            options={["Rh+", "Rh-"]}
            selectedValue={formData.rhType}
            setSelectedValue={(value) => handleInputChange("rhType", value)}
          />
        </InputRow>
      </Section>
      <Section>
        <Label>지병정보</Label>
        {formData.diseases.map((disease, index) => (
          <Input
            key={index}
            value={disease}
            setValue={(value) => {
              const newDiseases = [...formData.diseases];
              newDiseases[index] = value;
              handleInputChange("diseases", newDiseases);
            }}
            placeholder={`지병을 입력하세요`}
            // showClearButton={true}
          />
        ))}
      </Section>
      <Section>
        <Label>투약정보</Label>
        {formData.medications.map((medication, index) => (
          <Input
            key={index}
            value={medication}
            setValue={(value) => {
              const newMedications = [...formData.medications];
              newMedications[index] = value;
              handleInputChange("medications", newMedications);
            }}
            placeholder={`투약정보를 입력하세요`}
            // showClearButton={true}
          />
        ))}
      </Section>
      <Section>
        <Label>기타 특이 사항</Label>
        {formData.specialNotes.map((note, index) => (
          <Input
            key={index}
            value={note}
            setValue={(value) => {
              const newNotes = [...formData.specialNotes];
              newNotes[index] = value;
              handleInputChange("specialNotes", newNotes);
            }}
            placeholder={`기타 특이사항`}
            // showClearButton={true}
          />
        ))}
      </Section>
      <ButtonRow>
        <Button _onClick={handleSubmit}>뒤로가기</Button>
        <Button _onClick={handleSubmit}>보내기</Button>
      </ButtonRow>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
`;

const Label = styled.div`
  font-weight: bold;
`;

export default SecondInfo;
