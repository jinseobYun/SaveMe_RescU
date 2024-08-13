const averageGps = (gpsArr) => {
  const currentTime = new Date();

  const filteredGps = gpsArr.filter((data) => {
    const gpsTime = new Date(data.time);
    const timeDifference = (currentTime - gpsTime) / 1000 / 60;
    return timeDifference <= 3; // 3분 이내의 데이터만 필터링
  });

  if (filteredGps.length > 0) {
    const totalLatitude = filteredGps.reduce(
      (sum, data) => sum + data.location.latitude,
      0
    );
    const totalLongitude = filteredGps.reduce(
      (sum, data) => sum + data.location.longitude,
      0
    );

    const averageLatitude = totalLatitude / filteredGps.length;
    const averageLongitude = totalLongitude / filteredGps.length;

    return { latitude: averageLatitude, longitude: averageLongitude };
  } else {
    console.log("No GPS data within the last 3 minutes.");
  }
};

export { averageGps };
