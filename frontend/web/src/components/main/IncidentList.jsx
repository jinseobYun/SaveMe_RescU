import React from "react";
import ListItem from "./IncidentListItem";


// 필터된 데이터를 받아오기
const IncidentList = ({ data, onIncidentClick }) => {
  if (!data || !Array.isArray(data.content)) {
    return null;
  }
  return (
    <div className="incident-list">
      {data.content.map((item) => (
        <ListItem key={item.dispatchOrderId} item={item} onIncidentClick={onIncidentClick}/>
      ))}
    </div>
  );
};

export default IncidentList;
