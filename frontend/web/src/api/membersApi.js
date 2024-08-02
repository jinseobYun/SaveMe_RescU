import axios from "axios";
import { API_SERVER_HOST, API_MOCK_SERVER_HOST } from "../config/apiConfig";

const host = `${API_SERVER_HOST}/members`;
const mockHost = `${API_MOCK_SERVER_HOST}/members`;


const header = {
};

export const loginPost = async (loginParam) => {
  const form = new FormData();
  form.append("memberId", loginParam.memberId);
  form.append("password", loginParam.password);

  try {
    // const res = await axios.post(`${host}/login`, form, header);
    const res = await axios.post(`${mockHost}/login`, form, header);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
