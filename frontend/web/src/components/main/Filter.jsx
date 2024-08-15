import React from "react";
import Input from "../elements/Input";
import Button from "../elements/Button";
import "./Filter.css";

const Filter = ({ formData, handleInputChange, handleFilter }) => (
  <div className="filter">
    <div className="condition">
      <div className="filter-date">
        <Input
          type="date"
          name="startDate"
          label="시작일자"
          value={formData.startDate}
          onChange={handleInputChange}
          // setValue={(value) => handleInputChange("startDate", value)}
        />
      </div>
      <div className="filter-date">
        <Input
          type="date"
          name="endDate"
          label="종료일자"
          value={formData.endDate}
          onChange={handleInputChange}
          // setValue={(value) => handleInputChange("endDate", value)}
        />
      </div>
      <div className="charge-input">
        <Input
          type="text"
          name="createdBy"
          label="담당자"
          value={formData.createdBy}
          onChange={handleInputChange}
          // setValue={(value) => handleInputChange("charge", value)}
        />
      </div>
      <div className="filter-btn">
        <Button _onClick={handleFilter} $height="2rem" $color="white" >검색</Button>
      </div>
    </div>
  </div>
);

export default Filter;
