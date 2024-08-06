import React from "react";
import { useDispatch } from "react-redux";
import { selectHospital, fetchRoute } from "../../slices/emergencySlice";

import "./EmergencyListItem.css";

// 호출용 mock lat, lng
const latlon = {
  lat: 37.50802,
  lon: 127.062835,
};

const EmergencyListItem = ({
  dutyName,
  dutyAddr,
  details,
  distance,
  time,
  dutyTel1,
  latitude,
  longitude,
  origin,
}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectHospital({dutyName, latitude, longitude}))
    dispatch(fetchRoute({ originX: latlon.lat, originY: latlon.lon, destinationX:latitude, destinationY:longitude }))
  }

  return (
    <div className="emergency-list-item" onClick={handleClick}>
      <div className="detail-left">
        <h3>{dutyName}</h3>
        <p>{dutyAddr}</p>
        <p>{details}</p>
        <p>{dutyTel1}</p>
      </div>
      <div className="detail-right">
        <div>거리 : {distance}</div>
        <div>소요시간 : {time}분</div>
        <button>경로표시</button>
      </div>
    </div>
  );
};

export default EmergencyListItem;
