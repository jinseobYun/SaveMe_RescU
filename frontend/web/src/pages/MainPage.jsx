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
  const pastDate = new Date(date);
  pastDate.setMonth(pastDate.getMonth() - 1);
  const year = pastDate.getFullYear();
  const month = String(pastDate.getMonth() + 1).padStart(2, "0");
  const day = String(pastDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatEndDate(date) {
  const endDate = new Date(date);
  endDate.setHours(23, 59, 58, 999);
  const year = endDate.getFullYear();
  const month = String(endDate.getMonth() + 1).padStart(2, "0");
  const day = String(endDate.getDate() + 1).padStart(2, "0");
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
    createdBy: null,
  });

  const [currentPage, setCurrentPage] = useState(0);

  // 페이지 로드 시 기본 데이터 불러오기
  useEffect(() => {
    dispatch(fetchIncidentList({ page: currentPage }));
  }, [dispatch]);

  const getFilteredParams = (params) => {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setCurrentPage(1);
    const filteredParams = getFilteredParams(formData);
    setCurrentPage(1);
    dispatch(fetchIncidentList({ page: 1, ...filteredParams }));
  };

  const handleIncidentClick = (id) => {
    dispatch(fetchIncidentDetails(id));
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      const filteredParams = getFilteredParams(formData);
      setCurrentPage(page);
      dispatch(fetchIncidentList({ page, ...filteredParams }));
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
