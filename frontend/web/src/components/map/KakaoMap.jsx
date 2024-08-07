/* global kakao */
import React, { useEffect, useState, useRef } from "react";

const KakaoMap = ({ markerPositions = [], route=null, size = [70, 100] }) => {
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const container = useRef();

  // 환자 위치임시설정
  const latlon = {
    lat: 37.50802,
    lon: 127.062835,
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c2567af9a6459050759976f4ec47f1c2&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(latlon.lat, latlon.lon);
        const options = {
          center,
          level: 3,
        };
        const map = new kakao.maps.Map(container.current, options);
        setKakaoMap(map);
      });
    };

    return () => {
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


    // 환자용마커 
    const patientMarkerPosition = new kakao.maps.LatLng(latlon.lat, latlon.lon);
    const patientMarkerImage = new kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png  ', // 예시 마커 이미지
      new kakao.maps.Size(44, 44),
      { offset: new kakao.maps.Point(27, 69) }
    );
    const patientMarker = new kakao.maps.Marker({
      map: kakaoMap,
      position: patientMarkerPosition,
      image: patientMarkerImage,
    });



    const positions = markerPositions.map(
      (pos) => new kakao.maps.LatLng(...pos)
    );

    setMarkers((markers) => {
      markers.forEach((marker) => marker.setMap(null));
      return positions.map(
        (position) => new kakao.maps.Marker({ map: kakaoMap, position })
      );
    });

    if (positions.length > 0) {
      const bounds = positions.reduce(
        (bounds, latlng) => bounds.extend(latlng),
        new kakao.maps.LatLngBounds()
      );

      // 선택시, 환자 위치와 선택위치를 기준으로 bound 설정
      if (positions.length === 1) {
        bounds.extend(patientMarkerPosition);
      }

      kakaoMap.setBounds(bounds);
    }
  }, [kakaoMap, markerPositions]);

  // ★★★★ 지도에 경로 그리기 ★★★★★★★★★★★★★★★★★★★★★★★
  useEffect(() => {
    if (kakaoMap === null || route === null) return;

    const linePath = route.routes[0].sections[0].roads.flatMap((road) => {
      return road.vertexes.reduce((result, _, index, array) => {
        if (index % 2 === 0) {
          result.push(new kakao.maps.LatLng(array[index + 1], array[index]));
        }
        return result;
      }, []);
    });

    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#FF4C4C",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });

    polyline.setMap(kakaoMap);

    return () => {
      polyline.setMap(null);
    };
  }, [kakaoMap, route]);

  // ★★★★★★★★★★★★★★★★★★★★★★★★★★

  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
