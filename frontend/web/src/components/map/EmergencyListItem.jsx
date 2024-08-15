import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectHospital, fetchRoute } from "../../slices/emergencySlice";
import PhoneImage from "../../assets/phone-icon.png";
import HospitalNameImage from "../../assets/hospital-name-icon.png";
import HospitalMapImage from "../../assets/hospital-map-icon.png";

import "./EmergencyListItem.css";

// 호출용 mock lat, lng
const getInitialLatLon = () => {
  const storedData = JSON.parse(localStorage.getItem("reportData"));
  return storedData
    ? { lat: storedData.latitude, lon: storedData.longitude }
    : { lat: 36.3553193257957, lon: 127.29820111515 }; // 기본값
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

  const [latlon, setLatlon] = useState(getInitialLatLon());

  // 로컬 스토리지 변화 감지 및 latlon 업데이트
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "reportData") {
        const storedData = JSON.parse(event.newValue);
        if (storedData) {
          setLatlon({
            lat: storedData.latitude,
            lon: storedData.longitude,
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
        <p>
          <img
            src={HospitalNameImage}
            alt="병원명 아이콘"
            className="phone-logo-image"
          />
          {dutyName}
        </p>
        <div className="separator"></div>
        <p>
          <img
            src={HospitalMapImage}
            alt="병원위치 아이콘"
            className="phone-logo-image"
          />
          {dutyAddr}
        </p>
        <div className="separator"></div>
        <span style={{ color: hvoc === 0 ? "red" : "green" }}>
          응급실 {hvoc >= 0 ? hvoc : -hvoc}
        </span>
        &nbsp; &nbsp;
        <span style={{ color: hvec === 0 ? "red" : "green" }}>
          수술실 {hvec >= 0 ? hvec : -hvec}
        </span>
        <div className="separator"></div>
        <p>
          <img
            src={PhoneImage}
            alt="전화 아이콘"
            className="phone-logo-image"
          />
          {dutyTel1}
        </p>
      </div>
      <div className="detail-right">
        <div className="distance-info">
          {selectedInfo &&
            selectedHospital &&
            selectedHospital.dutyName === dutyName && (
              <>
                <div>
                  거리 : {(selectedInfo.summary.distance / 1000).toFixed(2)} km
                </div>
                <div>소요시간 : {Math.floor(selectedInfo.summary.duration / 60)}분 </div>
              </>
            )}
        </div>
        <button className="find-direction" onClick={handleClick}>
          경로표시
        </button>
      </div>
    </div>
  );
};

export default EmergencyListItem;
