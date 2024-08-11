import { Axios, ovAxios } from "@/api/http-commons";
import axiosRetry from 'axios-retry';

const http = Axios();
const ovHttp = ovAxios();

// axiosRetry 설정
axiosRetry(ovHttp, {
  retries: 5, // 최대 5번 재시도
  retryCondition: (error) => error.response && error.response.status === 404, // 404 에러에 대해서만 재시도
  retryDelay: (retryCount) => 1000 // 1초 간격으로 재시도
});

const getReportSessionId = async (success, fail) => {
  try {
    const response = await ovHttp.get("/sessions/rooms");
    success(response);
  } catch (error) {
    fail(error);
  }
};

const getToken = async (sessionId) => {
  try {
    const sessionResponse = await ovHttp.post(`/sessions`, { customSessionId: sessionId });
    console.log("sessionResponse : ", sessionResponse);
    // console.log("sessionResponse : ", sessionResponse.data);

    let tokenResponse;

    try {
      tokenResponse = await ovHttp.post(`/sessions/${sessionResponse.data}/connections`, {});
      console.log("tokenResponse : ", tokenResponse.data);
    } catch (err) {


    }
    if (!tokenResponse) {
      throw new Error("Failed to get token after multiple attempts");
    }

    return tokenResponse.data;
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export { getReportSessionId, getToken }