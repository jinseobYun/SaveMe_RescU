import http from './commonHttpApi';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// export const getToken = async (sessionId) => {
//   try {
//     console.log("요청하는 sessionId는 : ", sessionId)
//     // sessionId 지정하는 방법
//     // const sessionResponse = await http.post(`/api/sessions`, { customSessionId: sessionId });
//     const sessionResponse = await http.post(`/api/sessions`, { customSessionId: sessionId });
//     // const sessionResponse = await http.post(`/api/sessions`);
//     console.log("sessionResponse : " ,sessionResponse)
//     console.log("sessionResponse : " ,sessionResponse.data)

//     const tokenResponse = await http.post(`/api/sessions/${sessionResponse.data.id}/connections`, {});
//     console.log("tokenResponse : " ,tokenResponse.data)
//     return tokenResponse.data;
//   } catch (error) {
//     console.error('Error getting token:', error);
//   }
// };

// 서버 오류 테스트용 지연 호출 코드 // 
export const getToken = async (sessionId) => {
  try {
    console.log("요청하는 sessionId는 : ", sessionId);

    // 세션아이디를 생성하며 요청
    const sessionResponse = await http.post(`/api/sessions`);
    
    // 세션아이디를 지정해서 요청
    // const sessionResponse = await http.post(`/api/sessions`, { customSessionId: sessionId });
    console.log("sessionResponse : ", sessionResponse);
    console.log("sessionResponse : ", sessionResponse.data);

    let tokenResponse;
    let attempts = 0;
    const maxAttempts = 5;

    while (!tokenResponse && attempts < maxAttempts) {
      try {
        // tokenResponse = await http.post(`/api/sessions/${sessionResponse.data.id}/connections`, {});
        tokenResponse = await http.post(`/api/sessions/${sessionResponse.data}/connections`, {});
        console.log("tokenResponse : ", tokenResponse.data);
      } catch (err) {
        console.log("Retrying to get token...", attempts + 1);
        await delay(1000);
        attempts++;
      }
    }

    if (!tokenResponse) {
      throw new Error("Failed to get token after multiple attempts");
    }

    return tokenResponse.data;
  } catch (error) {
    console.error('Error getting token:', error);
  }
};
