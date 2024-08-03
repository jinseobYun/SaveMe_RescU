import axios from "axios";
import { API_SERVER_HOST, API_MOCK_SERVER_HOST, API_SERVER_DOMAIN } from "../config/apiConfig";

const host = `${API_SERVER_HOST}/members`;
const mockHost = `${API_MOCK_SERVER_HOST}/members`;
const serverHost = `${API_SERVER_DOMAIN}/members`


const header = {
};

export const loginPost = async (loginParam) => {
  const form = new FormData();
  form.append("memberId", loginParam.memberId);
  form.append("password", loginParam.password);

  try {
    // local host & postman
    // const res = await axios.post(`${host}/login`, form, header);
    // const res = await axios.post(`${mockHost}/login`, form, header);

    // 서버 호출
    const res = await axios.post(`${serverHost}/login`, form, header);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("에러발생 error : ", error);
    throw error;
  }
};
