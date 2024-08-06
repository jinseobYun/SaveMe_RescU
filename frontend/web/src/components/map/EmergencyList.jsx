import React from "react";
import EmergencyListItem from "./EmergencyListItem";
import "./EmergencyList.css";

const EmergencyList = ({ items }) => {
  return (
    <div className="emergency-list">
      <div className="list-title">응급실 리스트</div>
      <div className="list-items">
        {items.map((item, index) => (
          <EmergencyListItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default EmergencyList;
