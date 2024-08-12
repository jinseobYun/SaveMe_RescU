import http from './commonHttpApi';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// 서버 오류 테스트용 지연 호출 코드 // 
export const getToken = async (sessionId) => {
  try {
    // 세션아이디를 생성하며 요청
    // const sessionResponse = await http.post(`/api/sessions`);
    
    // 세션아이디를 지정해서 요청
    const sessionResponse = await http.post(`/api/sessions`, { customSessionId: sessionId });

    // 반환되는 세션아이디
    console.log("sessionResponse : ", sessionResponse.data);

    let tokenResponse;
    let attempts = 0;
    const maxAttempts = 5;

    while (!tokenResponse && attempts < maxAttempts) {
      try {
        // 세션 아이디에 대한 토큰값 반환 
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
