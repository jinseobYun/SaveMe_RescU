import React from "react";
import { useEffect, useState } from "react";
import KakaoMap from "../components/map/KakaoMap";
import EmergencyList from "../components/map/EmergencyList";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmergencyList } from "../slices/emergencySlice";

import "./MapPage.css";

export default function Map() {
  // api 연결 시작 ★★★★★★★★★★★★★★★★★★★★
  const dispatch = useDispatch();
  const { items, selectedHospital, route } = useSelector(
    (state) => state.emergencySlice
  );

  // 마커 선택 수정필요
  const [showAllMarkers, setShowAllMarkers] = useState(true);

  const handleShowAllMarkers = () => {
    setShowAllMarkers(!showAllMarkers);
  };

  // 호출용 mock lat, lng
  const latlon = {
    lat: 37.50802,
    lon: 127.062835,
  };

  useEffect(() => {
    console.log(latlon.lat, latlon.lon);
    dispatch(fetchEmergencyList(latlon));
  }, [dispatch, latlon.lat, latlon.lon]);

  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

  // 페이지 전체 스크롤 제거
  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "";
    };

    disableScroll();

    // 컴포넌트 언마운트 시 스크롤 허용하기
    return () => {
      enableScroll();
    };
  }, []);

  // 전체 마커 on/off용 마커지정
  const markerPositions = showAllMarkers
    ? items.map((item) => [item.latitude, item.longitude])
    : selectedHospital
    ? [[selectedHospital.latitude, selectedHospital.longitude]]
    : [];

  return (
    <div className="map">
      <div className="map-left-side">
        <div className="controls">
          <button className="mappage-btn" onClick={handleShowAllMarkers} >자세히보기</button>
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
