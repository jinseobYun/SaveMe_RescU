import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncidentList,
  fetchIncidentDetails,
} from "../slices/incidentSlice";
import BasicLayout from "../layouts/BasicLayout";
import Filter from "../components/main/Filter";
import IncidentList from "../components/main/IncidentList";
import InfoForm from "../components/main/InfoForm";
import Pagination from "../components/main/Pagination";
import "./MainPage.css";

function formatStartDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatEndDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate() + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MainPage = () => {
  const dispatch = useDispatch();
  const { list, details, loading, error } = useSelector(
    (state) => state.incident
  );
  const [formData, setFormData] = useState({
    startDate: formatStartDate(new Date()),
    endDate: formatEndDate(new Date()),
    createdBy: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // 페이지 로드 시 기본 데이터 불러오기
  useEffect(() => {
    dispatch(fetchIncidentList({ page: currentPage }));
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setCurrentPage(1);
    dispatch(fetchIncidentList({ page: 1, ...formData }));
  };

  const handleIncidentClick = (id) => {
    dispatch(fetchIncidentDetails(id));
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
    setCurrentPage(page);
    dispatch(fetchIncidentList({ page, ...formData }));
    }
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
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          <IncidentList data={list} onIncidentClick={handleIncidentClick} />
          <div className="pagination">
            <Pagination
              currentPage={currentPage}
              totalItems={list.totalElements}
              onPageChange={handlePageChange}
              itemsPerPage={10}
            />
          </div>
        </div>
        <div className="main-divide"></div>
        <div className="main-right">
          <InfoForm formData={details} />
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
