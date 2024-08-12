import { useState, useEffect, useRef } from "react";

const useWatchLocation = (options = {}) => {
  const [location, setLocation] = useState();
  const [error, setError] = useState();
  const locationWatchId = useRef(null);
  const previousLocation = useRef(null); // 이전 위치 저장용 ref

  const handleSuccess = (pos) => {
    const { latitude, longitude } = pos.coords;
    const newLocation = { latitude, longitude };

    if (
      !previousLocation.current ||
      previousLocation.current.latitude !== newLocation.latitude ||
      previousLocation.current.longitude !== newLocation.longitude
    ) {
      setLocation(newLocation);
      previousLocation.current = newLocation;
    }
  };

  const handleError = (error) => {
    setError(error.message);
  };

  const cancelLocationWatch = () => {
    const { geolocation } = navigator;

    if (locationWatchId.current && geolocation) {
      geolocation.clearWatch(locationWatchId.current);
    }
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    locationWatchId.current = geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Clear the location watch instance when React unmounts the used component
    return cancelLocationWatch;
  }, [options]);

  return { location, cancelLocationWatch, error };
};

export default useWatchLocation;
