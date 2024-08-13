import axios from "axios";
import {
  API_SERVER_HOST,
  API_MOCK_SERVER_HOST,
  API_SERVER_DOMAIN,
} from "../config/apiConfig";

const host = `${API_SERVER_HOST}/members`;
const mockHost = `${API_MOCK_SERVER_HOST}/members`;
const serverHost = `${API_SERVER_DOMAIN}/members`;

// JSON으로 요청

export const loginPost = async (loginParam) => {
  try {
    const res = await axios.post(`${serverHost}/login`, loginParam, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("에러 발생 error:", error);
    throw error;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const res = await axios.post(
      `${serverHost}/change-password`,
      passwordData,
      {
        header: {
          Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Error: 패스워드 변경 실패", error);
    throw error;
  }
};
