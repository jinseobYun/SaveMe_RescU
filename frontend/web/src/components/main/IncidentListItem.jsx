import React from "react";
import "./IncidentListItem.css"

const IncidentListItem = ({ item, onIncidentClick }) => {
  return (
    <div className="incident-list-item" onClick={() => onIncidentClick(item.dispatchOrderId)}>
      <div className="num">{item.emergencyId}</div>
      <div className="time">{item.reportTime}</div>
      <div className="charge">{item.handler}</div>
    </div>
  );
};

export default IncidentListItem;
