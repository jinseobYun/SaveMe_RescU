import React from "react";
import BasicLayout from "../layouts/BasicLayout";
import { useState } from "react";
import Input from "../components/elements/Input";
import Textarea from "../components/elements/Textarea";
import Button from "../components/elements/Button";
import IncidentList from "../components/IncidentList";

import "./MainPage.css";
import "react-datepicker/dist/react-datepicker.css";

// Mock
const mockData = {
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-01"),
  charge: "김담당",
  department: "대전 중구청 소방",
  address1: "대명동 593 씨씨빌리지",
  address2: "한밭대로 1234 씨씨빌리지",
  patientType: "다리 골절 환자",
  memo: "다리 골절 환자",
  reporterName: "김싸피",
  reporterPhone: "010-1234-5678",
  reportTime: "",
  dispatchTime: "",
  emergencyRoom: "배정 응급실정보",
  patientName: "김싸피",
  gender: "남",
  birthDate: "2000.01.01",
  bloodType: "A, Rh+",
  diseases: "1. 당뇨\n2. 천식",
  medications: "1. 아세타아미노펜 20mg\n2. 아세타아미노펜 40mg",
  specialNotes: "1. 특이사항1",
};

// mock
const listMockData = [
  {
    emergencyId: 1,
    reportTime: "2024.07.19 11:30:25",
    handler: "김담당",
  },
  {
    emergencyId: 2,
    reportTime: "2024.07.11 11:30:25",
    handler: "김담당",
  },
  {
    emergencyId: 3,
    reportTime: "2024.06.24 11:30:25",
    handler: "이담당",
  },
  {
    emergencyId: 4,
    reportTime: "2024.05.27 11:30:25",
    handler: "이담당",
  },
  {
    emergencyId: 5,
    reportTime: "2024.05.26 11:30:25",
    handler: "이담당",
  },
  {
    emergencyId: 6,
    reportTime: "2024.04.24 11:30:25",
    handler: "박담당",
  },
  {
    emergencyId: 7,
    reportTime: "2024.05.19 11:30:25",
    handler: "박담당",
  },
  {
    emergencyId: 8,
    reportTime: "2024.07.3 11:30:25",
    handler: "박담당",
  },
  {
    emergencyId: 9,
    reportTime: "2024.06.11 11:30:25",
    handler: "박담당",
  },
];

const MainPage = () => {
  const [formData, setFormData] = useState(mockData);

  // 버튼 클릭을 통한 filter 처리
  const [filteredData, setFilteredData] = useState(listMockData);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // list data filter처리 (버튼 클릭 없이)--------------------------
  // const filterByDateAndHandler = (item) => {
  //   const reportDate = new Date(item.reportTime);
  //   const start = new Date(formData.startDate);
  //   const end = new Date(formData.endDate);

  //   return (
  //     (!formData.startDate || reportDate >= start) &&
  //     (!formData.endDate || reportDate <= end) &&
  //     (!formData.charge || item.handler === formData.charge)
  //   );
  // };
  // 임시 code ----------------------------------------------------

  const handleFilter = () => {
    const filtered = listMockData.filter(item => {
      const reportDate = new Date(item.reportTime);
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      return (
        (!formData.startDate || reportDate >= start) &&
        (!formData.endDate || reportDate <= end) &&
        (!formData.charge || item.handler === formData.charge)
      );
    });

    setFilteredData(filtered);
  };

  return (
    <BasicLayout>
      <div className="mainpage">
        <div className="main-left">
          <div className="filter">
            <div className="condition">
              <div className="filter-date">
                <Input
                  type="date"
                  name="startDate"
                  label="시작일자"
                  value={formData.startDate}
                  setValue={(value) => handleInputChange("startDate", value)}
                />
              </div>
              <div className="filter-date">
                <Input
                  type="date"
                  name="endDate"
                  label="종료일자"
                  value={formData.endDate}
                  setValue={(value) => handleInputChange("endDate", value)}
                />
              </div>
              <div className="charge-input">
                <Input
                  type="text"
                  name="charge"
                  label="담당자"
                  value={formData.charge}
                  setValue={(value) => handleInputChange("charge", value)}
                />
              </div>
              <div className="filter-btn">
                {/* 버튼 클릭 이벤트 미지정 */}
                {/* <Button _onClick={() => console.log("눌렀당!!")}>
                  조회하기
                </Button> */}
                {/* 버튼에 handleFilter 이벤트 읃록 */}
                <Button _onClick={() => handleFilter()}>조회하기</Button>
              </div>
            </div>
          </div>
          <div className="list-container">
            <div className="list">
              <div className="num">긴급구조번호</div>
              <div className="time">신고접수시간</div>
              <div className="charge">담당자</div>
            </div>
            {/* Filter 자동조회 */}
            {/* <IncidentList data={listMockData} filter={filterByDateAndHandler} /> */}

            {/* Filter 버튼 이벤트 추가  */}
            <IncidentList data={filteredData} />
          </div>
        </div>
        <div className="main-divide"></div>
        <div className="main-right">
          <form>
            <div className="left-column">
              <Input
                type="text"
                name="department"
                label="관할부서"
                disabled="true"
                value={formData.department}
              />
              <Input
                type="text"
                name="address1"
                label="신고위치 - 지번"
                value={formData.address1}
                disabled="true"
              />
              <Input
                type="text"
                name="address2"
                label="신고위치 - 도로명"
                value={formData.address2}
                disabled="true"
              />
              <Input
                type="text"
                name="patientType"
                label="환자유형"
                value={formData.patientType}
                disabled="true"
              />

              <Textarea
                name="memo"
                value={formData.memo}
                label="메모사항"
                overflow="hidden"
                disabled="true"
              />
              <Input
                type="text"
                name="reporterName"
                label="신고자명"
                value={formData.reporterName}
                disabled="true"
              />

              <Input
                type="text"
                name="reporterPhone"
                label="신고자번호"
                value={formData.reporterPhone}
                disabled="true"
              />

              <Input
                type="text"
                name="reportTime"
                label="신고시간"
                value={formData.reportTime}
                disabled="true"
                placeholder="yyyy.mm.dd hh:mm:ss"
              />

              <Input
                type="text"
                name="dispatchTime"
                label="출동지령시간"
                value={formData.dispatchTime}
                disabled="true"
                placeholder="yyyy.mm.dd hh:mm:ss"
              />
            </div>
            <div className="right-column">
              <Input
                type="text"
                name="emergencyRoom"
                label="응급실"
                value={formData.emergencyRoom}
                disabled="true"
              />

              <Input
                type="text"
                name="patientName"
                label="환자명"
                value={formData.patientName}
                disabled="true"
              />

              <Input
                type="text"
                name="gender"
                label="성별"
                value={formData.gender}
                disabled="true"
              />

              <Input
                type="text"
                name="birthDate"
                label="생년월일"
                value={formData.birthDate}
                disabled="true"
              />

              <Input
                type="text"
                name="bloodType"
                label="혈액형"
                value={formData.bloodType}
                disabled="true"
              />

              <Textarea
                name="diseases"
                value={formData.diseases}
                label="지병정보"
                overflow="hidden"
                disabled="true"
              />

              <Textarea
                name="medications"
                value={formData.medications}
                label="투약정보"
                overflow="hidden"
                disabled="true"
              />

              <Textarea
                name="specialNotes"
                value={formData.specialNotes}
                label="기타특이사항"
                overflow="hidden"
                disabled="true"
              />
            </div>
          </form>
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
