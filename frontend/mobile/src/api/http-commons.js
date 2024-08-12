import axios from "axios";

import { successAlert } from '@/util/notificationAlert';
function Axios() {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";

  return instance;
}
async function tokenRegeneration() {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await Axios().post("/members/refresh", {
    refreshToken: refreshToken,
  });
  return response;
}

function loginAxios() {
  const refreshToken = localStorage.getItem("refreshToken");

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";

  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      config.headers["Content-Type"] = "application/json";
      config.headers["Authorization"] = `Bearer ${accessToken}`;

      return config;
    },
    (error) => {
      console.log(error.toJSON());
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 || error.response.status === 403) {
        try {
          const response = await tokenRegeneration();
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          //진행중이던 요청 이어서하기
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (error) {
          successAlert("다시 로그인 해주세요", () => {
            window.location.replace("/app/login");
            localStorage.removeItem("userStore");
            return new Promise(() => { });
          });

        }

      }
    }
  );
  return instance;
}

function ovAxios() {

  const instance = axios.create({
    baseURL: import.meta.env.VITE_OV_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + import.meta.env.VITE_OV_SERVER_SECRET),
    },

  });

  return instance;
}

function fcmAxios() {

  const instance = axios.create({
    baseURL: import.meta.env.VITE_FCM_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },

  });
  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      config.headers["Content-Type"] = "application/json";
      config.headers["Authorization"] = `Bearer ${accessToken}`;

      return config;
    },
    (error) => {
      console.log(error.toJSON());
      return Promise.reject(error);
    }
  );
  return instance;
}
export { Axios, loginAxios, ovAxios, fcmAxios };
