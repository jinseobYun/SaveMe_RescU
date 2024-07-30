import { Axios, loginAxios } from "@/api/http-commons";

const http = Axios();

async function registerUser(data, success, fail) {
  await http.post("/members/register", data).then(success).catch(fail);
}
async function login(id, pw, success, fail) {
  const data = {
    memberId: id,
    password: pw,
  };
  await http.post("/members/login", data).then(success).catch(fail);
}

async function checkIdDuplication(id) {
  const data = {
    memberId: id,
  };
  await http.post(`members/id-validate`, data).then(success).catch(fail);
}

async function updateUserPwd(type, data, success, fail) {
  switch (type) {
    case "find":
      await http
        .put("/members/password-not-login", data)
        .then(success)
        .catch(fail);
      break;
    case "update":
      const loginHttp = loginAxios();
      await loginHttp.put("/members/password", data).then(success).catch(fail);
  }
}

async function getUserInfo(loginId, success, fail) {
  await http.get(`/members/${loginId}`).then(success).catch(fail);
}

async function reqVerifyCode(type, data, success, fail) {
  //NOTE - type :{reg,id,pw}
  await http
    .get(`/members/phone-verify-code-${type}`)
    .then(success)
    .catch(fail);
}
//TODO - 아이디 찾기
//TODO - 비밀번호 찾기
//TODO - 비밀번호 변경
async function modifyUser(updateInfo, success, fail) {
  http.put("/members", updateInfo).then(success).catch(fail);
}

// async function tokenRegeneration(members, success, fail) {
//   await http.post("/members/refresh", members).then(success).catch(fail);
// }

// async function logout(loginId, success, fail) {
//   await http.get(`/members/logout/${loginId}`).then(success).catch(fail);
// }

export { registerUser, login, getUserInfo, updateUserPwd, checkIdDuplication, reqVerifyCode, }