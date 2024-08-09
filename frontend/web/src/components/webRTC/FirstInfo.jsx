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
} from "../../slices/reportSlice";

import { useNavigate, useOutletContext } from "react-router-dom";

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

  // Context로 데이터 전달하기.
  // const { setDispatchOrderId } = useOutletContext();

  const [rescueTeamNameOptions, setRescueTeamNameOptions] = useState([]);

  // Api 호출 ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
  // Mock Data 에대해서 추가적인 처리 필요!!
  useEffect(() => {
    const params = {
      patientId: "ssafy", // mock 값
      reporterId: "ssafy2", // mock 값
      latitude: "37.5665", // mock 값
      longitude: "126.9780", // mock 값
    };
    dispatch(getReportAsync(params));
  }, [dispatch]);
  // Api 호출 ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆

  useEffect(() => {
    if (reportData && reportData.rescueTeams.length > 0) {
      console.log("이거확인!!",reportData)
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
      [e.target.name]:
        e.target.name === "emergencyType"
          ? parseInt(e.target.value, 10)
          : e.target.value,
      // [e.target.name]: e.target.value,
    }));
  };
  // 반환 필요
  const handleSubmit = async () => {
    const result = await dispatch(postFirstInfoAsync(formData));
    if (result.payload && result.payload.dispatchOrderId) {
      dispatch(setDispatchOrderId(result.payload.dispatchOrderId));
      navigate("/webrtc/second-info");

      // 페이지네비게이션 수정필요※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
      // navigate("/second-info", {
      //   state: { dispatchOrderId: result.payload.dispatchOrderId },
      // });
    }
    console.log(result.payload);
  };

  return (
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
