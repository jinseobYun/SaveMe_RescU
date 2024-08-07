import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const selectedInfo = useSelector(
    (state) => state.emergencySlice.selectedInfo
  );
  const selectedHospital = useSelector(
    (state) => state.emergencySlice.selectedHospital
  );


  const handleClick = () => {
    dispatch(selectHospital({ dutyName, latitude, longitude }));
    dispatch(
      fetchRoute({
        originX: latlon.lat,
        originY: latlon.lon,
        destinationX: latitude,
        destinationY: longitude,
      })
    );
  };

  return (
    <div className="emergency-list-item">
      <div className="detail-left">
        <h3>{dutyName}</h3>
        <p>{dutyAddr}</p>
        <p>{details}</p>
        <p>{dutyTel1}</p>
      </div>
      <div className="detail-right">
        {selectedInfo && selectedHospital && selectedHospital.dutyName === dutyName && (
          <>
            <div>
              거리 : {(selectedInfo.summary.distance / 1000).toFixed(2)} km
            </div>
            <div>
            소요시간 :
            </div>
            <div>
              {Math.floor(selectedInfo.summary.duration / 60)}분{" "}
              {selectedInfo.summary.duration % 60}초
            </div>
          </>
        )}
        {/* <div>거리 : {distance}</div>
        <div>소요시간 : {time}분</div> */}
        <button onClick={handleClick}>경로표시</button>
      </div>
    </div>
  );
};

export default EmergencyListItem;
