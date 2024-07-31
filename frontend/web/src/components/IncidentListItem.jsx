import React from "react";
import "./IncidentListItem.css"

const IncidentListItem = ({ item }) => {
  return (
    <div className="incident-list-item">
      <div className="num">{item.emergencyId}</div>
      <div className="time">{item.reportTime}</div>
      <div className="charge">{item.handler}</div>
    </div>
  );
};

export default IncidentListItem;
