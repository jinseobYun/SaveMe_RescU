import React, { useState } from "react";
import BasicLayout from "../layouts/BasicLayout";
import Filter from "../components/main/Filter";
import IncidentList from "../components/main/IncidentList";
import InfoForm from "../components/main/InfoForm";
import "./MainPage.css";

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

// 달력 Form 입력형식 지정
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const year = d.getFullYear();
  return [year, month, day].join("-");
};

const MainPage = () => {
  const [formData, setFormData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(listMockData);

  // const handleInputChange = (name, value) => {
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    const filtered = listMockData.filter((item) => {
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
          <Filter
            formData={formData}
            handleInputChange={handleInputChange}
            handleFilter={handleFilter}
          />
          <IncidentList data={filteredData} />
        </div>
        <div className="main-divide"></div>
        <div className="main-right">
          <InfoForm formData={formData} />
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
