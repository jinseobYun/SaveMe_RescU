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
function loginAxios() {
  const jwtToken = sessionStorage.getItem("accessToken");

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";
  return instance;
}
export { Axios, loginAxios };
