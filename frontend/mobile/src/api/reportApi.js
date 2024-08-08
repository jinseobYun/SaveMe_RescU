import { Axios } from "@/api/http-commons";

const http = Axios();

//TODO - 신고 요청, 로그인 되어 있으면 아이디 보내기

//TODO - 태깅 후 신고 요청
async function tagReport(data, success, fail) {
  await http.post("/members/", data).then(success).catch(fail);
}

//TODO - 몇번 방 들어갈까요?

export { tagReport }