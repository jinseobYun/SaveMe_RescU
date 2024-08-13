import axios from "axios";
import { API_SERVER_DOMAIN } from "../config/apiConfig";

const serverHost = `${API_SERVER_DOMAIN}`;

export const getEmergencyList = async ({ lat, lon }) => {
  try {
    const response = await axios.get(`${serverHost}/nearest-hospitals`, {
      params: { lat: lat.toString(), lon: lon.toString() },
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("JWT-AccessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    console.error("응급실 호출 에러 :", error.response);
    throw error;
  }
};

export const getRoute = async ({
  originX,
  originY,
  destinationX,
  destinationY,
}) => {
  try {
    const response = await axios.get(`${serverHost}/directions`, {
      params: { originX:originX.toString(), originY:originY.toString(), destinationX:destinationX.toString(), destinationY:destinationY.toString() },
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("JWT-AccessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    console.error("경로 호출 에러: ", error.response);
    throw error;
  }
};
