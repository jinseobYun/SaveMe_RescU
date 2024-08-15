import React, { useEffect, useState } from "react";
import KakaoMap from "../components/map/KakaoMap";
import EmergencyList from "../components/map/EmergencyList";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmergencyList } from "../slices/emergencySlice";
import { useNavigate } from "react-router-dom";

import "./MapPage.css";

export default function Map() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { items, selectedHospital, route } = useSelector(
    (state) => state.emergencySlice
  );

  const [showAllMarkers, setShowAllMarkers] = useState(true);
  const [latlon, setLatlon] = useState(null);

  const handleShowAllMarkers = () => {
    setShowAllMarkers(!showAllMarkers);
  };

  const handleGoMain = () => {
    nav("/main");
  };

  // 로컬 스토리지나 세션 스토리지에서 값을 불러와 latlon에 할당
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("reportData")) || JSON.parse(localStorage.getItem("reportData"));
    if (storedData) {
      setLatlon({
        lat: storedData.latitude,
        lon: storedData.longitude,
      });
    }
  }, []);

  // 로컬 스토리지나 세션 스토리지가 변경되면 latlon을 업데이트
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

    // 클린업 함수로 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // latlon이 있을 때만 데이터를 가져옴
  useEffect(() => {
    if (latlon) {
      console.log(latlon.lat, latlon.lon);
      dispatch(fetchEmergencyList(latlon));
    }
  }, [dispatch, latlon]);

  // 페이지 전체 스크롤 제거
  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "";
    };

    disableScroll();

    return () => {
      enableScroll();
    };
  }, []);

  const markerPositions = showAllMarkers
    ? items.map((item) => [item.latitude, item.longitude])
    : selectedHospital
    ? [[selectedHospital.latitude, selectedHospital.longitude]]
    : [];

  return (
    <div className="map">
      <div className="map-left-side">
        <div className="controls">
          <button className="mappage-btn" onClick={handleShowAllMarkers}>
            자세히보기
          </button>
          <button className="mappage-btn" onClick={handleGoMain}>
            메인페이지
          </button>
        </div>
        <EmergencyList items={items} />
      </div>
      <div className="kakao-map-container">
        <KakaoMap
          markerPositions={markerPositions}
          route={route}
          size={[70, 100]}
        />
      </div>
    </div>
  );
}
