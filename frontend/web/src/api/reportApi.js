import axios from "axios";
import { API_SERVER_HOST } from "../config/apiConfig";
import { API_SERVER_DOMAIN } from "../config/apiConfig";

const host = `${API_SERVER_HOST}/report`;
const serverHost = `${API_SERVER_DOMAIN}/report`;

export const getReport = async (memberId) => {
  try {
    const res = await axios.get(`${host}/${memberId}`, {
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
    const res = await axios.post(`${host}/1st-info`, firstInfo, {
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

export const postSecondInfo = async (secondInfo) => {
  try {
    const res = await axios.post(`${serverHost}/2nd-info`, secondInfo, {
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
