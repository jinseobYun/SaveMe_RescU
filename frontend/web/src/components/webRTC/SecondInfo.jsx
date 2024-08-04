import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Radio from "../elements/Radio";
import Select from "../elements/Select";

import { useDispatch, useSelector } from "react-redux";
import { postSecondInfoAsync } from "../../slices/reportSlice";

// useLocation을 사용해 dispatchOrderId를 전달
import { useLocation } from "react-router-dom";

// mock
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
  reporterName: "신고자",
  reporterPhone: "010-1234-5678",
};
// mock2
const mockReporterData = {
  patientName: "김신고자",
  gender: "여",
  birthDate: "1990.12.12",
  bloodType: "AB",
  rhType: "Rh-",
  diseases: ["풍", "ADHD"],
  medications: [
    "신고자 의약품1 40mg",
    "신고자 의약품2 11mg",
    "신고자 의약품3 10mg",
  ],
  specialNotes: ["신고자는신고신고합니다"],
  reporterName: "신고자",
  reporterPhone: "010-9876-5432",
};

const SecondInfo = () => {
  // api 연결
  const dispatch = useDispatch();
  const location = useLocation();
  const { dispatchOrderId } = location.state;
  const reportData = useSelector((state) => state.reportSlice);

  const [formData, setFormData] = useState({
    hospital: "",
    hpid: "",
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

  // mock 용 데이터 저장 ★★★★★★★★★★★★★★★★★★★★★★★★
  // useEffect(() => {
  //   setHospitalOptions(mockTagData.hospitals);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     hospital: mockTagData.hospitals[0],
  //   }));
  // }, []);
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

  // api 호출 데이터 ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
  useEffect(() => {
    if (reportData) {
      setHospitalOptions(
        reportData.hospitals.map((hospital) => hospital.hospitalName)
      );
      setFormData({
        hospital: reportData.hospitals[0].hospitalName,
        hpid: reportData.hospitals[0].hpid,
        patientName: reportData.medicalInformation.memberName,
        gender: reportData.medicalInformation.gender,
        birthDate: reportData.medicalInformation.birth,
        bloodType: reportData.medicalInformation.bloodType1,
        rhType: reportData.medicalInformation.bloodType2,
        diseases: reportData.medicalInformation.chronicDisease,
        medications: reportData.medicalInformation.drugInfos,
        specialNotes: reportData.medicalInformation.otherInfo.split(", "), // assuming otherInfo is a comma-separated string
      });
    }
  }, [reportData]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 추가: 배열로 들어온 값에 대해 수정하는 경우.
  const handleArrayInputChange = (name, index, value) => {
    setFormData((prevState) => {
      const updatedArray = [...prevState[name]];
      updatedArray[index] = value;
      return {
        ...prevState,
        [name]: updatedArray,
      };
    });
  };

  const handleClearAll = () => {
    setFormData({
      hospital: "",
      hpid: "",
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

  // const handleSubmit = () => {
  //   console.log(formData);
  // };

  // 데이터 전송
  const handleSubmit = () => {
    const payload = {
      dispatchOrderId: dispatchOrderId,
      hpid: formData.hpid,
      hospitalName: formData.hospital,
      medicalInformation: {
        medicalInfoId: reportData.medicalInformation.medicalInfoId,
        bloodType1: formData.bloodType,
        bloodType2: formData.rhType,
        otherInfo: formData.specialNotes.join(", "),
        chronicDisease: formData.diseases,
        drugInfos: formData.medications,
      },
    };

    dispatch(postSecondInfoAsync(payload));
    console.log(payload);
  };

  return (
    <FormContainer>
      <Section>
        <Select
          label="응급실"
          name="hospitals"
          options={hospitalOptions}
          selectedValue={formData.hospital}
          setSelectedValue={(value, index) => {
            handleInputChange({ target: { name: "hospital", value } });
            handleInputChange({
              target: { name: "hpid", value: reportData.hospitals[index].hpid },
            });
          }}
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
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            // setValue={(value) => handleInputChange("patientName", value)}
            placeholder="이름"
          />
          <Input
            label="성별"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            // setValue={(value) => handleInputChange("gender", value)}
            placeholder="남/여"
          />
          <Input
            label="생년월일"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            // setValue={(value) => handleInputChange("birthDate", value)}
            placeholder="yyyy.mm.dd"
          />
        </InputRow>
        <InputRow>
          <Radio
            name="bloodType"
            label="혈액형"
            options={["A", "B", "AB", "O"]}
            selectedValue={formData.bloodType}
            setSelectedValue={(value) =>
              handleInputChange({ target: { name: "bloodType", value } })
            }
            // setSelectedValue={(value) => handleInputChange("bloodType", value)}
          />
          <Radio
            name="rhType"
            label="Rh"
            options={["Rh+", "Rh-"]}
            selectedValue={formData.rhType}
            setSelectedValue={(value) =>
              handleInputChange({ target: { name: "rhType", value } })
            }
            // setSelectedValue={(value) => handleInputChange("rhType", value)}
          />
        </InputRow>
      </Section>
      <Section>
        <Label>지병정보</Label>
        {formData.diseases.map((disease, index) => (
          <Input
            key={index}
            name={`disease_${index}`}
            value={disease}
            onChange={(e) =>
              handleArrayInputChange("diseases", index, e.target.value)
            }
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
            name={`medication_${index}`}
            value={medication}
            onChange={(e) =>
              handleArrayInputChange("medications", index, e.target.value)
            }
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
            name={`specialNote_${index}`}
            value={note}
            onChange={(e) =>
              handleArrayInputChange("specialNotes", index, e.target.value)
            }
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
