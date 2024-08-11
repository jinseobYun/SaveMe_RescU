import { Axios, ovAxios } from "@/api/http-commons";
import axiosRetry from 'axios-retry';

const http = Axios();
const ovHttp = ovAxios();

axiosRetry(http, { retries: 10 });
//TODO - axios retry handle
const getReportSessionId = async (success, fail) => {
  await http.get("/sessions/rooms").then(success).catch(fail);
}


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