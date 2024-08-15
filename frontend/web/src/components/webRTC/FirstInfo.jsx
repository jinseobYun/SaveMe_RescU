import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";

// Api 연결
import { useDispatch, useSelector } from "react-redux";
import {
  getReportAsync,
  postFirstInfoAsync,
  setDispatchOrderId,
  setMappedData,
} from "../../slices/reportSlice";
import { useNavigate } from "react-router-dom";

const FirstInfo = () => {
  const [formData, setFormData] = useState({
    rescueTeamId: "",
    firestation: "",
    jibunLocationInfo: "",
    doroLocationInfo: "",
    emergencyType: "",
    reporterName: "",
    reporterPhone: "",
    reportDetail: "",
  });

  // api를 위한 호출
  const dispatch = useDispatch();
  const reportData = useSelector((state) => state.reportSlice.reportData);
  const navigate = useNavigate();

  const [rescueTeamNameOptions, setRescueTeamNameOptions] = useState([]);

  // 이벤트 받아서 처리
  useEffect(() => {
    const handleReportInfoReceived = (event) => {
      const mappedData = event.detail;

      // Redux 상태 업데이트
      dispatch(setMappedData(mappedData));
      dispatch(getReportAsync(mappedData));
    };

    // 이벤트 리스너 등록
    window.addEventListener("reportInfoReceived", handleReportInfoReceived);

    // Clean up 이벤트 리스너
    return () => {
      window.removeEventListener(
        "reportInfoReceived",
        handleReportInfoReceived
      );
    };
  }, [dispatch]);

  useEffect(() => {
    if (reportData && reportData.rescueTeams.length > 0) {
      console.log("이거확인!!", reportData);
      setRescueTeamNameOptions(
        reportData.rescueTeams.map((team) => team.teamName)
      );
      setFormData({
        rescueTeamId: reportData.rescueTeams[0].rescueTeamId,
        firestation: reportData.rescueTeams[0].teamName,
        jibunLocationInfo: reportData.lotNumberAddress,
        doroLocationInfo: reportData.roadNameAddress,
        emergencyType: "",
        reporterName: reportData.reporterName,
        reporterPhone: reportData.reporterPhone,
        reportDetail: "",
      });
    }
  }, [reportData]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  // 반환 필요
  const handleSubmit = async () => {
    const result = await dispatch(postFirstInfoAsync(formData));
    if (result.payload && result.payload.dispatchOrderId) {
      dispatch(setDispatchOrderId(result.payload.dispatchOrderId));
      navigate("/webrtc/second-info");
    }
    console.log(result.payload);
  };

  return (
    <>
      <FormContainer>
        <Select
          label="관할 119안전센터"
          name="rescueTeamName"
          options={rescueTeamNameOptions}
          selectedValue={formData.rescueTeamName}
          setSelectedValue={(value) =>
            handleInputChange({ target: { name: "firestation", value } })
          }
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
      </FormContainer>
        <SubmitButton>
          <Button _onClick={handleSubmit} $color="white">
            보내기
          </Button>
        </SubmitButton>
    </>
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
  overflow-y: auto;
  scrollbar-width: none;
  height:90vh;
`;

const SubmitButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default FirstInfo;
