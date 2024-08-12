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
  hvec,
  hvoc,
  dutyTel1,
  latitude,
  longitude,
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
        <p>병원 가용 현황 | 응급실 {hvec >= 0 ? hvec : -hvec} 수술실 {hvoc >= 0 ? hvoc : -hvoc}</p>
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
        <button onClick={handleClick}>경로표시</button>
      </div>
    </div>
  );
};

export default EmergencyListItem;
