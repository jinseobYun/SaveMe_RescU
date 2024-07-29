/* global kakao */
import React, { useEffect, useState, useRef } from "react";

const KakaoMap = ({ markerPositions = [], size = [70, 100] }) => {
  const [kakaoMap, setKakaoMap] = useState(null);
  const [ markers ,setMarkers ] = useState([]);
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c2567af9a6459050759976f4ec47f1c2&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(37.50802, 127.062835);
        const options = {
          center,
          level: 3,
        };
        const map = new kakao.maps.Map(container.current, options);
        setKakaoMap(map);
      });
    };

    return () => {
      // Clean up script and map instances when component unmounts
      document.head.removeChild(script);
      setKakaoMap(null);
    };
  }, []);

  useEffect(() => {
    if (kakaoMap === null) return;

    const center = kakaoMap.getCenter();
    const [width, height] = size;
    container.current.style.width = `${width}vw`;
    container.current.style.height = `${height}%`;

    kakaoMap.relayout();
    kakaoMap.setCenter(center);
  }, [kakaoMap, size]);

  useEffect(() => {
    if (kakaoMap === null) return;

    const positions = markerPositions.map((pos) => new kakao.maps.LatLng(...pos));

    setMarkers((markers) => {
      markers.forEach((marker) => marker.setMap(null));
      return positions.map((position) => new kakao.maps.Marker({ map: kakaoMap, position }));
    });

    if (positions.length > 0) {
      const bounds = positions.reduce(
        (bounds, latlng) => bounds.extend(latlng),
        new kakao.maps.LatLngBounds()
      );
      kakaoMap.setBounds(bounds);
    }
  }, [kakaoMap, markerPositions]);

  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
