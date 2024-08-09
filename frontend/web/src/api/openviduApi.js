import http from './commonHttpApi';

export const getToken = async (sessionId) => {
  try {
    // console.log("요청하는 sessionId는 : ", sessionId)
    // sessionId 지정하는 방법
    // const sessionResponse = await http.post(`/api/sessions`, { customSessionId: sessionId });
    const sessionResponse = await http.post(`/api/sessions`);
    console.log("sessionResponse : " ,sessionResponse)
    
    const tokenResponse = await http.post(`/api/sessions/${sessionResponse.data}/connections`, {});
    console.log("tokenResponse : " ,tokenResponse.data)
    return tokenResponse.data;
  } catch (error) {
    console.error('Error getting token:', error);
  }
};
