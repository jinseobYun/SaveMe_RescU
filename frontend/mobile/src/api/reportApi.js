import { Axios, ovAxios } from "@/api/http-commons";

const http = Axios();
const ovHttp = ovAxios();
//TODO - 신고 요청, 로그인 되어 있으면 아이디 보내기

//TODO - 태깅 후 신고 요청
const tagReport = async (data, success, fail) => {
  await http.post("/members/", data).then(success).catch(fail);
}

//TODO - 몇번 방 들어갈까요?


// const getToken = async (sessionId) => {
//   try {
//     // 세션 생성
//     const sessionResponse = await ovHttp.post('/api/sessions', {
//       customSessionId: sessionId,
//     });
//     const sessionIdData = sessionResponse.data; // 응답 데이터를 가져옴

//     // 토큰 생성
//     const tokenResponse = await ovHttp.post(
//       `/api/sessions/${sessionIdData}/connections`,
//       {}
//     );
//     const token = tokenResponse.data // 토큰 데이터를 가져옴
//     console.log(token)
//     return token; // 토큰 반환

//   } catch (error) {
//     console.error('Error in creating session : ', error);

//   }
// };
const getToken = async (sessionId) => {
  try {
    console.log("요청하는 sessionId는 : ", sessionId);

    const sessionResponse = await ovHttp.post(`/api/sessions`, { customSessionId: sessionId });
    console.log("sessionResponse : ", sessionResponse);
    // console.log("sessionResponse : ", sessionResponse.data);

    let tokenResponse;

    try {
      tokenResponse = await ovHttp.post(`/api/sessions/${sessionResponse.data}/connections`, {});
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

export { tagReport, getToken }