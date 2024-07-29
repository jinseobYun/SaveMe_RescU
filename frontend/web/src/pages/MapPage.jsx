import React from "react";
import { useEffect } from "react";
import KakaoMap from "../components/KakaoMap";
import EmergencyList from "../components/EmergencyList";
import "./MapPage.css";

export default function Map() {

  // 페이지 전체 스크롤 제거
  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    const enableScroll = () => {
      document.body.style.overflow = '';
    };

    disableScroll();

    // 컴포넌트 언마운트 시 스크롤 허용하기
    return () => {
      enableScroll();
    };
  }, []);

  // Mock
  const markerPositions = [
    [37.50802, 127.062835],
    [37.5074, 127.0619],
  ];

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
      <div className="left-side">
        <div className="controls">
          <button>환지위치로 센터조정</button>
          <button>전체마커표시</button>
        </div>
        <EmergencyList items={emergencyItems} />
      </div>
      <div className="kakao-map-container">
        <KakaoMap markerPositions={markerPositions} size={[70, 100]} />
      </div>
    </div>
  );
}
