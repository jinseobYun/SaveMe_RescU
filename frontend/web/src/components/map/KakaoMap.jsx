/* global kakao */
import React, { useEffect, useState, useRef } from "react";

const KakaoMap = ({ markerPositions = [], route = null, size = [70, 100] }) => {
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [patientMarker, setPatientMarker] = useState(null);
  const container = useRef();

  const initialLatLon = { lat: 36.3553193257957, lon: 127.29820111515 };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c2567af9a6459050759976f4ec47f1c2&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(initialLatLon.lat, initialLatLon.lon);
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

  // 지도 크기와 위치 재설정
  useEffect(() => {
    if (kakaoMap === null) return;

    const center = kakaoMap.getCenter();
    const [width, height] = size;
    container.current.style.width = `${width}vw`;
    container.current.style.height = `${height}%`;

    kakaoMap.relayout();
    kakaoMap.setCenter(center);
  }, [kakaoMap, size]);

  // 마커 설정
  useEffect(() => {
    if (kakaoMap === null) return;

    const storedData = JSON.parse(localStorage.getItem("reportData"));

    if (storedData) {
      const patientPosition = new kakao.maps.LatLng(storedData.latitude, storedData.longitude);

      if (patientMarker) {
        patientMarker.setMap(null);
      }

      const newPatientMarker = new kakao.maps.Marker({
        map: kakaoMap,
        position: patientPosition,
        image: new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(44, 44),
          { offset: new kakao.maps.Point(27, 69) }
        ),
      });

      setPatientMarker(newPatientMarker);

      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(patientPosition);

      markerPositions.forEach(([lat, lon]) => {
        const position = new kakao.maps.LatLng(lat, lon);
        bounds.extend(position);
        const marker = new kakao.maps.Marker({
          map: kakaoMap,
          position,
        });
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      });

      kakaoMap.setBounds(bounds);
    }
  }, [kakaoMap, markerPositions]);

  // 로컬 스토리지 변화 감지
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "reportData") {
        const storedData = JSON.parse(event.newValue);
        if (storedData) {
          const patientPosition = new kakao.maps.LatLng(storedData.latitude, storedData.longitude);

          if (patientMarker) {
            patientMarker.setMap(null);
          }

          const newPatientMarker = new kakao.maps.Marker({
            map: kakaoMap,
            position: patientPosition,
            image: new kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              new kakao.maps.Size(44, 44),
              { offset: new kakao.maps.Point(27, 69) }
            ),
          });

          setPatientMarker(newPatientMarker);

          const bounds = new kakao.maps.LatLngBounds();
          bounds.extend(patientPosition);

          markerPositions.forEach(([lat, lon]) => {
            const position = new kakao.maps.LatLng(lat, lon);
            bounds.extend(position);
          });

          kakaoMap.setBounds(bounds);
        } else if (patientMarker) {
          patientMarker.setMap(null);
          setPatientMarker(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [kakaoMap, markerPositions, patientMarker]);

  // 지도에 경로 그리기
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

  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
