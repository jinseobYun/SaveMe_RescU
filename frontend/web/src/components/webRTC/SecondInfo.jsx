import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Radio from "../elements/Radio";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";

import { useDispatch, useSelector } from "react-redux";
import { putSecondInfoAsync } from "../../slices/reportSlice";
// 응급실 정보는 다시 호출
import { fetchEmergencyList } from "../../slices/emergencySlice";
import { sendEmergencyPush } from "../../api/fcmApi";

import { useNavigate } from "react-router-dom";

const SecondInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reportData = useSelector((state) => state.reportSlice.reportData);
  const dispatchOrderId = useSelector(
    (state) => state.reportSlice.dispatchOrderId
  );
  const emergencyData = useSelector((state) => state.emergencySlice) || {
    items: [],
  };

  const chronicDiseaseRefs = useRef([]);
  const drugInfosRefs = useRef([]);

  // form 변수명 수정
  const [formData, setFormData] = useState({
    hospitalName: "",
    memberName: "",
    gender: "",
    birth: "",
    bloodType1: "",
    bloodType2: "",
    otherInfo: "",
    chronicDisease: [""],
    drugInfos: [""],
  });

  const [hospitalOptions, setHospitalOptions] = useState([]);

  // api 호출 데이터 ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
  // reportData의 latitude와 longitude로 응급실 정보를 호출
  useEffect(() => {
    if (reportData.latitude && reportData.longitude) {
      dispatch(
        fetchEmergencyList({
          lat: reportData.latitude,
          lon: reportData.longitude,
        })
      );
    }
  }, [reportData.latitude, reportData.longitude, dispatch]);

  // 응급실 정보가 변경될 때 폼의 기본 값을 설정
  useEffect(() => {
    if (emergencyData.items.length > 0) {
      setHospitalOptions(
        emergencyData.items.map((hospital) => hospital.dutyName)
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        hospitalName: emergencyData.items[0].dutyName,
      }));
    }
  }, [emergencyData.items]);

  useEffect(() => {
    if (reportData && reportData.taggingMedicalInformation) {
      handleLoadTagData();
    } else if (reportData && reportData.reporterMedicalInformation) {
      handleLoadReporterData();
    }
  }, [reportData]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

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
      hospitalName: "",
      hpid: "",
      memberName: "",
      gender: "",
      birth: "",
      bloodType1: "",
      bloodType2: "",
      chronicDisease: [""],
      drugInfos: [""],
      otherInfo: "",
    });
  };

  const handleLoadTagData = () => {
    if (reportData && reportData.taggingMedicalInformation) {
      setFormData({
        ...formData,
        memberName: reportData.taggingMedicalInformation.memberName,
        gender: reportData.taggingMedicalInformation.gender === 0 ? "남" : "여",
        birth: reportData.taggingMedicalInformation.birth,
        bloodType1: reportData.taggingMedicalInformation.bloodType1,
        bloodType2: reportData.taggingMedicalInformation.bloodType2,
        chronicDisease: reportData.taggingMedicalInformation.medCdis.map(
          (disease) => disease.cdName
        ),
        drugInfos: reportData.taggingMedicalInformation.drugInfos.map(
          (med) => med.medicineName
        ),
        otherInfo: reportData.taggingMedicalInformation.otherInfo,
      });
    }
  };

  const handleLoadReporterData = () => {
    if (reportData && reportData.reporterMedicalInformation) {
      setFormData({
        ...formData,
        memberName: reportData.reporterMedicalInformation.memberName,
        gender:
          reportData.reporterMedicalInformation.gender === 0 ? "남" : "여",
        birth: reportData.reporterMedicalInformation.birth,
        bloodType1: reportData.reporterMedicalInformation.bloodType1,
        bloodType2: reportData.reporterMedicalInformation.bloodType2,
        chronicDisease: reportData.reporterMedicalInformation.medCdis.map(
          (disease) => disease.cdName
        ),
        drugInfos: reportData.reporterMedicalInformation.drugInfos.map(
          (med) => med.medicineName
        ),
        otherInfo: reportData.reporterMedicalInformation.otherInfo,
      });
    }
  };

  const handleHospitalChange = (value, index) => {
    if (emergencyData.items && emergencyData.items.length > 0) {
      console.log(emergencyData);
      setFormData((prevState) => ({
        ...prevState,
        hospitalName: value,
        hpid: emergencyData.items[index].hpid,
      }));
    } else {
      console.log("응급실 정보 누락");
    }
  };

  // 데이터 전송
  const handleSubmit = async () => {
    if (!dispatchOrderId) {
      alert("dispatchOrderId가 없습니다. 1차 정보를 먼저 입력해주세요.");
      return;
    }

    const payload = {
      dispatchOrderId,
      ...formData,
      chronicDisease: formData.chronicDisease.filter((item) => item !== ""),
      drugInfos: formData.drugInfos.filter((item) => item !== ""),
    };

    console.log("이거봐바바바바", payload);

    dispatch(putSecondInfoAsync(payload));

    const reportData = JSON.parse(localStorage.getItem("reportData"));
    const fcmPayload = {
      tagId: reportData.patientId,
      hospitalName: formData.hospitalName,
      hospitalAddress:
        emergencyData.items.find(
          (hospital) => hospital.dutyName === formData.hospitalName
        )?.dutyAddr || "",
    };

    if (reportData.patientId) {
      try {
        await sendEmergencyPush(fcmPayload);
        alert("2차 정보 전송 및 FCM 전송이 완료되었습니다.");
      } catch (error) {
        alert("FCM 전송 중 오류가 발생했습니다.");
      }
    }
  };

  const handleKeyDown = (e, name, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFormData((prevState) => {
        const updatedArray = [...prevState[name]];
        if (updatedArray[index] !== "") {
          updatedArray.push("");
        }
        return {
          ...prevState,
          [name]: updatedArray,
        };
      });
    }
  };

  return (
    <FormContainer>
      <Section>
        <Select
          label="응급실"
          name="hospitals"
          options={hospitalOptions}
          selectedValue={formData.hospitalName}
          setSelectedValue={(value, index) =>
            handleHospitalChange(value, index)
          }
        />
        <div>
          <Button _onClick={handleClearAll} $color="white">
            환자정보 일괄삭제
          </Button>
        </div>
        <ButtonRow>
          <Button _onClick={handleLoadTagData} $color="white">
            태그 정보 <br /> 불러오기
          </Button>
          <Button _onClick={handleLoadReporterData} $color="white">
            신고자정보 <br />
            불러오기
          </Button>
        </ButtonRow>
      </Section>
      <Section>
        <InputRow>
          <Input
            label="환자명"
            name="memberName"
            value={formData.memberName}
            onChange={handleInputChange}
            placeholder="이름"
          />
          <Select
            label="성별"
            name="gender"
            options={["남", "여"]}
            selectedValue={formData.gender}
            setSelectedValue={(value) =>
              handleInputChange({ target: { name: "gender", value } })
            }
          />
          <Input
            label="생년월일"
            name="birth"
            value={formData.birth}
            onChange={handleInputChange}
            placeholder="yyyy.mm.dd"
          />
        </InputRow>
        <InputRow>
          <Radio
            name="bloodType1"
            label="혈액형"
            options={["A", "B", "AB", "O"]}
            selectedValue={formData.bloodType1}
            setSelectedValue={(value) =>
              handleInputChange({ target: { name: "bloodType1", value } })
            }
          />
          <Radio
            name="bloodType2"
            label="Rh"
            options={["RH+", "RH-"]}
            selectedValue={formData.bloodType2}
            setSelectedValue={(value) =>
              handleInputChange({ target: { name: "bloodType2", value } })
            }
          />
        </InputRow>
      </Section>
      <Section>
        <Label>지병정보</Label>
        {(formData.chronicDisease.length === 0
          ? [""]
          : formData.chronicDisease
        ).map((disease, index) => (
          <Input
            key={index}
            name={`disease_${index}`}
            value={disease}
            onChange={(e) =>
              handleArrayInputChange("chronicDisease", index, e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(e, "chronicDisease", index)}
            placeholder={`지병을 입력하세요`}
          />
        ))}
      </Section>
      <Section>
        <Label>투약정보</Label>
        {(formData.drugInfos.length === 0 ? [""] : formData.drugInfos).map(
          (medication, index) => (
            <Input
              key={index}
              name={`medication_${index}`}
              value={medication}
              onChange={(e) =>
                handleArrayInputChange("drugInfos", index, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, "drugInfos", index)}
              placeholder={`투약정보를 입력하세요`}
            />
          )
        )}
      </Section>
      <Section>
        <Textarea
          label="기타 특이사항"
          name="otherInfo"
          value={formData.otherInfo}
          onChange={handleInputChange}
          overflow="hidden"
        />
      </Section>
      <ButtonRow>
        <Button _onClick={() => navigate(-1)} $color="white">
          뒤로가기
        </Button>
        <Button _onClick={handleSubmit} $color="white">
          보내기
        </Button>
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
  font-size: 16px;
  font-weight: bold;
`;

export default SecondInfo;
