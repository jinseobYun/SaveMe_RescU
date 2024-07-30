import React from "react";
import "./EmergencyListItem.css";

const EmergencyListItem = ({
  name,
  address,
  details,
  distance,
  time,
  phone,
}) => {
  return (
    <div className="emergency-list-item">
      <div className="detail-left">
        <h3>{name}</h3>
        <p>{address}</p>
        <p>{details}</p>
        <p>{phone}</p>
      </div>
      <div className="detail-right">
        <div>거리 : {distance}km</div>
        <div>소요시간 : {time}분</div>
        <button>경로표시</button>
      </div>
    </div>
  );
};

export default EmergencyListItem;
