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
  const accessToken = localStorage.getItem("accessToken");
  const response = await Axios.post("/members/refresh", {
    accessToken: accessToken,
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
      console.log(error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      if (response.status === 404) {
        console.log("404 페이지로 넘어가야 함!");
      }

      return response;
    },
    async function (error) {
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 401:
            const originRequest = config;
            const response = await tokenRegeneration();
            //리프레시 토큰 요청이 성공할 때
            if (response.status === 200) {
              const newAccessToken = response.data.token;
              localStorage.setItem("accessToken", response.data.accessToken);
              localStorage.setItem("refreshToken", response.data.refreshToken);
              axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
              //진행중이던 요청 이어서하기
              originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originRequest);
              //리프레시 토큰 요청이 실패할때(리프레시 토큰도 만료되었을때 = 재로그인 안내)
            } else if (response.status === 401) {
              notificationAlert("error", "다시 로그인 해주세요", () => {
                window.location.replace("/login");
              });
            } else {
              notificationAlert("error", "실패하셨습니다", () => { });
            }
            return new Promise(() => { });

          default:
            return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
export { Axios, loginAxios };
