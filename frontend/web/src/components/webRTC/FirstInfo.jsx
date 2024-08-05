import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";

// Api 연결
import { useDispatch, useSelector } from "react-redux";
import { getReportAsync, postFirstInfoAsync } from "../../slices/reportSlice";

import { useNavigate } from "react-router-dom";

const mockData = {
  gwanhals: ["대전 중구청 소방", "서울 강남구청 소방", "부산 해운대구청 소방"],
  jibunLocationInfo: "덕명동 593 싸피빌리지",
  doroLocationInfo: "한밭대로 1234 싸피빌리지",
  emergencyType: "질병",
  reporterName: "김싸피",
  reportedTime: "2024-01-01 12:35:56",
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
    reportedTime: "",
    reporterPhone: "",
    reportDetail: "",
  });

  // api를 위한 호출
  const dispacth = useDispatch();
  const reportData = useSelector((state) => state.reportSlice);
  const navigate = useNavigate();

  const [rescueTeamNameOptions, setrescueTeamNameOptions] = useState([]);
  const [dispatchOrderId, setDispatchOrderId] = useState(null);

  // Api 호출 ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
  useEffect(() => {
    const memberId = 1;
    dispacth(getReportAsync(memberId));
  }, [dispacth]);

  // mockData를 이용한 코드 ★★★★★★★★★★★★★★★★★★★★★★★★★★★
  // useEffect(() => {
  //   setrescueTeamNameOptions(mockData.gwanhals);
  //   setFormData({
  //     rescueTeamName: mockData.gwanhals[0],
  //     jibunLocationInfo: mockData.jibunLocationInfo,
  //     doroLocationInfo: mockData.doroLocationInfo,
  //     emergencyType: mockData.emergencyType,
  //     reportDetail: mockData.reportDetail,
  //     reporterName: mockData.reporterName,
  //     reporterPhone: mockData.reporterPhone,
  //   });
  // }, []);
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

  // Api 호출 ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
  useEffect(() => {
    if (reportData && reportData.gwanhals.length > 0) {
      setrescueTeamNameOptions(
        reportData.gwanhals.map((team) => team.rescueTeamName)
      );
      setFormData({
        rescueTeamId: reportData.gwanhals[1].rescueTeamId,
        rescueTeamName: reportData.gwanhals[0].rescueTeamName,
        jibunLocationInfo: reportData.jibunLocationInfo,
        doroLocationInfo: reportData.doroLocationInfo,
        emergencyType: reportData.emergencyType,
        reporterName: reportData.reporterName,
        reporterPhone: reportData.reporterPhone,
        reportedTime: reportData.reportedTime,
        reportDetail: reportData.reportDetail,
      });
    }
  }, [reportData]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 반환이 없는 경우 요청만 ★★★★★★★★★★★★★★★★★★
  // const handleSubmit = () => {
  //   dispatch(postFirstInfoAsync(formData));
  //   console.log(formData);
  // };
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

  // 반환 필요
  const handleSubmit = async () => {
    const result = await dispacth(postFirstInfoAsync(formData));
    if (result.payload && result.payload.dispatchOrderId) {
      setDispatchOrderId(result.payload.dispatchOrderId);

      // 페이지네비게이션 수정필요※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
      navigate("/second-info", { state: {dispatchOrderId:result.payload.dispatchOrderId}})
    }
    console.log(result.payload)
  }




  return (
    <FormContainer>
      <Select
        label="관할 119안전센터"
        name="gwanhals"
        options={rescueTeamNameOptions}
        selectedValue={formData.rescueTeamName}
        setSelectedValue={(value) =>
          handleInputChange({ target: { name: "rescueTeamName", value } })
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
