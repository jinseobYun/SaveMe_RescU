import axios from "axios";
import {
  API_SERVER_DOMAIN,
} from "../config/apiConfig";

const serverHost = `${API_SERVER_DOMAIN}/members`;

// JSON으로 요청

export const loginPost = async (loginParam) => {
  try {
    const res = await axios.post(`${serverHost}/login`, loginParam, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const res = await axios.post(
      `${serverHost}/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWT-AccessToken")}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Error: 패스워드 변경 실패", error);
    throw error;
  }
};
