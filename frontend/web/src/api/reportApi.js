import axios from "axios";
import { API_SERVER_DOMAIN } from "../config/apiConfig";

const serverHost = `${API_SERVER_DOMAIN}`;
const fetchServerHost = `${API_SERVER_DOMAIN}/dispatch-orders`

export const getReport = async (patientId, reporterId, latitude, longitude) => {
  try {
    const res = await axios.get(`${serverHost}/report-info`, {
      params: { patientId, reporterId, latitude, longitude },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error : ", error);
    throw error;
  }
};

export const postFirstInfo = async (firstInfo) => {
  try {
    console.log("1차 보내는정보:", firstInfo)
    console.log(`Bearer ${localStorage.getItem("JWT-AccessToken")}`)
    const res = await axios.post(`${fetchServerHost}/1st-info`, firstInfo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error : ", error);
    throw error;
  }
};

export const putSecondInfo  = async (secondInfo) => {
  try {
    const res = await axios.put(`${fetchServerHost}/2nd-info`, secondInfo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("이차정보 전송실패:", error);
    throw error;
  }
};
