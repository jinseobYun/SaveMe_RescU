import React from "react";
import "./IncidentListItem.css"

const IncidentListItem = ({ item, onIncidentClick }) => {

  const time = new Date(item.reportedTime).toLocaleDateString()

  return (
    <div className="incident-list-item" onClick={() => onIncidentClick(item.dispatchOrderId)}>
      <div className="num">{item.dispatchOrderId}</div>
      <div className="time">{time}</div>
      <div className="charge">{item.createdBy}</div>
    </div>
  );
};

export default IncidentListItem;
