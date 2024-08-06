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
  const [showAllMarker, setShowAllMarker] = useState(false);

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

  // Mock
  // const markerPositions = [
  //   [latlng.lat, latlng.lng],
  // ];
  const markerPositions = items.map((item) => [item.latitude, item.longitude]);

  // api 연결 이후

  // Mock
  const emergencyItems = [
    {
      name: "대전 응급 의료원",
      address: "대전광역시 유성구 한밭대로",
      details: "응급실 가용병상 : 3 | 중증질환 수용가능정보 1",
      distance: 10,
      time: 5,
      phone: "054-123-1123",
    },
    {
      name: "대전 응급 의료원",
      address: "대전광역시 유성구 한밭대로",
      details: "응급실 가용병상 : 3 | 중증질환 수용가능정보 1",
      distance: 10,
      time: 5,
      phone: "054-123-1123",
    },
    {
      name: "대전 응급 의료원",
      address: "대전광역시 유성구 한밭대로",
      details: "응급실 가용병상 : 3 | 중증질환 수용가능정보 1",
      distance: 10,
      time: 5,
      phone: "054-123-1123",
    },
  ];

  return (
    <div className="map">
      <div className="map-left-side">
        <div className="controls">
          <button>환지위치로 센터조정</button>
          <button>전체마커표시</button>
        </div>
        {/* <EmergencyList items={emergencyItems} /> */}
        <EmergencyList items={items} />
      </div>
      <div className="kakao-map-container">
        <KakaoMap markerPositions={markerPositions} route={route} size={[70, 100]} />
      </div>
    </div>
  );
}
