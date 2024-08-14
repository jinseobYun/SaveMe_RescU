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
// Refresh token 요청 함수
const tokenRegeneration = async () => {
  const refreshToken = localStorage.getItem("JWT-RefreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(`${serverHost}/refresh`, {
      refreshToken: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.log("Error refreshing token:", error);
    throw error;
  }
};

// Axios 인스턴스 생성
export const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_SERVER_DOMAIN,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  // 요청 인터셉터 추가
  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("JWT-AccessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 추가
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        (error.response.status === 401 || error.response.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const { accessToken, refreshToken } = await tokenRegeneration();
          localStorage.setItem("JWT-AccessToken", accessToken);
          localStorage.setItem("JWT-RefreshToken", refreshToken);
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (error) {
          console.log("Failed to refresh token, redirecting to login");
          localStorage.clear();
          window.location.replace("/");
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};