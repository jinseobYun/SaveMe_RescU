import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncidentList, fetchIncidentDetails } from '../slices/incidentSlice';
import BasicLayout from '../layouts/BasicLayout';
import Filter from '../components/main/Filter';
import IncidentList from '../components/main/IncidentList';
import InfoForm from '../components/main/InfoForm';
import './MainPage.css';

const MainPage = () => {
  const dispatch = useDispatch();
  const { list, details, loading, error } = useSelector((state) => state.incident);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    createdBy: '',
  });

  useEffect(() => {
    dispatch(fetchIncidentList({}));
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    dispatch(fetchIncidentList(formData));
  };

  const handleIncidentClick = (id) => {
    dispatch(fetchIncidentDetails(id));
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
