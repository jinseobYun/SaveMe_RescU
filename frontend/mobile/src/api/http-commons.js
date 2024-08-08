import axios from "axios";
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
  console.log(response);
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
        const response = await tokenRegeneration();
        //FIXME - 서버 500뜸
        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          //진행중이던 요청 이어서하기
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
          //리프레시 토큰 요청이 실패할때(리프레시 토큰도 만료되었을때 = 재로그인 안내)
        } else if (response.status === 401) {
          notificationAlert("error", "다시 로그인 해주세요", () => {
            window.location.replace("/login");
          });
        } else {
          notificationAlert("error", "실패하셨습니다", () => { });
        }
        return new Promise(() => { });
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
export { Axios, loginAxios };
